import * as THREE from '../vendors/three/three.module.js';

(function () {
  'use strict';

  var mount = document.getElementById('hanging-badge');
  var canvas = document.getElementById('hanging-badge-canvas');
  var hitArea = document.getElementById('hanging-badge-hit-area');
  if (!mount || !canvas || !hitArea) return;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch (error) {
    mount.classList.add('hanging-badge--unsupported');
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  camera.position.set(0, 0, 6.8);
  scene.add(new THREE.HemisphereLight(0xdce8ff, 0x11141b, 2.15));
  var keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(-2.5, 3.5, 5);
  scene.add(keyLight);
  var rimLight = new THREE.DirectionalLight(0x6d9dff, 1.1);
  rimLight.position.set(3, -1.5, -2);
  scene.add(rimLight);

  function makeStrapTexture() {
    var source = document.createElement('canvas');
    source.width = 256;
    source.height = 512;
    var context = source.getContext('2d');
    context.fillStyle = '#1c222b';
    context.fillRect(0, 0, source.width, source.height);
    for (var i = 0; i < 20; i++) {
      context.fillStyle = i % 2 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.12)';
      context.fillRect(i * 14, 0, 7, source.height);
    }
    context.fillStyle = 'rgba(187,202,225,.72)';
    context.font = '700 17px Arial, sans-serif';
    context.textAlign = 'center';
    for (var y = 38; y < source.height + 40; y += 110) {
      context.save();
      context.translate(128, y);
      context.rotate(-Math.PI / 2);
      context.fillText('S O L  ·  DISTRICT 33', 0, 5);
      context.restore();
    }
    var texture = new THREE.CanvasTexture(source);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(1, 3);
    return texture;
  }

  function makeCardTexture() {
    var source = document.createElement('canvas');
    source.width = 640;
    source.height = 840;
    var context = source.getContext('2d');
    var background = context.createLinearGradient(0, 0, 640, 840);
    background.addColorStop(0, '#f0eee8');
    background.addColorStop(1, '#c9c9c5');
    context.fillStyle = background;
    context.fillRect(0, 0, 640, 840);

    context.fillStyle = '#17191e';
    context.fillRect(0, 0, 640, 154);
    context.fillStyle = '#b7c3d5';
    context.font = '700 25px Arial, sans-serif';
    context.textAlign = 'left';
    context.fillText('SONS OF LIBERTY', 42, 58);
    context.fillStyle = '#8e99a9';
    context.font = '15px Courier New, monospace';
    context.fillText('FIELD IDENTIFICATION', 42, 94);
    context.fillStyle = '#d8dde6';
    context.fillRect(42, 122, 556, 2);

    context.fillStyle = '#252932';
    context.beginPath();
    context.arc(320, 312, 99, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = '#aab6c9';
    context.lineWidth = 3;
    context.stroke();
    context.fillStyle = '#e7e9ec';
    context.textAlign = 'center';
    context.font = '700 80px Arial, sans-serif';
    context.fillText('S', 320, 340);

    context.fillStyle = '#17191e';
    context.font = '700 35px Arial, sans-serif';
    context.fillText('SONS OF LIBERTY', 320, 475);
    context.fillStyle = '#555b65';
    context.font = '21px Courier New, monospace';
    context.fillText('DISTRICT 33 · OREGON', 320, 518);

    context.fillStyle = '#252932';
    context.fillRect(42, 590, 556, 2);
    context.textAlign = 'left';
    context.fillStyle = '#545963';
    context.font = '16px Courier New, monospace';
    context.fillText('AUTHORIZED FIELD PASS', 42, 632);
    context.fillStyle = '#17191e';
    context.font = '700 22px Arial, sans-serif';
    context.fillText('D33  /  ACTIVE', 42, 676);
    context.fillStyle = '#343942';
    for (var bar = 0; bar < 45; bar++) {
      var width = [2, 3, 5, 7][bar % 4];
      context.fillRect(42 + bar * 12, 727, width, 58);
    }
    context.fillStyle = '#6d7480';
    context.font = '13px Courier New, monospace';
    context.fillText('US-OR  ·  33', 42, 813);

    var texture = new THREE.CanvasTexture(source);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  var strapCount = 30;
  var restLength = 2.08;
  var segmentLength = restLength / strapCount;
  var anchor = new THREE.Vector3(0, 1.78, 0);
  var points = [];
  var previous = [];
  for (var index = 0; index <= strapCount; index++) {
    var progress = index / strapCount;
    var point = new THREE.Vector3(anchor.x + Math.sin(progress * Math.PI) * 0.035, anchor.y - progress * restLength, 0);
    points.push(point);
    previous.push(new THREE.Vector3(point.x - Math.sin(progress * Math.PI) * 0.012, point.y, point.z));
  }

  var strapGeometry = new THREE.BufferGeometry();
  var strapVertices = new Float32Array((strapCount + 1) * 2 * 3);
  var strapUVs = new Float32Array((strapCount + 1) * 2 * 2);
  var strapIndices = [];
  for (var vertexIndex = 0; vertexIndex <= strapCount; vertexIndex++) {
    var uvOffset = vertexIndex * 4;
    strapUVs[uvOffset] = 0;
    strapUVs[uvOffset + 1] = vertexIndex / strapCount;
    strapUVs[uvOffset + 2] = 1;
    strapUVs[uvOffset + 3] = vertexIndex / strapCount;
    if (vertexIndex < strapCount) {
      var first = vertexIndex * 2;
      strapIndices.push(first, first + 1, first + 2, first + 1, first + 3, first + 2);
    }
  }
  strapGeometry.setAttribute('position', new THREE.BufferAttribute(strapVertices, 3));
  strapGeometry.setAttribute('uv', new THREE.BufferAttribute(strapUVs, 2));
  strapGeometry.setIndex(strapIndices);
  var strap = new THREE.Mesh(strapGeometry, new THREE.MeshStandardMaterial({
    map: makeStrapTexture(),
    roughness: 0.48,
    metalness: 0.38,
    side: THREE.DoubleSide
  }));
  scene.add(strap);

  var badge = new THREE.Group();
  var edgeMaterial = new THREE.MeshStandardMaterial({ color: 0x30343c, metalness: 0.7, roughness: 0.28 });
  var frontMaterial = new THREE.MeshStandardMaterial({ map: makeCardTexture(), metalness: 0.08, roughness: 0.58 });
  var rearMaterial = new THREE.MeshStandardMaterial({ color: 0x242832, metalness: 0.25, roughness: 0.54 });
  var card = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.7, 0.045), [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, frontMaterial, rearMaterial]);
  card.position.y = -0.9;
  badge.add(card);

  var grommet = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.026, 10, 24), new THREE.MeshStandardMaterial({ color: 0x9fa7b5, metalness: 0.88, roughness: 0.22 }));
  grommet.position.set(0, -0.07, 0.045);
  badge.add(grommet);
  var clip = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.15, 0.085), new THREE.MeshStandardMaterial({ color: 0x9aa2ae, metalness: 0.9, roughness: 0.2 }));
  clip.position.set(0, -0.01, 0.06);
  badge.add(clip);
  var clipPin = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.18, 12), new THREE.MeshStandardMaterial({ color: 0x424751, metalness: 0.82, roughness: 0.28 }));
  clipPin.rotation.z = Math.PI / 2;
  clipPin.position.set(0, -0.04, 0.12);
  badge.add(clipPin);
  scene.add(badge);

  var pin = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 10), new THREE.MeshStandardMaterial({ color: 0xc3cbd7, metalness: 0.75, roughness: 0.25 }));
  pin.position.copy(anchor);
  scene.add(pin);

  var raycaster = new THREE.Raycaster();
  var pointer = new THREE.Vector2();
  var dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  var dragTarget = null;
  var dragOffset = new THREE.Vector3();
  var dragVelocity = new THREE.Vector3();
  var lastDragTarget = new THREE.Vector3();
  var lastDragTime = 0;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clock = new THREE.Clock();
  var accumulator = 0;
  var elapsed = 0;
  var fixedStep = 1 / 120;

  function setPointer(event) {
    var rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  hitArea.addEventListener('pointerdown', function (event) {
    setPointer(event);
    scene.updateMatrixWorld(true);
    raycaster.setFromCamera(pointer, camera);
    var hit = raycaster.intersectObject(card, false)[0];
    if (!hit) return;
    event.preventDefault();
    hitArea.setPointerCapture(event.pointerId);
    dragOffset.copy(hit.point).sub(points[strapCount]);
    dragTarget = points[strapCount].clone();
    lastDragTarget.copy(dragTarget);
    lastDragTime = performance.now();
    dragVelocity.set(0, 0, 0);
  });

  hitArea.addEventListener('pointermove', function (event) {
    if (!dragTarget) return;
    setPointer(event);
    raycaster.setFromCamera(pointer, camera);
    var worldPoint = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(dragPlane, worldPoint)) return;
    var nextTarget = worldPoint.sub(dragOffset);
    var now = performance.now();
    var delta = Math.max(1, now - lastDragTime) / 1000;
    dragVelocity.copy(nextTarget).sub(lastDragTarget).multiplyScalar(1 / delta);
    dragTarget.copy(nextTarget);
    lastDragTarget.copy(nextTarget);
    lastDragTime = now;
  });

  function releaseBadge() {
    if (!dragTarget) return;
    dragTarget = null;
    previous[strapCount].copy(points[strapCount]).addScaledVector(dragVelocity, -fixedStep);
    canvas.style.cursor = 'grab';
  }
  hitArea.addEventListener('pointerup', releaseBadge);
  hitArea.addEventListener('pointercancel', releaseBadge);

  function simulate(step) {
    var gravity = -9.5;
    var wind = reducedMotion ? 0 : Math.sin(elapsed * 1.3) * 0.35 + Math.sin(elapsed * 0.57 + 1.8) * 0.18;
    for (var i = 1; i <= strapCount; i++) {
      if (i === strapCount && dragTarget) {
        points[i].copy(dragTarget);
        continue;
      }
      var current = points[i];
      var old = previous[i];
      var velocityX = (current.x - old.x) * 0.996;
      var velocityY = (current.y - old.y) * 0.996;
      var velocityZ = (current.z - old.z) * 0.992;
      old.copy(current);
      current.x += velocityX + wind * step * step;
      current.y += velocityY + gravity * step * step;
      current.z += velocityZ;
    }

    for (var iteration = 0; iteration < 9; iteration++) {
      points[0].copy(anchor);
      if (dragTarget) points[strapCount].copy(dragTarget);
      for (var segment = 0; segment < strapCount; segment++) {
        var firstPoint = points[segment];
        var secondPoint = points[segment + 1];
        var difference = secondPoint.clone().sub(firstPoint);
        var distance = Math.max(0.0001, difference.length());
        var correction = difference.multiplyScalar((distance - segmentLength) / distance);
        if (segment === 0) {
          secondPoint.sub(correction);
        } else if (segment + 1 === strapCount && dragTarget) {
          firstPoint.add(correction);
        } else {
          firstPoint.addScaledVector(correction, 0.5);
          secondPoint.addScaledVector(correction, -0.5);
        }
      }
    }
  }

  function updateStrap() {
    for (var i = 0; i <= strapCount; i++) {
      var before = points[Math.max(0, i - 1)];
      var after = points[Math.min(strapCount, i + 1)];
      var tangent = after.clone().sub(before).normalize();
      var perpendicular = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
      var twist = Math.sin(elapsed * 1.45 + i * 0.34) * 0.48 + Math.sin(i * 0.18) * 0.08;
      var side = perpendicular.multiplyScalar(Math.cos(twist)).add(new THREE.Vector3(0, 0, Math.sin(twist))).normalize().multiplyScalar(0.105);
      var left = points[i].clone().sub(side);
      var right = points[i].clone().add(side);
      var offset = i * 6;
      strapVertices[offset] = left.x;
      strapVertices[offset + 1] = left.y;
      strapVertices[offset + 2] = left.z;
      strapVertices[offset + 3] = right.x;
      strapVertices[offset + 4] = right.y;
      strapVertices[offset + 5] = right.z;
    }
    strapGeometry.attributes.position.needsUpdate = true;
    strapGeometry.computeVertexNormals();
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
  if (window.ResizeObserver) new ResizeObserver(resize).observe(mount);
  window.addEventListener('resize', resize);
  resize();

  function frame() {
    requestAnimationFrame(frame);
    var delta = Math.min(clock.getDelta(), 0.05);
    elapsed += delta;
    accumulator += delta;
    while (accumulator >= fixedStep) {
      simulate(fixedStep);
      accumulator -= fixedStep;
    }
    updateStrap();
    badge.position.copy(points[strapCount]);
    var tangent = points[strapCount].clone().sub(points[strapCount - 1]);
    badge.rotation.z += (Math.atan2(tangent.x, -tangent.y) * 0.4 - badge.rotation.z) * 0.12;
    scene.updateMatrixWorld(true);
    var canvasRect = canvas.getBoundingClientRect();
    var mountRect = mount.getBoundingClientRect();
    var halfWidth = 0.65;
    var halfHeight = 0.85;
    var projected = [
      new THREE.Vector3(-halfWidth, -halfHeight, 0),
      new THREE.Vector3(halfWidth, -halfHeight, 0),
      new THREE.Vector3(halfWidth, halfHeight, 0),
      new THREE.Vector3(-halfWidth, halfHeight, 0)
    ].map(function (corner) {
      return corner.applyMatrix4(card.matrixWorld).project(camera);
    });
    var xs = projected.map(function (point) { return canvasRect.left + (point.x + 1) * canvasRect.width / 2 - mountRect.left; });
    var ys = projected.map(function (point) { return canvasRect.top + (1 - point.y) * canvasRect.height / 2 - mountRect.top; });
    var minX = Math.min.apply(Math, xs);
    var maxX = Math.max.apply(Math, xs);
    var minY = Math.min.apply(Math, ys);
    var maxY = Math.max.apply(Math, ys);
    hitArea.style.left = minX + 'px';
    hitArea.style.top = minY + 'px';
    hitArea.style.width = Math.max(0, maxX - minX) + 'px';
    hitArea.style.height = Math.max(0, maxY - minY) + 'px';
    renderer.render(scene, camera);
  }
  frame();
})();

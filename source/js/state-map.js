(function () {
  'use strict';

  var states = [
    ['AL', 'Alabama', 22], ['AK', 'Alaska', 49],
    ['AZ', 'Arizona', 48], ['AR', 'Arkansas', 25],
    ['CA', 'California', 31], ['CO', 'Colorado', 38],
    ['CT', 'Connecticut', 5], ['DE', 'Delaware', 1],
    ['FL', 'Florida', 27], ['GA', 'Georgia', 4],
    ['HI', 'Hawaii', 50], ['ID', 'Idaho', 43],
    ['IL', 'Illinois', 21], ['IN', 'Indiana', 19],
    ['IA', 'Iowa', 29], ['KS', 'Kansas', 34],
    ['KY', 'Kentucky', 15], ['LA', 'Louisiana', 18],
    ['ME', 'Maine', 23], ['MD', 'Maryland', 7],
    ['MA', 'Massachusetts', 6], ['MI', 'Michigan', 26],
    ['MN', 'Minnesota', 32], ['MS', 'Mississippi', 20],
    ['MO', 'Missouri', 24], ['MT', 'Montana', 41],
    ['NE', 'Nebraska', 37], ['NV', 'Nevada', 36],
    ['NH', 'New Hampshire', 9], ['NJ', 'New Jersey', 3],
    ['NM', 'New Mexico', 47], ['NY', 'New York', 11],
    ['NC', 'North Carolina', 12], ['ND', 'North Dakota', 39],
    ['OH', 'Ohio', 17], ['OK', 'Oklahoma', 46],
    ['OR', 'Oregon', 33], ['PA', 'Pennsylvania', 2],
    ['RI', 'Rhode Island', 13], ['SC', 'South Carolina', 8],
    ['SD', 'South Dakota', 40], ['TN', 'Tennessee', 16],
    ['TX', 'Texas', 28], ['UT', 'Utah', 45],
    ['VT', 'Vermont', 14], ['VA', 'Virginia', 10],
    ['WA', 'Washington', 42], ['WV', 'West Virginia', 35],
    ['WI', 'Wisconsin', 30], ['WY', 'Wyoming', 44]
  ].map(function (item) {
    return { code: item[0], name: item[1], order: item[2] };
  });

  function regionFor(code) {
    if ('CT ME MA NH RI VT NJ NY PA'.split(' ').indexOf(code) !== -1) return 'Northeast';
    if ('IL IN MI OH WI IA KS MN MO NE ND SD'.split(' ').indexOf(code) !== -1) return 'Midwest';
    if ('DE FL GA MD NC SC VA WV AL KY MS TN AR LA OK TX'.split(' ').indexOf(code) !== -1) return 'South';
    return 'West';
  }

  function chineseNumber(number) {
    var digits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    if (number < 10) return digits[number];
    if (number < 20) return '十' + (number % 10 ? digits[number % 10] : '');
    var tens = Math.floor(number / 10);
    var ones = number % 10;
    return digits[tens] + '十' + (ones ? digits[ones] : '');
  }

  function companyName(state) {
    var details = companyDetails(state);
    return details.chinese + ' ' + details.english;
  }

  function companyDetails(state) {
    return {
      chinese: '第' + chineseNumber(state.order) + '区公司',
      english: 'District ' + state.order + ' Company'
    };
  }

  function makeSection(title, rows) {
    var section = document.createElement('section');
    section.className = 'state-info__section';
    var heading = document.createElement('h3');
    heading.textContent = title;
    section.appendChild(heading);
    var list = document.createElement('dl');

    rows.forEach(function (row) {
      var wrapper = document.createElement('div');
      wrapper.className = 'state-info__row';
      var label = document.createElement('dt');
      label.textContent = row[0];
      var value = document.createElement('dd');
      if (row[2] === 'company') {
        value.className = 'state-info__company-name';
        var chineseName = document.createElement('span');
        chineseName.textContent = row[1].chinese;
        var englishName = document.createElement('strong');
        englishName.textContent = row[1].english;
        value.append(chineseName, document.createElement('br'), englishName);
      } else {
        value.textContent = row[1];
      }
      wrapper.append(label, value);
      list.appendChild(wrapper);
    });

    section.appendChild(list);
    return section;
  }

  function buildSections(state, profile) {
    if (profile && Array.isArray(profile.sections) && profile.sections.length) {
      return profile.sections.map(function (item, index) {
        var section = document.createElement('section');
        section.className = 'state-info__section';
        var heading = document.createElement('h3');
        heading.textContent = item.title || ('Section ' + (index + 1));
        section.appendChild(heading);
        if (item.subtitle) {
          var subtitle = document.createElement('p');
          subtitle.className = 'state-info__section-subtitle';
          subtitle.textContent = item.subtitle;
          section.appendChild(subtitle);
        }

        var list = document.createElement('dl');
        (Array.isArray(item.items) ? item.items : []).forEach(function (entry) {
          var wrapper = document.createElement('div');
          wrapper.className = 'state-info__row';
          var label = document.createElement('dt');
          label.textContent = entry.subtitle || entry.title || '';
          var value = document.createElement('dd');
          value.textContent = entry.content || '';
          wrapper.append(label, value);
          list.appendChild(wrapper);
        });
        if (list.childElementCount) section.appendChild(list);
        return section;
      });
    }

    var pending = '待补充';
    return [
      makeSection('01 / 基本信息', [
        ['国家', '联邦'], ['行政类型', '区公司'], ['联邦区域', regionFor(state.code)],
        ['区代码', 'D' + state.order], ['分级', '-'], ['区公司', companyDetails(state), 'company']
      ]),
      makeSection('02 / 简介', [
        ['行政机关', pending], ['立法机构', pending], ['司法机构', pending],
        ['地方行政单位', pending], ['联邦国会席位', pending], ['公共服务入口', pending]
      ]),
      makeSection('03 / 人口与社会', [
        ['人口规模', pending], ['人口密度', pending], ['主要城市', pending],
        ['语言与社群', pending], ['教育与研究', pending], ['社会概况', pending]
      ]),
      makeSection('04 / 土地与地理', [
        ['总面积', pending], ['地形与水系', pending], ['气候带', pending],
        ['相邻州区', pending], ['主要交通', pending], ['时区', pending]
      ]),
      makeSection('05 / 产业与资源', [
        ['主要产业', pending], ['特色资源', pending], ['经济规模', pending],
        ['就业结构', pending], ['港口与物流', pending], ['创新与科研', pending]
      ]),
      makeSection('06 / 历史与州别标识', [
        ['加入联邦日期', pending], ['历史沿革', pending], ['州昵称', pending],
        ['州箴言', pending], ['州旗与州徽', pending], ['代表性符号', pending]
      ]),
      makeSection('07 / 资料索引', [
        ['基础记录', '已载入州名、缩写、区公司编号与区划'],
        ['扩展资料', '此面板为资料模板，可逐州补录'],
        ['最近更新', pending], ['参考来源', pending]
      ])
    ];
  }

  function initMusic() {
    var audio = document.getElementById('site-music');
    var button = document.getElementById('site-audio-toggle');
    var nextButton = document.getElementById('site-audio-next');
    var status = document.getElementById('site-audio-status');
    var volumeControl = document.getElementById('site-audio-volume');
    var volumeValue = document.getElementById('site-audio-volume-value');
    if (!audio || !button || !nextButton || !status) return;

    var tracks;
    try {
      tracks = JSON.parse(audio.getAttribute('data-playlist') || '[]');
    } catch (error) {
      tracks = [];
    }
    if (!Array.isArray(tracks) || !tracks.length) {
      button.disabled = true;
      nextButton.disabled = true;
      if (volumeControl) volumeControl.disabled = true;
      setStatus('NO MP3 FILES · ADD SONGS TO SOURCE/MUSIC');
      return;
    }
    var currentIndex = -1;
    var userPaused = false;
    var fadeFrame = 0;
    var fadeOutStarted = false;
    var targetVolume = volumeControl ? Number(volumeControl.value) : 0.52;

    if (volumeValue) volumeValue.textContent = Math.round(targetVolume * 100) + '%';

    function setStatus(message) {
      status.textContent = message;
    }

    function fadeTo(target, duration, onComplete) {
      cancelAnimationFrame(fadeFrame);
      var startVolume = audio.volume;
      var startedAt = performance.now();
      function frame(now) {
        var progress = Math.min(1, (now - startedAt) / duration);
        audio.volume = startVolume + (target - startVolume) * progress;
        if (progress < 1) {
          fadeFrame = requestAnimationFrame(frame);
        } else if (onComplete) {
          onComplete();
        }
      }
      fadeFrame = requestAnimationFrame(frame);
    }

    function randomTrackIndex() {
      if (tracks.length < 2 || currentIndex < 0) return Math.floor(Math.random() * tracks.length);
      var next = currentIndex;
      while (next === currentIndex) next = Math.floor(Math.random() * tracks.length);
      return next;
    }

    function handleStarted() {
      fadeOutStarted = false;
      button.textContent = 'Ⅱ';
      button.setAttribute('aria-label', '暂停背景音乐');
      setStatus('NOW PLAYING · ' + tracks[currentIndex].title);
      fadeTo(targetVolume, 1800);
    }

    function tryPlay() {
      if (userPaused || !audio.paused) return;
      if (currentIndex < 0) {
        currentIndex = randomTrackIndex();
        audio.src = tracks[currentIndex].src;
        audio.load();
      }

      audio.volume = 0;
      var playResult;
      try {
        playResult = audio.play();
      } catch (error) {
        setStatus('AUTOPLAY BLOCKED · CLICK TO PLAY');
        return;
      }
      if (playResult && typeof playResult.then === 'function') {
        playResult.then(handleStarted).catch(function () {
          button.textContent = '▶';
          button.setAttribute('aria-label', '播放背景音乐');
          setStatus('AUTOPLAY BLOCKED · CLICK TO PLAY');
        });
      } else {
        handleStarted();
      }
    }

    function playNext() {
      var nextIndex = randomTrackIndex();
      function loadNextTrack() {
        audio.pause();
        currentIndex = nextIndex;
        audio.src = tracks[currentIndex].src;
        audio.load();
        audio.volume = 0;
        userPaused = false;
        tryPlay();
      }
      if (!audio.paused) fadeTo(0, 500, loadNextTrack);
      else loadNextTrack();
    }

    button.addEventListener('click', function () {
      if (audio.paused) {
        userPaused = false;
        tryPlay();
      } else {
        userPaused = true;
        button.textContent = '▶';
        button.setAttribute('aria-label', '播放背景音乐');
        setStatus('PAUSED');
        fadeTo(0, 350, function () { audio.pause(); });
      }
    });

    nextButton.addEventListener('click', playNext);
    if (volumeControl) {
      volumeControl.addEventListener('input', function () {
        targetVolume = Math.max(0, Math.min(1, Number(volumeControl.value)));
        if (volumeValue) volumeValue.textContent = Math.round(targetVolume * 100) + '%';
        cancelAnimationFrame(fadeFrame);
        fadeFrame = 0;
        audio.volume = targetVolume;
      });
    }

    audio.addEventListener('timeupdate', function () {
      var remaining = audio.duration - audio.currentTime;
      if (!userPaused && !fadeOutStarted && Number.isFinite(remaining) && remaining <= 2.4 && remaining > 0) {
        fadeOutStarted = true;
        fadeTo(0, Math.max(250, remaining * 1000));
      }
    });
    audio.addEventListener('ended', playNext);
    audio.addEventListener('error', function () {
      setStatus('TRACK UNAVAILABLE · CLICK TO RETRY');
      button.textContent = '▶';
    });

    document.addEventListener('pointerdown', function (event) {
      if (event.target.closest && event.target.closest('#site-audio-player')) return;
      tryPlay();
    });
    document.addEventListener('keydown', function (event) {
      if (event.target.closest && event.target.closest('#site-audio-player')) return;
      tryPlay();
    });
    window.__siteMusicStart = tryPlay;
    tryPlay();
  }

  function init() {
    if (init.initialized) return;
    var mapObject = document.getElementById('state-map');
    var home = document.querySelector('.site-home');
    var panel = document.getElementById('state-info');
    var closeButton = panel && panel.querySelector('.state-info__close');
    var infoImage = panel && panel.querySelector('.state-info__image');
    var articlePanel = document.getElementById('state-articles');
    var articleToggle = document.getElementById('state-articles-toggle');
    var articleClose = document.getElementById('state-articles-close');
    var districtList = document.getElementById('state-district-list');
    var articleList = document.getElementById('state-articles-list');
    var articleContent = document.getElementById('state-articles-content');
    var articleReader = document.getElementById('state-article-reader');
    var articleReaderClose = document.getElementById('state-article-reader-close');
    var articleReaderDistrict = document.getElementById('state-article-reader-district');
    if (!mapObject || !home || !panel || !closeButton) return;

    var stateProfiles = {};
    var profileData = document.getElementById('state-profile-data');
    try {
      stateProfiles = JSON.parse(profileData && profileData.textContent || '{}');
    } catch (error) {
      stateProfiles = {};
    }
    var districtArticles = {};
    try {
      var articleData = document.getElementById('district-article-data');
      districtArticles = JSON.parse(articleData && articleData.textContent || '{}');
    } catch (error) {
      districtArticles = {};
    }
    var recentArticles = [];
    try {
      var recentData = document.getElementById('recent-article-data');
      recentArticles = JSON.parse(recentData && recentData.textContent || '[]');
    } catch (error) {
      recentArticles = [];
    }

    var mapDoc = mapObject.contentDocument;
    var svg = mapDoc && mapDoc.documentElement;
    if (!svg || svg.localName !== 'svg') return;
    init.initialized = true;

    var selected = null;
    var iconUrl = mapObject.getAttribute('data-icon-url');
    var iconNs = 'http://www.w3.org/2000/svg';
    var initialView = svg.viewBox.baseVal;
    var sourceBounds = { x: initialView.x, y: initialView.y, width: initialView.width, height: initialView.height };
    var viewBounds;
    function fitBoundsToBrowser() {
      var viewportWidth = svg.clientWidth || window.innerWidth || sourceBounds.width;
      var viewportHeight = svg.clientHeight || window.innerHeight || sourceBounds.height;
      var viewportRatio = viewportWidth / viewportHeight;
      var sourceRatio = sourceBounds.width / sourceBounds.height;
      var width = sourceBounds.width;
      var height = sourceBounds.height;
      if (viewportRatio > sourceRatio) {
        width = height * viewportRatio;
      } else {
        height = width / viewportRatio;
      }
      return {
        x: sourceBounds.x + (sourceBounds.width - width) / 2,
        y: sourceBounds.y + (sourceBounds.height - height) / 2,
        width: width,
        height: height
      };
    }
    viewBounds = fitBoundsToBrowser();
    svg.setAttribute('viewBox', [viewBounds.x, viewBounds.y, viewBounds.width, viewBounds.height].join(' '));
    var zoomLevel = 1;
    var maxZoom = 8;
    var dragStart = null;
    var dragMoved = false;
    var suppressMapClick = false;
    var activePointers = new Map();
    var pinchStart = null;
    var zoomReadout = document.getElementById('map-zoom-value');
    var moon = document.getElementById('site-home-moon');

    function updateMoon() {
      if (!moon) return;
      var reveal = Math.max(0, Math.min(1, (1.2 - zoomLevel) / 0.2));
      moon.style.setProperty('--moon-opacity', (reveal * 0.4).toFixed(3));
      moon.style.setProperty('--moon-blur', (24 - reveal * 14).toFixed(1) + 'px');
      moon.style.setProperty('--moon-scale', (1.24 - reveal * 0.12).toFixed(3));
    }

    var interactionStyle = mapDoc.createElementNS(iconNs, 'style');
    interactionStyle.textContent = [
      '#USA [id^="US-"] { cursor: pointer; pointer-events: all; }',
      '#USA [id^="US-"]:focus { outline: none; }',
      '#USA [id^="US-"].is-selected, #USA [id^="US-"].is-selected * { animation: state-flash 1.15s ease-in-out infinite; }',
      '@keyframes state-flash { 0%,100% { fill: #fff; fill-opacity: .25; } 50% { fill: #fff; fill-opacity: .82; } }',
      '@media (prefers-reduced-motion: reduce) { #USA [id^="US-"].is-selected, #USA [id^="US-"].is-selected * { animation: none; fill: #fff !important; fill-opacity: .55; } }',
      '#state-markers { pointer-events: none; }',
      '.state-map-panning { cursor: grabbing !important; }',
      'svg { touch-action: none; user-select: none; }'
    ].join('\n');
    svg.insertBefore(interactionStyle, svg.firstChild);

    function currentView() {
      var box = svg.viewBox.baseVal;
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    }

    function clampBox(box) {
      box.width = Math.min(viewBounds.width, Math.max(viewBounds.width / maxZoom, box.width));
      box.height = viewBounds.height * box.width / viewBounds.width;
      box.x = Math.max(viewBounds.x, Math.min(viewBounds.x + viewBounds.width - box.width, box.x));
      box.y = Math.max(viewBounds.y, Math.min(viewBounds.y + viewBounds.height - box.height, box.y));
      return box;
    }

    function applyView(box) {
      box = clampBox(box);
      svg.setAttribute('viewBox', [box.x, box.y, box.width, box.height].join(' '));
      zoomLevel = viewBounds.width / box.width;
      if (zoomReadout) zoomReadout.textContent = zoomLevel.toFixed(1).replace(/\.0$/, '') + '×';
      updateMoon();
    }

    function pointAt(clientX, clientY) {
      var point = svg.createSVGPoint();
      point.x = clientX;
      point.y = clientY;
      return point.matrixTransform(svg.getScreenCTM().inverse());
    }

    function zoomAt(targetZoom, clientX, clientY) {
      targetZoom = Math.max(1, Math.min(maxZoom, targetZoom));
      var oldView = currentView();
      var anchor;
      if (typeof clientX === 'number' && typeof clientY === 'number') {
        anchor = pointAt(clientX, clientY);
      } else {
        anchor = { x: oldView.x + oldView.width / 2, y: oldView.y + oldView.height / 2 };
      }
      var ratioX = (anchor.x - oldView.x) / oldView.width;
      var ratioY = (anchor.y - oldView.y) / oldView.height;
      var nextWidth = viewBounds.width / targetZoom;
      var nextHeight = viewBounds.height / targetZoom;
      applyView({
        x: anchor.x - ratioX * nextWidth,
        y: anchor.y - ratioY * nextHeight,
        width: nextWidth,
        height: nextHeight
      });
    }

    function panByPixels(dx, dy, startView) {
      var widthPx = svg.clientWidth || 1;
      var heightPx = svg.clientHeight || 1;
      applyView({
        x: startView.x - dx * startView.width / widthPx,
        y: startView.y - dy * startView.height / heightPx,
        width: startView.width,
        height: startView.height
      });
    }

    svg.addEventListener('wheel', function (event) {
      event.preventDefault();
      zoomAt(zoomLevel * Math.exp(-event.deltaY * 0.0015), event.clientX, event.clientY);
    }, { passive: false });

    svg.addEventListener('pointerdown', function (event) {
      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (activePointers.size >= 2) {
        var points = Array.from(activePointers.values());
        var centerX = (points[0].x + points[1].x) / 2;
        var centerY = (points[0].y + points[1].y) / 2;
        pinchStart = {
          distance: Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y),
          zoom: zoomLevel,
          x: centerX,
          y: centerY
        };
        dragStart = null;
      } else if (event.button === 0) {
        dragStart = { id: event.pointerId, x: event.clientX, y: event.clientY, view: currentView() };
        dragMoved = false;
      }
    });

    mapDoc.addEventListener('pointermove', function (event) {
      if (activePointers.has(event.pointerId)) activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (activePointers.size >= 2 && pinchStart) {
        var points = Array.from(activePointers.values());
        var distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        var centerX = (points[0].x + points[1].x) / 2;
        var centerY = (points[0].y + points[1].y) / 2;
        zoomAt(pinchStart.zoom * distance / Math.max(1, pinchStart.distance), centerX, centerY);
        event.preventDefault();
      } else if (dragStart && dragStart.id === event.pointerId) {
        var dx = event.clientX - dragStart.x;
        var dy = event.clientY - dragStart.y;
        if (!dragMoved && Math.hypot(dx, dy) > 5) {
          dragMoved = true;
          svg.classList.add('state-map-panning');
          try { svg.setPointerCapture(event.pointerId); } catch (error) { /* capture is optional */ }
        }
        if (dragMoved) {
          panByPixels(dx, dy, dragStart.view);
          if (moon) {
            moon.style.setProperty('--moon-pan-x', Math.max(-32, Math.min(32, -dx * 0.08)).toFixed(1) + 'px');
            moon.style.setProperty('--moon-pan-y', Math.max(-32, Math.min(32, -dy * 0.08)).toFixed(1) + 'px');
          }
          event.preventDefault();
        }
      }
    }, { passive: false });

    function endPointer(event) {
      activePointers.delete(event.pointerId);
      if (dragStart && dragStart.id === event.pointerId) {
        if (dragMoved) {
          suppressMapClick = true;
          window.setTimeout(function () { suppressMapClick = false; }, 0);
        }
        dragStart = null;
      }
      if (activePointers.size < 2) pinchStart = null;
      if (!activePointers.size) svg.classList.remove('state-map-panning');
      if (!activePointers.size && moon) {
        moon.style.setProperty('--moon-pan-x', '0px');
        moon.style.setProperty('--moon-pan-y', '0px');
      }
    }

    mapDoc.addEventListener('pointerup', endPointer);
    mapDoc.addEventListener('pointercancel', endPointer);
    svg.addEventListener('click', function (event) {
      if (suppressMapClick) {
        event.preventDefault();
        event.stopImmediatePropagation();
        suppressMapClick = false;
      }
    }, true);

    document.querySelectorAll('.map-zoom [data-map-zoom]').forEach(function (button) {
      button.addEventListener('click', function () {
        var action = button.getAttribute('data-map-zoom');
        if (action === 'in') zoomAt(zoomLevel * 1.25);
        if (action === 'out') zoomAt(zoomLevel / 1.25);
        if (action === 'reset') applyView(viewBounds);
      });
    });

    window.addEventListener('resize', function () {
      var before = currentView();
      var centerX = before.x + before.width / 2;
      var centerY = before.y + before.height / 2;
      viewBounds = fitBoundsToBrowser();
      applyView({
        x: centerX - viewBounds.width / zoomLevel / 2,
        y: centerY - viewBounds.height / zoomLevel / 2,
        width: viewBounds.width / zoomLevel,
        height: viewBounds.height / zoomLevel
      });
    });

    function startMusicFromMap() {
      if (window.__siteMusicStart) window.__siteMusicStart();
    }
    mapDoc.addEventListener('pointerdown', startMusicFromMap);
    mapDoc.addEventListener('keydown', startMusicFromMap);

    var markers = mapDoc.createElementNS(iconNs, 'g');
    markers.setAttribute('id', 'state-markers');
    markers.setAttribute('aria-hidden', 'true');
    markers.setAttribute('pointer-events', 'none');
    svg.appendChild(markers);

    function setState(state) {
      if (!state) return;
      if (selected) selected.node.classList.remove('is-selected');

      state.node.classList.add('is-selected');
      selected = state;
      home.classList.add('has-info');
      panel.setAttribute('aria-hidden', 'false');
      document.getElementById('state-info-code').textContent = 'STATE / US-' + state.data.code;
      var profile = stateProfiles[state.data.code] || {};
      var title = profile.title || state.data.name;
      var districtName = 'District ' + state.data.order + ' Company';
      document.getElementById('state-info-title').textContent = title;
      document.getElementById('state-info-summary').textContent = profile.subtitle || (companyName(state.data) + '　·　' + regionFor(state.data.code) + ' Region');
      if (infoImage) {
        infoImage.src = profile.imageUrl || mapObject.getAttribute('data-icon-url');
        infoImage.alt = title + '资料图片';
      }

      var sections = document.getElementById('state-info-sections');
      sections.replaceChildren.apply(sections, buildSections(state.data, profile));
      if (articlePanel && articleList && articleContent) selectDistrict(state.data.order);
      closeButton.focus({ preventScroll: true });
    }

    function selectDistrict(number) {
      if (!articlePanel || !articleList || !articleContent) return;
      var district = Math.max(1, Math.min(50, Number(number) || 1));
      document.getElementById('state-articles-code').textContent = 'DISTRICT / D' + district;
      document.getElementById('state-articles-title').textContent = 'D' + district + ' · 第' + chineseNumber(district) + '区公司';
      if (districtList) {
        districtList.querySelectorAll('.is-current').forEach(function (node) {
          node.classList.remove('is-current');
          node.setAttribute('aria-pressed', 'false');
        });
        var districtButton = districtList.querySelector('[data-district="' + district + '"]');
        if (districtButton) {
          districtButton.classList.add('is-current');
          districtButton.setAttribute('aria-pressed', 'true');
        }
      }
      articleList.replaceChildren();
      articleContent.replaceChildren();
      var articles = districtArticles[String(district)] || [];
      if (!articles.length) {
        var empty = document.createElement('p');
        empty.className = 'state-articles__empty';
        empty.textContent = '该区暂时没有文章。';
        articleList.appendChild(empty);
      } else {
        var districtState = states.filter(function (state) { return state.order === district; })[0];
        var districtProfile = districtState ? stateProfiles[districtState.code] || {} : {};
        var thumbnail = districtProfile.imageUrl || (districtState && (stateProfiles[districtState.code] || {}).iconUrl) || mapObject.getAttribute('data-icon-url');
        articles.forEach(function (article, index) {
          var card = document.createElement('article');
          card.className = 'state-articles__card';
          var articleDocument = new DOMParser().parseFromString(article.html || '', 'text/html');
          var coverVideo = articleDocument.querySelector('video');
          var coverFrame = articleDocument.querySelector('iframe[src^="https://player.bilibili.com/player.html"]');
          var coverSource = coverVideo && (coverVideo.getAttribute('src') || (coverVideo.querySelector('source') && coverVideo.querySelector('source').getAttribute('src')));
          var image;
          if (coverFrame) {
            image = document.createElement('iframe');
            image.className = 'state-articles__card-image';
            image.src = coverFrame.getAttribute('src');
            image.title = (article.title || article.filename) + '封面播放器';
            image.loading = 'lazy';
            image.referrerPolicy = 'strict-origin-when-cross-origin';
            image.allow = 'autoplay; fullscreen; picture-in-picture';
            image.allowFullscreen = true;
          } else if (coverSource) {
            image = document.createElement('video');
            image.className = 'state-articles__card-image';
            image.src = coverSource;
            if (coverVideo.getAttribute('poster')) image.poster = coverVideo.getAttribute('poster');
            image.controls = true;
            image.playsInline = true;
            image.preload = 'metadata';
            image.setAttribute('aria-label', (article.title || article.filename) + '封面视频');
          } else {
            image = document.createElement('img');
            image.className = 'state-articles__card-image';
            image.src = thumbnail;
            image.alt = '';
            image.loading = 'lazy';
          }
          var title = document.createElement('h3');
          title.className = 'state-articles__card-title';
          title.textContent = article.title || article.filename;
          var item = document.createElement('button');
          item.type = 'button';
          item.className = 'state-articles__item';
          item.textContent = '进入文章';
          item.addEventListener('click', function () { showArticle(article, district); });
          card.append(image, title, item);
          articleList.appendChild(card);
        });
      }
    }

    if (districtList) {
      for (var districtNumber = 1; districtNumber <= 50; districtNumber++) {
        (function (number) {
          var button = document.createElement('button');
          button.type = 'button';
          button.className = 'state-articles__district';
          button.textContent = 'D' + number;
          button.setAttribute('data-district', String(number));
          button.setAttribute('aria-pressed', 'false');
          button.addEventListener('click', function () { selectDistrict(number); });
          districtList.appendChild(button);
        })(districtNumber);
      }
    }

    var recentList = document.getElementById('home-recent-list');
    if (recentList) {
      recentArticles.forEach(function (recent) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'site-home__recent-item';
        var name = document.createElement('span');
        name.className = 'site-home__recent-name';
        name.textContent = recent.title;
        var meta = document.createElement('span');
        meta.className = 'site-home__recent-meta';
        meta.textContent = 'D' + recent.district + ' · ' + new Date(recent.updated).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
        button.append(name, meta);
        button.addEventListener('click', function () {
          selectDistrict(recent.district);
          openDistrictArticles(recent.district);
          var article = (districtArticles[String(recent.district)] || []).filter(function (item) {
            return item.filename === recent.filename;
          })[0];
          if (article) showArticle(article, recent.district);
        });
        recentList.appendChild(button);
      });
    }

    var repositoryList = document.getElementById('home-repository-list');
    if (repositoryList) {
      for (var repositoryDistrict = 1; repositoryDistrict <= 50; repositoryDistrict++) {
        (function (number) {
          var button = document.createElement('button');
          button.type = 'button';
          button.className = 'site-home__repository-item';
          var count = (districtArticles[String(number)] || []).length;
          button.append('D' + number + ' ');
          var details = document.createElement('span');
          details.textContent = count + ' 篇';
          button.appendChild(details);
          button.addEventListener('click', function () {
            selectDistrict(number);
            openDistrictArticles(number);
          });
          repositoryList.appendChild(button);
        })(repositoryDistrict);
      }
    }

    function openDistrictArticles(number) {
      selectDistrict(number);
      home.classList.add('has-articles');
      if (articlePanel) articlePanel.setAttribute('aria-hidden', 'false');
      if (articleToggle) {
        articleToggle.setAttribute('aria-expanded', 'true');
        articleToggle.setAttribute('aria-label', '关闭该区文章');
      }
    }

    function showArticle(article, district) {
      if (!articleContent) return;
      var source = new DOMParser().parseFromString(article.html || '', 'text/html');
      source.querySelectorAll('script, object, embed, form, base, style, link, meta').forEach(function (node) { node.remove(); });
      source.querySelectorAll('iframe').forEach(function (frame) {
        try {
          var frameUrl = new URL(frame.getAttribute('src') || '', window.location.href);
          if (frameUrl.origin !== 'https://player.bilibili.com' || frameUrl.pathname !== '/player.html' || frameUrl.searchParams.get('bvid') !== 'BV1wR4t6WEvM') {
            frame.remove();
            return;
          }
          frame.setAttribute('loading', 'lazy');
          frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
          frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
          frame.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share');
          frame.setAttribute('allowfullscreen', '');
          frame.setAttribute('title', '纳西瑟斯号剪影 · Bilibili 视频播放器');
        } catch (error) {
          frame.remove();
        }
      });
      source.querySelectorAll('*').forEach(function (node) {
        Array.from(node.attributes).forEach(function (attribute) {
          var name = attribute.name.toLowerCase();
          var value = attribute.value.trim().toLowerCase();
          if (name.slice(0, 2) === 'on' || name === 'style' || name === 'srcdoc' ||
              ((name === 'href' || name === 'src' || name === 'xlink:href') && value.indexOf('javascript:') === 0)) {
            node.removeAttribute(attribute.name);
          }
        });
      });
      var wrapper = document.createElement('div');
      wrapper.className = 'state-articles__html';
      var heading = document.createElement('h1');
      heading.textContent = article.title || article.filename;
      var originalHeading = source.body.querySelector('h1');
      if (originalHeading) originalHeading.remove();
      wrapper.innerHTML = source.body.innerHTML;
      wrapper.prepend(heading);
      articleContent.replaceChildren(wrapper);
      if (articleReaderDistrict) articleReaderDistrict.textContent = 'DISTRICT / D' + district;
      if (articleReader) articleReader.setAttribute('aria-hidden', 'false');
      home.classList.add('has-article-reader');
      articleReader.scrollTop = 0;
    }

    function closeArticleReader() {
      home.classList.remove('has-article-reader');
      if (articleReader) articleReader.setAttribute('aria-hidden', 'true');
    }

    function closeArticles() {
      closeArticleReader();
      home.classList.remove('has-articles');
      if (articlePanel) articlePanel.setAttribute('aria-hidden', 'true');
      if (articleToggle) {
        articleToggle.setAttribute('aria-expanded', 'false');
        articleToggle.setAttribute('aria-label', '打开该区文章');
      }
    }

    function closePanel() {
      if (selected) {
        selected.node.classList.remove('is-selected');
      }
      selected = null;
      home.classList.remove('has-info');
      panel.setAttribute('aria-hidden', 'true');
      closeArticles();
    }

    var stateEntries = Object.create(null);
    states.forEach(function (data) {
      var node = svg.querySelector('#US-' + data.code);
      if (!node) return;
      node.setAttribute('role', 'button');
      node.setAttribute('tabindex', '0');
      node.setAttribute('aria-label', data.name + ' (US-' + data.code + ')');

      var box;
      try {
        box = node.getBBox();
      } catch (error) {
        return;
      }
      if (!box || !node.getCTM() || !box.width || !box.height) return;

      var rootToScreen = svg.getScreenCTM();
      var localToRoot = rootToScreen.inverse().multiply(node.getScreenCTM());
      var center = new DOMPoint(box.x + box.width / 2, box.y + box.height / 2).matrixTransform(localToRoot);
      var scale = Math.hypot(rootToScreen.a, rootToScreen.b) || 0.35;
      var size = Math.max(22, Math.min(48, 16 / scale));
      if ('CT DE MA MD NH NJ RI VT'.split(' ').indexOf(data.code) !== -1) size *= 0.74;

      var marker = mapDoc.createElementNS(iconNs, 'g');
      marker.setAttribute('class', 'state-marker');
      marker.setAttribute('data-state', data.code);

      var image = mapDoc.createElementNS(iconNs, 'image');
      image.setAttribute('x', center.x - size / 2);
      image.setAttribute('y', center.y - size / 2);
      image.setAttribute('width', size);
      image.setAttribute('height', size);
      image.setAttribute('href', (stateProfiles[data.code] || {}).iconUrl || iconUrl);
      image.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      image.setAttribute('pointer-events', 'none');
      marker.appendChild(image);
      markers.appendChild(marker);

      var entry = { data: data, node: node };
      stateEntries[data.code] = entry;
      node.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setState(entry);
        }
      });
    });

    // Delegate selection from the SVG so nested paths and state groups are
    // handled consistently, including when the map is zoomed or panned.
    svg.addEventListener('click', function (event) {
      var target = event.target;
      while (target && target !== svg) {
        var match = /^US-([A-Z]{2})$/.exec(target.id || '');
        if (match && stateEntries[match[1]]) {
          setState(stateEntries[match[1]]);
          return;
        }
        target = target.parentNode;
      }
    });

    closeButton.addEventListener('click', closePanel);
    if (articleToggle && articlePanel) {
      articleToggle.addEventListener('click', function () {
        var open = !home.classList.contains('has-articles');
        home.classList.toggle('has-articles', open);
        articlePanel.setAttribute('aria-hidden', open ? 'false' : 'true');
        articleToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        articleToggle.setAttribute('aria-label', open ? '关闭该区文章' : '打开该区文章');
      });
    }
    if (articleClose) articleClose.addEventListener('click', closeArticles);
    if (articleReaderClose) articleReaderClose.addEventListener('click', closeArticleReader);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && home.classList.contains('has-article-reader')) closeArticleReader();
      else if (event.key === 'Escape' && home.classList.contains('has-articles')) closeArticles();
      else if (event.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') closePanel();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMusic();
    var mapObject = document.getElementById('state-map');
    if (!mapObject) return;
    mapObject.addEventListener('load', init, { once: true });
    if (mapObject.contentDocument && mapObject.contentDocument.documentElement) init();
  });
})();

(function () {
  'use strict';

  var states = [
    ['AL', 'Alabama', 'Montgomery'], ['AK', 'Alaska', 'Juneau'],
    ['AZ', 'Arizona', 'Phoenix'], ['AR', 'Arkansas', 'Little Rock'],
    ['CA', 'California', 'Sacramento'], ['CO', 'Colorado', 'Denver'],
    ['CT', 'Connecticut', 'Hartford'], ['DE', 'Delaware', 'Dover'],
    ['FL', 'Florida', 'Tallahassee'], ['GA', 'Georgia', 'Atlanta'],
    ['HI', 'Hawaii', 'Honolulu'], ['ID', 'Idaho', 'Boise'],
    ['IL', 'Illinois', 'Springfield'], ['IN', 'Indiana', 'Indianapolis'],
    ['IA', 'Iowa', 'Des Moines'], ['KS', 'Kansas', 'Topeka'],
    ['KY', 'Kentucky', 'Frankfort'], ['LA', 'Louisiana', 'Baton Rouge'],
    ['ME', 'Maine', 'Augusta'], ['MD', 'Maryland', 'Annapolis'],
    ['MA', 'Massachusetts', 'Boston'], ['MI', 'Michigan', 'Lansing'],
    ['MN', 'Minnesota', 'Saint Paul'], ['MS', 'Mississippi', 'Jackson'],
    ['MO', 'Missouri', 'Jefferson City'], ['MT', 'Montana', 'Helena'],
    ['NE', 'Nebraska', 'Lincoln'], ['NV', 'Nevada', 'Carson City'],
    ['NH', 'New Hampshire', 'Concord'], ['NJ', 'New Jersey', 'Trenton'],
    ['NM', 'New Mexico', 'Santa Fe'], ['NY', 'New York', 'Albany'],
    ['NC', 'North Carolina', 'Raleigh'], ['ND', 'North Dakota', 'Bismarck'],
    ['OH', 'Ohio', 'Columbus'], ['OK', 'Oklahoma', 'Oklahoma City'],
    ['OR', 'Oregon', 'Salem'], ['PA', 'Pennsylvania', 'Harrisburg'],
    ['RI', 'Rhode Island', 'Providence'], ['SC', 'South Carolina', 'Columbia'],
    ['SD', 'South Dakota', 'Pierre'], ['TN', 'Tennessee', 'Nashville'],
    ['TX', 'Texas', 'Austin'], ['UT', 'Utah', 'Salt Lake City'],
    ['VT', 'Vermont', 'Montpelier'], ['VA', 'Virginia', 'Richmond'],
    ['WA', 'Washington', 'Olympia'], ['WV', 'West Virginia', 'Charleston'],
    ['WI', 'Wisconsin', 'Madison'], ['WY', 'Wyoming', 'Cheyenne']
  ].map(function (item) {
    return { code: item[0], name: item[1], capital: item[2] };
  });

  var divisions = {
    'New England': 'CT ME MA NH RI VT',
    'Middle Atlantic': 'NJ NY PA',
    'East North Central': 'IL IN MI OH WI',
    'West North Central': 'IA KS MN MO NE ND SD',
    'South Atlantic': 'DE FL GA MD NC SC VA WV',
    'East South Central': 'AL KY MS TN',
    'West South Central': 'AR LA OK TX',
    'Mountain': 'AZ CO ID MT NV NM UT WY',
    'Pacific': 'AK CA HI OR WA'
  };

  function regionFor(code) {
    if ('CT ME MA NH RI VT NJ NY PA'.split(' ').indexOf(code) !== -1) return 'Northeast';
    if ('IL IN MI OH WI IA KS MN MO NE ND SD'.split(' ').indexOf(code) !== -1) return 'Midwest';
    if ('DE FL GA MD NC SC VA WV AL KY MS TN AR LA OK TX'.split(' ').indexOf(code) !== -1) return 'South';
    return 'West';
  }

  function divisionFor(code) {
    return Object.keys(divisions).find(function (division) {
      return divisions[division].split(' ').indexOf(code) !== -1;
    }) || '—';
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
      value.textContent = row[1];
      wrapper.append(label, value);
      list.appendChild(wrapper);
    });

    section.appendChild(list);
    return section;
  }

  function buildSections(state) {
    var pending = '待补充';
    return [
      makeSection('01 / 联邦与区划', [
        ['国家', 'United States'], ['行政层级', '联邦州'], ['联邦区域', regionFor(state.code)],
        ['人口普查分区', divisionFor(state.code)], ['州代码', 'US-' + state.code],
        ['邮政缩写', state.code], ['州府', state.capital]
      ]),
      makeSection('02 / 政府与公共机构', [
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
        ['基础记录', '已载入州名、缩写、州府与区划'],
        ['扩展资料', '此面板为资料模板，可逐州补录'],
        ['最近更新', pending], ['参考来源', pending]
      ])
    ];
  }

  function init() {
    if (init.initialized) return;
    var mapObject = document.getElementById('state-map');
    var home = document.querySelector('.site-home');
    var panel = document.getElementById('state-info');
    var closeButton = panel && panel.querySelector('.state-info__close');
    if (!mapObject || !home || !panel || !closeButton) return;

    var mapDoc = mapObject.contentDocument;
    var svg = mapDoc && mapDoc.documentElement;
    if (!svg || svg.localName !== 'svg') return;
    init.initialized = true;

    var selected = null;
    var iconUrl = mapObject.getAttribute('data-icon-url');
    var iconNs = 'http://www.w3.org/2000/svg';

    var interactionStyle = mapDoc.createElementNS(iconNs, 'style');
    interactionStyle.textContent = [
      '#USA [id^="US-"] { cursor: pointer; }',
      '#USA [id^="US-"]:focus { outline: none; }',
      '#USA [id^="US-"].is-selected path { animation: state-flash 1.15s ease-in-out infinite; }',
      '@keyframes state-flash { 0%,100% { fill: #fff; fill-opacity: .25; } 50% { fill: #fff; fill-opacity: .82; } }',
      '@media (prefers-reduced-motion: reduce) { #USA [id^="US-"].is-selected path { animation: none; fill: #fff !important; fill-opacity: .55; } }',
      '.state-marker { cursor: pointer; }',
      '.state-marker:focus image { filter: drop-shadow(0 0 5px #fff); }'
    ].join('\n');
    svg.insertBefore(interactionStyle, svg.firstChild);

    var markers = mapDoc.createElementNS(iconNs, 'g');
    markers.setAttribute('id', 'state-markers');
    markers.setAttribute('aria-label', '美国州图标');
    svg.appendChild(markers);

    function setState(state) {
      if (!state) return;
      if (selected) {
        selected.node.classList.remove('is-selected');
        selected.marker.setAttribute('aria-pressed', 'false');
      }

      state.node.classList.add('is-selected');
      state.marker.setAttribute('aria-pressed', 'true');
      selected = state;
      home.classList.add('has-info');
      panel.setAttribute('aria-hidden', 'false');
      document.getElementById('state-info-code').textContent = 'STATE / US-' + state.data.code;
      document.getElementById('state-info-title').textContent = state.data.name;
      document.getElementById('state-info-summary').textContent = '州府 ' + state.data.capital + '　·　' + regionFor(state.data.code) + ' Region';

      var sections = document.getElementById('state-info-sections');
      sections.replaceChildren.apply(sections, buildSections(state.data));
      closeButton.focus({ preventScroll: true });
    }

    function closePanel() {
      if (selected) {
        selected.node.classList.remove('is-selected');
        selected.marker.setAttribute('aria-pressed', 'false');
      }
      selected = null;
      home.classList.remove('has-info');
      panel.setAttribute('aria-hidden', 'true');
    }

    states.forEach(function (data) {
      var node = svg.querySelector('#US-' + data.code);
      if (!node) return;
      node.setAttribute('role', 'button');
      node.setAttribute('tabindex', '0');
      node.setAttribute('aria-label', data.name + ' (US-' + data.code + ')');

      var box;
      var transform;
      try {
        box = node.getBBox();
        transform = node.getCTM();
      } catch (error) {
        return;
      }
      if (!box || !transform || !box.width || !box.height) return;

      var rootToScreen = svg.getScreenCTM();
      var localToRoot = rootToScreen.inverse().multiply(node.getScreenCTM());
      var center = new DOMPoint(box.x + box.width / 2, box.y + box.height / 2).matrixTransform(localToRoot);
      var scale = Math.hypot(rootToScreen.a, rootToScreen.b) || 0.35;
      var size = Math.max(22, Math.min(48, 16 / scale));
      if ('CT DE MA MD NH NJ RI VT'.split(' ').indexOf(data.code) !== -1) size *= 0.74;

      var marker = mapDoc.createElementNS(iconNs, 'g');
      marker.setAttribute('class', 'state-marker');
      marker.setAttribute('data-state', data.code);
      marker.setAttribute('role', 'button');
      marker.setAttribute('tabindex', '0');
      marker.setAttribute('aria-label', '查看 ' + data.name + ' 资料');
      marker.setAttribute('aria-pressed', 'false');

      var hitArea = mapDoc.createElementNS(iconNs, 'circle');
      hitArea.setAttribute('cx', center.x);
      hitArea.setAttribute('cy', center.y);
      hitArea.setAttribute('r', size * 0.72);
      hitArea.setAttribute('fill', 'transparent');
      var image = mapDoc.createElementNS(iconNs, 'image');
      image.setAttribute('x', center.x - size / 2);
      image.setAttribute('y', center.y - size / 2);
      image.setAttribute('width', size);
      image.setAttribute('height', size);
      image.setAttribute('href', iconUrl);
      image.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      image.setAttribute('pointer-events', 'none');
      marker.append(hitArea, image);
      markers.appendChild(marker);

      var entry = { data: data, node: node, marker: marker };
      marker.addEventListener('click', function (event) {
        event.stopPropagation();
        setState(entry);
      });
      marker.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setState(entry);
        }
      });
      node.addEventListener('click', function () { setState(entry); });
      node.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setState(entry);
        }
      });
    });

    closeButton.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') closePanel();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var mapObject = document.getElementById('state-map');
    if (!mapObject) return;
    mapObject.addEventListener('load', init, { once: true });
    if (mapObject.contentDocument && mapObject.contentDocument.documentElement) init();
  });
})();

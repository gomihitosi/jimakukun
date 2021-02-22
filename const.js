const LOCAL_STORAGE_KEY = 'jimakukun-settings';
const TYPE = {
  TEXT: 1,
  NUMBER: 2,
  RANGE: 3,
  CHECKBOX: 4,
  RADIO: 5,
  SELECT: 6,
  COLOR: 7,
};
const FLEX_ALIGN = [
  { text: '左', value: 'flex-start' }, { text: '中', value: 'center' }, { text: '右', value: 'flex-end' }
];
const FLEX_JUSTIFY = [
  { text: '上', value: 'flex-start' }, { text: '中', value: 'center' }, { text: '下', value: 'flex-end' }
];
const FLEX_ALIGN_JUSTIFY = [
  { text: '左/上', value: 'flex-start' }, { text: '中', value: 'center' }, { text: '右/下', value: 'flex-end' }
];
const FLEX_DIRECTION = [
  { text: '上', value: 'column' }, { text: '左', value: 'row' }
];
const EASING_TYPE = [
  { text: 'LINEAR', value: 'linear' }, { text: 'EASE', value: 'ease' },
  { text: 'EASE-IN', value: 'ease-in' }, { text: 'EASE-OUT', value: 'ease-out' },
  { text: 'EASE-IN-OUT', value: 'ease-in-out' },
];
const SETTINGS = {
  // 特殊 TODO:HTMLに直書き…
  isBorder: { value: false, type: TYPE.CHECKBOX, label: '', description: '' },
  isInterim: { value: true, type: TYPE.CHECKBOX, label: '', description: '' },
  isStopKey: { value: 'Space', type: TYPE.TEXT, label: '', description: '' },
  isVolumeCheck: { value: true, type: TYPE.CHECKBOX, label: '', description: '' },
  volumeCoefficient: { value: 1, type: TYPE.RANGE, min: 0.1, max: 3, step: 0.1, label: '', description: '' },
  stopVolumeThreshold: { value: 15, type: TYPE.RANGE, min: 1, max: 320, step: 1, label: '', description: '' },
  stopTime: { value: 250, type: TYPE.RANGE, min: 1, max: 2500, step: 1, label: '', description: '' },
  // 表示
  backgroundColor: { value: 'rgba(0, 255, 0, 1)', type: TYPE.COLOR, label: '背景色', description: '字幕表示領域の背景色を設定。クロマキ－用の色を設定してください' },
  svgGroupWidth: { value: 90, type: TYPE.RANGE, min: 10, max: 100, step: 1, label: '字幕表示幅(%)', description: '字幕表示領域の中で字幕の横幅を何％まで表示させるかを設定。％' },
  svgGroupMargin: { value: 8, type: TYPE.RANGE, min: 0, max: 30, step: 1, label: '字幕下余白(px)', description: '字幕の下に余白を設定。ピクセル' },
  svgGroupAlign: { value: 'center', type: TYPE.RADIO, data: FLEX_ALIGN, label: '揃え', description: '字幕の表示位置を設定。揃え' },
  svgGroupJustify: { value: 'flex-end', type: TYPE.RADIO, data: FLEX_JUSTIFY, label: '寄せ', description: '字幕の表示位置を設定。寄せ' },
  // 前置きテキスト
  isBeforeText: { value: true, type: TYPE.CHECKBOX, label: '表示', description: '字幕の前に固定テキストを表示' },
  beforeColumnDirection: { value: 'column', type: TYPE.RADIO, data: FLEX_DIRECTION, label: '表示位置', description: '固定テキストの表示方法を設定。上、左', ifShowValue: 'isBeforeText' },
  beforeText: { value: '(名前)', type: TYPE.TEXT, label: '表示文字', description: '固定テキストの文言を設定', ifShowValue: 'isBeforeText' },
  beforeTextFontFamily: { value: 'Noto Sans JP', type: TYPE.TEXT, label: 'フォント', description: '固定テキストのフォントを設定', ifShowValue: 'isBeforeText' },
  beforeTextPosition: { value: 'flex-start', type: TYPE.RADIO, data: FLEX_ALIGN_JUSTIFY, label: '表示寄せ位置', description: '固定テキストの表示の寄せ位置を設定', ifShowValue: 'isBeforeText' },
  // 字幕
  isOverlay: { value: true, type: TYPE.CHECKBOX, label: '文字オーバーレイ表示', description: '字幕のテキストをはみ出させて表示' },
  fontFamily: { value: 'Noto Sans JP', type: TYPE.TEXT, label: 'フォント', description: '字幕のフォントを設定' },
  fontSize: { value: 25, type: TYPE.RANGE, min: 1, max: 100, step: 1, label: '文字サイズ', description: '字幕の大きさを設定' },
  fontWeight: { value: 400, type: TYPE.RANGE, min: 100, max: 900, step: 100, label: '文字太さ', description: '字幕の太さを設定' },
  strokeWidth: { value: 5, type: TYPE.RANGE, min: 0, max: 20, step: 1, label: '縁取り太さ', description: '字幕の縁取りの太さを設定' },
  fill: { value: 'rgba(255, 255, 0, 1)', type: TYPE.COLOR, label: '文字色', description: '字幕の色を設定' },
  stroke: { value: 'rgba(0, 0, 0, 1)', type: TYPE.COLOR, label: '縁取り色', description: '字幕の縁取りの色を設定' },
  x: { value: 50, type: TYPE.RANGE, min: 0, max: 100, step: 1, label: '文字横位置', description: '字幕のテキスト横位置を設定。調整用。％' },
  y: { value: 55, type: TYPE.RANGE, min: 0, max: 100, step: 1, label: '文字縦位置', description: '字幕のテキスト縦位置を設定。調整用。％' },
  svgLeft: { value: 0, type: TYPE.RANGE, min: -50, max: 50, step: 1, label: '文字横マージン', description: '字幕のテキスト縦位置に余白を設定。調整用。％' },
  svgTop: { value: 0, type: TYPE.RANGE, min: -50, max: 50, step: 1, label: '文字縦マージン', description: '字幕のテキスト横位置に余白を設定。調整用。％' },
  svgBlockAlign: { value: 'flex-start', type: TYPE.RADIO, data: FLEX_ALIGN, label: '字幕揃え', description: '字幕の揃えを設定' },
  svgWidthMargin: { value: 0, type: TYPE.RANGE, min: -25, max: 25, step: 1, label: '字詰め', description: '字幕の詰め幅を設定' },
  svgHeightMargin: { value: 0, type: TYPE.RANGE, min: -25, max: 25, step: 1, label: '行間', description: '字幕の行間を設定' },
  // 字幕他
  isSvgBg: { value: true, type: TYPE.CHECKBOX, label: '背景表示', description: '字幕に背景を表示するか設定' },
  svgBgColor: { value: 'rgba(0,0,0,1)', type: TYPE.COLOR, label: '背景色', description: '字幕の背景色を設定', ifShowValue: 'isSvgBg' },
  svgWidthOffset: { value: 0, type: TYPE.RANGE, min: 0, max: 25, step: 1, label: '背景横幅', description: '字幕の背景の横幅を設定', ifShowValue: 'isSvgBg' },
  svgHeightOffset: { value: 0, type: TYPE.RANGE, min: 0, max: 25, step: 1, label: '背景高さ', description: '字幕の背景の縦幅を設定', ifShowValue: 'isSvgBg' },
  deleteTime: { value: 0, type: TYPE.RANGE, min: 0, max: 15, step: 0.1, label: '字幕消去時間', description: '字幕が表示された後、消去されるまでの時間を設定。秒' },
  // 字幕アニメ
  fadeInTime: { value: 0.5, type: TYPE.RANGE, min: 0, max: 5, step: 0.1, label: 'フェードイン時間', description: '字幕表示時のフェードイン時間を設定', change: 'updateCss' },
  fadeOutTime: { value: 0.5, type: TYPE.RANGE, min: 0, max: 5, step: 0.1, label: 'フェードアウト時間', description: '字幕消去時のフェードアウト時間を設定', change: 'updateCss' },
  moveTime: { value: 0.5, type: TYPE.RANGE, min: 0, max: 5, step: 0.1, label: '字幕移動時間', description: '字幕が移動時の時間を設定', change: 'updateCss' },
  inTime: { value: 0.5, type: TYPE.RANGE, min: 0, max: 5, step: 0.1, label: '表示移動時間', description: '字幕表示時の移動時間を設定', change: 'updateCss' },
  outTime: { value: 0.5, type: TYPE.RANGE, min: 0, max: 5, step: 0.1, label: '消去移動時間', description: '字幕消去時の移動時間を設定', change: 'updateCss' },
  inPositionX: { value: 0, type: TYPE.RANGE, min: -100, max: 100, step: 1, label: '表示横位置', description: '字幕表示時の横位置を設定', change: 'updateCss' },
  inPositionY: { value: 0, type: TYPE.RANGE, min: -100, max: 100, step: 1, label: '表示縦位置', description: '字幕表示時の縦位置を設定', change: 'updateCss' },
  outPositionX: { value: 0, type: TYPE.RANGE, min: -100, max: 100, step: 1, label: '消去横位置', description: '字幕消去時の横位置を設定', change: 'updateCss' },
  outPositionY: { value: 0, type: TYPE.RANGE, min: -100, max: 100, step: 1, label: '消去縦位置', description: '字幕消去時の縦位置を設定', change: 'updateCss' },
  fadeEasingType: { value: 'ease', type: TYPE.SELECT, data: EASING_TYPE, label: 'フェードタイプ', description: 'アニメーション全般のフェードタイプを設定', change: 'updateCss' },
  moveEasingType: { value: 'ease', type: TYPE.SELECT, data: EASING_TYPE, label: '移動タイプ', description: 'アニメーション全般の移動タイプを設定', change: 'updateCss' },
  // フィルター
  filterMessage: {
    value: 'フィルター対象を,認識すると,空白に置換,カンマ区切りで,複数登録可', type: TYPE.TEXT, label: 'フィルター', description: 'フィルタリングしたい文字をカンマ区切りで設定。対象の文字を認識した場合は空白で置換される'
  },
};
function getDefaultSettings() {
  return Object.keys(SETTINGS).reduce((n, p) => {
    n[p] = SETTINGS[p].value;
    return n;
  }, {});
}

function diffUpdateSettings(result) {
  return Object.keys(SETTINGS).forEach(e => {
    if (!(e in result)) result[e] = SETTINGS[e].value;
  });
}
function getSettingsData() {
  let result = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

  if (!result) {
    result = getDefaultSettings();
  } else {
    // 差分のみ入れる
    diffUpdateSettings(result);
  }

  result.save = function () {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this));
  };
  result.remove = function () {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };
  result.getSvgBoxWidth = function (isPureSize) {
    return this.fontSize + this.strokeWidth + this.svgWidthMargin - (this.isBorder && !isPureSize ? 2 : 0);
  }
  result.getSvgBoxHeight = function (isPureSize) {
    return this.fontSize + this.strokeWidth + this.svgHeightMargin - (this.isBorder && !isPureSize ? 2 : 0);
  }
  return result;
}
const VIEW_SETTINGS = {
  showMenu: { title: '表示', keys: [['backgroundColor'], ['svgGroupWidth'], ['svgGroupMargin'], ['svgGroupAlign'], ['svgGroupJustify']] },
  beforeTextMenu: { title: '固定テキスト', keys: [['isBeforeText'],　['beforeColumnDirection'], ['beforeText'], ['beforeTextFontFamily'], ['beforeTextPosition']] },
  textMenu: { title: '字幕', keys: [['isOverlay'], ['fontFamily'], ['fontSize'], ['fontWeight'], ['strokeWidth'], ['fill'], ['stroke'], ['x'], ['y'], ['svgLeft'], ['svgTop'], ['svgBlockAlign'], ['svgWidthMargin'], ['svgHeightMargin']] },
  textEtcMenu: { title: '字幕他', keys: [['isSvgBg'], ['svgBgColor'], ['svgWidthOffset'], ['svgHeightOffset'], ['deleteTime']] },
  textAnimeMenu: {
    title: '字幕アニメ', keys: [['fadeInTime'], ['fadeOutTime'], ['moveTime'], ['inTime'], ['outTime'], ['inPositionX'], ['inPositionY'], ['outPositionX'], ['outPositionY'], ['fadeEasingType'], ['moveEasingType']]
  },
  filterMenu: { title: 'フィルター', keys: [['filterMessage']], }
};
function getShowMenuSetting() {
  return Object.keys(VIEW_SETTINGS).reduce((n, p) => {
    n[p] = true;
    return n;
  }, {});
}
// GoogleChrome以外の場合は注意を表示
if (window.navigator.userAgent.toLowerCase().indexOf('chrome') === -1) {
  const overlay = document.createElement('div');
  overlay.id = 'warning-overlay';
  overlay.innerHTML = '<p>PC版GoogleChrome以外では正しく動作しません。<br>PC版GoogleChromeでのアクセスをお願いします。</p>';
  overlay.addEventListener('click', function (e) { this.remove(); });
  document.body.appendChild(overlay);
}

const sumByteFrequencyData = function (dataArray) {
  let total = 0, i = 0;
  const length = dataArray.length;
  while (i < length) total += dataArray[i++];
  return length ? total : 0;
}
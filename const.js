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
const EASING_TYPE = [
  { text: 'LINEAR', value: 'linear' }, { text: 'EASE', value: 'ease' },
  { text: 'EASE-IN', value: 'ease-in' }, { text: 'EASE-OUT', value: 'ease-out' },
  { text: 'EASE-IN-OUT', value: 'ease-in-out' },
];
const SETTINGS = {
  isBorder: { value: false, type: TYPE.CHECKBOX, label: '罫線表示', description: 'ボーダー表示' },
  isInterim: { value: true, type: TYPE.CHECKBOX, label: '認識暫定表示', description: '認識暫定表示' },
  isStopKey: { value: 'Space', type: TYPE.TEXT, label: '認識終了キー', description: '認識終了キー' },
  backgroundColor: { value: 'rgba(0, 255, 0, 1)', type: TYPE.COLOR, label: '背景色', description: '背景色' },
  svgGroupWidth: { value: 90, type: TYPE.RANGE, min: 10, max: 100, step: 1, label: '行幅', description: 'テキスト表示幅(%)' },
  svgGroupMargin: { value: 8, type: TYPE.RANGE, min: 0, max: 30, step: 1, label: '余白', description: 'テキスト下マージン' },
  svgGroupAlign: { value: 'center', type: TYPE.RADIO, data: FLEX_ALIGN, label: '揃え', description: '揃え' },
  svgGroupJustify: { value: 'flex-end', type: TYPE.RADIO, data: FLEX_JUSTIFY, label: '寄せ', description: '寄せ' },
  svgBlockAlign: { value: 'flex-start', type: TYPE.RADIO, data: FLEX_ALIGN, label: '字幕揃え', description: '字幕揃え' },
  isBeforeText: { value: true, type: TYPE.CHECKBOX, label: '表示', description: '前置きテキスト表示' },
  isBeforeColumn: { value: true, type: TYPE.CHECKBOX, label: '縦置き/横置き', description: '前置きテキスト表示方向' },
  beforeText: { value: '(名前)', type: TYPE.TEXT, label: '表示文字', description: '前置きテキスト' },
  beforeTextFontFamily: { value: 'Noto Sans JP', type: TYPE.TEXT, label: 'フォント', description: '前置きテキストフォント' },
  fontFamily: { value: 'Noto Sans JP', type: TYPE.TEXT, label: 'フォント', description: 'テキストフォント' },
  fontSize: { value: 25, type: TYPE.RANGE, min: 1, max: 100, step: 1, label: '文字サイズ', description: 'テキストサイズ' },
  fontWeight: { value: 400, type: TYPE.RANGE, min: 100, max: 900, step: 100, label: '文字太さ', description: 'テキスト太さ' },
  strokeWidth: { value: 5, type: TYPE.RANGE, min: 0, max: 20, step: 1, label: '縁取り太さ', description: '縁取りサイズ' },
  fill: { value: 'rgba(255, 255, 0, 1)', type: TYPE.COLOR, label: '文字色', description: 'テキストカラー' },
  stroke: { value: 'rgba(0, 0, 0, 1)', type: TYPE.COLOR, label: '縁取り色', description: '縁取りカラー' },
  x: { value: 50, type: TYPE.RANGE, min: 0, max: 100, step: 1, label: '文字縦位置', description: 'テキスト縦位置(%)' },
  y: { value: 55, type: TYPE.RANGE, min: 0, max: 100, step: 1, label: '文字横位置', description: 'テキスト横位置(%)' },
  svgLeft: { value: 0, type: TYPE.RANGE, min: -50, max: 50, step: 1, label: '文字横マージン', description: 'テキスト縦マージン' },
  svgTop: { value: 0, type: TYPE.RANGE, min: -50, max: 50, step: 1, label: '文字縦マージン', description: 'テキスト横マージン' },
  isSvgBg: { value: true, type: TYPE.CHECKBOX, label: '背景表示', description: 'テキスト背景表示' },
  svgBgColor: { value: 'rgba(0,0,0,0.5)', type: TYPE.COLOR, label: '背景色', description: 'テキスト背景カラー' },
  svgWidthMargin: { value: 0, type: TYPE.RANGE, min: -25, max: 25, step: 1, label: '字詰め', description: '字詰め' },
  svgHeightMargin: { value: 0, type: TYPE.RANGE, min: -25, max: 25, step: 1, label: '行間', description: '行間' },
  svgWidthOffset: { value: 0, type: TYPE.RANGE, min: -10, max: 10, step: 1, label: '横幅', description: 'テキストオフセット幅' },
  svgHeightOffset: { value: 0, type: TYPE.RANGE, min: -10, max: 10, step: 1, label: '高さ', description: 'テキストオフセット高さ' },
  deleteTime: { value: 0, type: TYPE.RANGE, min: 0, max: 15, step: 0.1, label: '字幕消去時間', description: '字幕消去時間' },
  fadeTime: { value: 0.5, type: TYPE.RANGE, min: 0, max: 5, step: 0.1, label: 'フェード時間', description: 'フェード時間', change: 'updateCss' },
  moveTime: { value: 0.5, type: TYPE.RANGE, min: 0, max: 5, step: 0.1, label: '字幕移動時間', description: '字幕移動時間', change: 'updateCss' },
  outTime: { value: 0.5, type: TYPE.RANGE, min: 0, max: 5, step: 0.1, label: '退場移動時間', description: '退場移動時間', change: 'updateCss' },
  inPositionX: { value: 0, type: TYPE.RANGE, min: -100, max: 100, step: 1, label: '登場横位置', description: '表示横位置', change: 'updateCss' },
  inPositionY: { value: 0, type: TYPE.RANGE, min: -100, max: 100, step: 1, label: '登場縦位置', description: '表示縦位置', change: 'updateCss' },
  outPositionX: { value: 0, type: TYPE.RANGE, min: -100, max: 100, step: 1, label: '退場横位置', description: '退場横位置', change: 'updateCss' },
  outPositionY: { value: 0, type: TYPE.RANGE, min: -100, max: 100, step: 1, label: '退場縦位置', description: '退場縦位置', change: 'updateCss' },
  fadeEasingType: { value: 'ease', type: TYPE.SELECT, data: EASING_TYPE, label: 'フェードタイプ', description: 'フェードタイプ', change: 'updateCss' },
  moveEasingType: { value: 'ease', type: TYPE.SELECT, data: EASING_TYPE, label: '移動タイプ', description: '移動タイプ', change: 'updateCss' },
  isVolumeCheck: { value: true, type: TYPE.CHECKBOX, label: 'ボリュームしきい値字幕送り', description: 'ボリュームしきい値字幕送り' },
  volumeCoefficient: { value: 100, type: TYPE.RANGE, min: 1, max: 300, step: 1, label: '音量係数', description: '音量係数' },
  stopVolumeThreshold: { value: 15, type: TYPE.RANGE, min: 1, max: 500, step: 1, label: '音量しきい値', description: '音量しきい値' },
  stopTime: { value: 250, type: TYPE.RANGE, min: 1, max: 2500, step: 1, label: '停止時間(ms)', description: '停止時間(ms)' },
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
    return this.fontSize + this.strokeWidth + this.svgWidthOffset - (this.isBorder && !isPureSize ? 2 : 0);
  }
  result.getSvgBoxHeight = function (isPureSize) {
    return this.fontSize + this.strokeWidth + this.svgHeightOffset - (this.isBorder && !isPureSize ? 2 : 0);
  }
  result.getSvgBoxMargin = function (len, idx) {
    let limit = this.svgContainerWidth / this.getSvgBoxWidth(true);

    // 横位置 -1/0/1
    let colPosition = (idx % limit) / limit;
    let alignPosition = colPosition === 0.5 ? 0 : colPosition < 0.5 ? -1 : 1;

    // 縦位置 -1/0/1
    let rowPosition = Math.floor(idx / limit);
    let justifiPosition = rowPosition === 0 ? -1 : rowPosition === Math.floor(len / limit) ? 1 : 0;

    let isTop = idx - limit > -1;
    let isLeft = idx % limit !== 0;

    // TODO: 仮の値を返却
    return this.svgHeightMargin + 'px ' + this.svgWidthMargin + 'px'
  }
  return result;
}
const VIEW_SETTINGS = {
  showMenu: { title: '表示', keys: [['backgroundColor'], ['svgGroupWidth'], ['svgGroupMargin'], ['svgGroupAlign'], ['svgGroupJustify']] },
  beforeTextMenu: { title: '前置きテキスト', keys: [['isBeforeText', 'isBeforeColumn'], ['beforeText'], ['beforeTextFontFamily']] },
  textMenu: { title: '字幕', keys: [['fontFamily'], ['fontSize'], ['fontWeight'], ['strokeWidth'], ['fill'], ['stroke'], ['x'], ['y'], ['svgLeft'], ['svgTop'], ['svgBlockAlign']] },
  textEtcMenu: { title: '字幕他', keys: [['isSvgBg'], ['svgBgColor'], ['svgWidthMargin'], ['svgHeightMargin'], ['svgWidthOffset'], ['svgHeightOffset'], ['deleteTime']] },
  textAnimeMenu: {
    title: '字幕アニメ', keys: [['fadeTime'], ['moveTime'], ['outTime'], ['inPositionX'], ['inPositionY'], ['outPositionX'], ['outPositionY'], ['fadeEasingType'], ['moveEasingType']]
  },
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
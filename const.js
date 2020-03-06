const TYPE = {
  TEXT: 1,
  NUMBER: 2,
  RANGE: 3,
  CHECKBOX: 4,
  RADIO: 5,
};
const FLEX_ALIGN = [
  { text: '左', value: 'flex-start' }, { text: '中', value: 'center' }, { text: '右', value: 'flex-end' }
];
const FLEX_JUSTIFY = [
  { text: '上', value: 'flex-start' }, { text: '中', value: 'center' }, { text: '下', value: 'flex-end' }
];
const SETTINGS = {
  isBorder: { value: true, type: TYPE.CHECKBOX, label: '罫線表示', description: 'ボーダー表示' },
  backgroundColor: { value: '#00FF00', type: TYPE.TEXT, label: '背景色', description: '背景色' },
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
  fontSize: { value: 25, type: TYPE.RANGE, min: 1, max: 100, step: 1, label: '文字色', description: 'テキストサイズ' },
  fontWeight: { value: 400, type: TYPE.RANGE, min: 100, max: 900, step: 100, label: '文字太さ', description: 'テキスト太さ' },
  strokeWidth: { value: 5, type: TYPE.RANGE, min: 0, max: 20, step: 1, label: '縁取り太さ', description: '縁取りサイズ' },
  fill: { value: '#FFFF00', type: TYPE.TEXT, label: '文字色', description: 'テキストカラー' },
  stroke: { value: '#000000', type: TYPE.TEXT, label: '縁取り色', description: '縁取りカラー' },
  x: { value: 50, type: TYPE.RANGE, min: 0, max: 100, step: 1, label: '縦', description: 'テキスト縦位置(%)' },
  y: { value: 55, type: TYPE.RANGE, min: 0, max: 100, step: 1, label: '横', description: 'テキスト横位置(%)' },
  isSvgBg: { value: true, type: TYPE.CHECKBOX, label: '背景表示', description: 'テキスト背景表示' },
  svgBgColor: { value: 'rgba(0,0,0,0.5)', type: TYPE.TEXT, label: '背景色', description: 'テキスト背景カラー' },
  svgWidthMargin: { value: 0, type: TYPE.RANGE, min: -25, max: 25, step: 1, label: '字詰め', description: '字詰め' },
  svgHeightMargin: { value: 0, type: TYPE.RANGE, min: -25, max: 25, step: 1, label: '行間', description: '行間' },
  svgWidthOffset: { value: 0, type: TYPE.RANGE, min: -10, max: 10, step: 1, label: '横幅', description: 'テキストオフセット幅' },
  svgHeightOffset: { value: 0, type: TYPE.RANGE, min: -10, max: 10, step: 1, label: '高さ', description: 'テキストオフセット高さ' },
};
const VIEW_SETTINGS = [
  { title: '表示', keys: [['backgroundColor'], ['svgGroupWidth'], ['svgGroupMargin'], ['svgGroupAlign'], ['svgGroupJustify'], ['svgBlockAlign']] },
  { title: '前置きテキスト', keys: [['isBeforeText', 'isBeforeColumn'], ['beforeText'], ['beforeTextFontFamily']] },
  { title: 'テキスト', keys: [['fontFamily'], ['fontSize'], ['fontWeight'], ['strokeWidth'], ['fill'], ['stroke'], ['x'], ['y']] },
  { title: 'テキスト他', keys: [['isSvgBg'], ['svgBgColor'], ['svgWidthMargin'], ['svgHeightMargin'], ['svgWidthOffset'], ['svgHeightOffset']] },
];
function getDefaultSetting() {
  return Object.keys(SETTINGS).reduce((n, p) => {
    n[p] = SETTINGS[p].value;
    return n;
  }, {})
}
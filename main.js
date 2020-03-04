const TYPE = {
  TEXT: 1,
  NUMBER: 2,
  RANGE: 3,
  CHECKBOX: 4,
}
const SETTINGS = {
  backgroundColor: { value: '#0F0', type: TYPE.TEXT, description: '背景色' },
  isBeforeText: { value: true, type: TYPE.CHECKBOX, description: '前置きテキスト表示' },
  isBeforeColumn: { value: true, type: TYPE.CHECKBOX, description: '前置きテキスト表示方向' },
  beforeText: { value: '(名前)', type: TYPE.TEXT, description: '前置きテキスト' },
  beforeTextFontFamily: { value: 'Noto Sans JP', type: TYPE.TEXT, description: '前置きテキストフォント' },
  fontFamily: { value: 'Noto Sans JP', type: TYPE.TEXT, description: 'テキストフォント' },
  fontSize: { value: 25, type: TYPE.RANGE, min: 1, max: 100, step: 1, description: 'テキストサイズ' },
  strokeWidth: { value: 5, type: TYPE.RANGE, min: 0, max: 20, step: 1, description: '縁取りサイズ' },
  fill: { value: '#FF0', type: TYPE.TEXT, description: 'テキストカラー' },
  stroke: { value: '#000', type: TYPE.TEXT, description: '縁取りカラー' },
  x: { value: 50, type: TYPE.RANGE, min: 0, max: 100, step: 1, description: 'テキスト縦位置(%)' },
  y: { value: 55, type: TYPE.RANGE, min: 0, max: 100, step: 1, description: 'テキスト横位置(%)' },
  isSvgBg: { value: true, type: TYPE.CHECKBOX, description: 'テキスト背景表示' },
  svgBgColor: { value: 'rgba(0,0,0,0.5)', type: TYPE.TEXT, description: 'テキスト背景カラー' },
  svgWidthMargin: { value: 0, type: TYPE.RANGE, min: -25, max: 25, step: 1, description: '字詰め' },
  svgHeightMargin: { value: 0, type: TYPE.RANGE, min: -25, max: 25, step: 1, description: '行間' },
  svgWidthOffset: { value: 0, type: TYPE.RANGE, min: -10, max: 10, step: 1, description: 'テキストオフセット幅' },
  svgHeightOffset: { value: 0, type: TYPE.RANGE, min: -10, max: 10, step: 1, description: 'テキストオフセット高さ' },
  svgGroupWidth: { value: 90, type: TYPE.RANGE, min: 10, max: 100, step: 1, description: 'テキスト表示幅(%)' },
  svgGroupBottomMargin: { value: 8, type: TYPE.RANGE, min: 0, max: 30, step: 1, description: 'テキスト下マージン' },
}
function getDefaultSetting() {
  return Object.keys(SETTINGS).reduce((n, p) => {
    n[p] = SETTINGS[p].value;
    return n;
  }, {})
}
Vue.component('svg-block', {
  props: ['isDebug', 'isBefore', 'text', 'settings'],
  template: `
<div class="svg-block" :class="{before : isBefore}" :style="{
    fontFamily:(isBefore ? settings.beforeTextFontFamily : settings.fontFamily)
  }">
  <div class="svg-box" v-for="v in [...(isBefore ? settings.beforeText : text)]" :style="{
        border: isDebug ? '1px solid' : '0',
        width: settings.fontSize + settings.strokeWidth + settings.svgWidthOffset - (isDebug ? 2 : 0) + 'px',
        height: settings.fontSize + settings.strokeWidth + settings.svgHeightOffset - (isDebug ? 2 : 0) + 'px',
        margin: settings.svgHeightMargin + 'px ' + settings.svgWidthMargin + 'px',
      }">
    <div class="svg-bg" v-if="settings.isSvgBg" :style="{
        backgroundColor: settings.svgBgColor,
      }"></div>
    <svg class="svg">
      <text class="svg-text" :x="settings.x + '%'" :y="settings.y + '%'" :style="{
        fontSize: settings.fontSize + 'px',
        strokeWidth: settings.strokeWidth + 'px',
        fill: settings.fill,
        stroke: settings.stroke,
      }">{{ v }}</text>
    </svg>
  </div>
</div>`
});

var vm = new Vue({
  el: '#app',
  data: {
    isDebug: false,
    isRecording: false,
    recordStartDate: null,
    recognition: null,
    sameUserMaxSubCount: 1,
    settings: {
      'aaaa': getDefaultSetting()
    },
    loginUser: { id: 'aaaa' },
    transcripts: [],
    subs: [],
    archives: [],
    svgContainerWidth: 0,
  },
  computed: {
    lastTrascriptData: function () {
      return this.transcripts.slice(-1)[0];
    },
  },
  mounted() {
    // TODO: どうにかしたい
    window.addEventListener('resize', this.resizeHandler);
    this.$nextTick(function () {
      this.resizeHandler();
    })

    const ID = this.loginUser.id;

    SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.lang = 'ja-JP';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (e) => {
      // ユーザIDが一致する字幕が重複件数以上かつ、認識終了済字幕だった場合は最古から消去を行う
      if (this.getNotDeleteSameUserSubs(ID).length >= this.sameUserMaxSubCount && this.getNotDeleteSameUserSubs(ID)[0].isFinal) {
        this.firstSubRemove(ID);
      }
      for (let i = e.resultIndex; i < e.results.length; i++) {
        let transcript = e.results[i][0].transcript;
        let targetSubs = this.getNotDeleteSameUserSubs(ID);
        if (targetSubs.length === 0) {
          let data = {
            id: ID,
            key: `${ID}_${Math.floor(e.timeStamp)}`,
            text: transcript,
            isFinal: false,
            isDelete: false,
            start: Math.floor(e.timeStamp),
            end: null
          };
          this.subs.push(data);
        } else {
          targetSubs[targetSubs.length - 1].text = transcript;
        }
        if (e.results[i].isFinal) {
          console.log(transcript);
          let target = this.getNotDeleteSameUserSubs(ID).reverse()[0];
          target.isFinal = true;
          target.end = Math.floor(e.timeStamp);
        }
      }
    }
    recognition.onerror = (e) => {
      console.warn(e);
    }
    recognition.onend = (e) => {
      if (!this.isRecording) return;
      console.log('on end');
      this.start();
    }
    recognition.onnomatch = function (event) {
      console.error('on nomatch');
    }
  },
  beforeDestroy: function () {
    // TODO: どうにかしたい
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    resizeHandler: function (e) {
      this.$nextTick(function () {
        this.svgContainerWidth = this.$refs.svgContainer.clientWidth
      });
    },
    debugSubPush: function (num) {
      var text = [...new Array(num)].map(v => "こんにちは").join('');
      this.subs.push({
        id: 'aaaa', key: 'aaaa_2748',
        text: text,
        isFinal: true, isDelete: false,
        start: 2748, end: 2781
      });
    },
    start: function () {
      console.log('start');
      if (!this.recordStartDate) this.recordStartDate = new Date();
      this.isRecording = true;
      recognition.start();
    },
    stop: function () {
      console.log('stop');
      this.isRecording = false;
      recognition.stop();
    },
    getFormatedTimeStamp: function (timeStamp) {
      if (!this.recordStartDate) return timeStamp;

      let d = new Date(this.recordStartDate.getTime() + Number(timeStamp));
      const fill = (n) => ('0' + n).slice(-2);

      return `${d.getFullYear()}/${fill(d.getMonth() + 1)}/${fill(d.getDate())} ${fill(d.getHours())}:${fill(d.getMinutes())}:${fill(d.getSeconds())}`
    },
    getNotDeleteSameUserSubs: function (id) {
      return this.subs.filter((v) => v.id === id && !v.isDelete);
    },
    firstSubRemove: function (id) {
      let targetSubs = this.subs.filter((v) => v.id === id && !v.isDelete);
      if (targetSubs.length > 0) {
        targetSubs[0].isDelete = true;
      }
    },
  },
})
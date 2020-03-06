Vue.component('svg-block', {
  props: ['isBefore', 'text', 'settings'],
  template: `
<div class="svg-block" :class="{before : isBefore}" :style="{
    fontFamily:(isBefore ? settings.beforeTextFontFamily : settings.fontFamily),
    justifyContent: settings.svgBlockAlign,
  }">
  <div class="svg-box" v-for="v in [...(isBefore ? settings.beforeText : text)]" :style="{
        border: settings.isBorder ? '1px solid' : '0',
        width: settings.fontSize + settings.strokeWidth + settings.svgWidthOffset - (settings.isBorder ? 2 : 0) + 'px',
        height: settings.fontSize + settings.strokeWidth + settings.svgHeightOffset - (settings.isBorder ? 2 : 0) + 'px',
        margin: settings.svgHeightMargin + 'px ' + settings.svgWidthMargin + 'px',
      }">
    <div class="svg-bg" v-if="settings.isSvgBg" :style="{
        backgroundColor: settings.svgBgColor,
      }"></div>
    <svg class="svg">
      <text class="svg-text" :x="settings.x + '%'" :y="settings.y + '%'" :style="{
        fontSize: settings.fontSize + 'px',
        fontWeight: settings.fontWeight,
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
    svgContainerHeight: 240,
  },
  computed: {
    lastTrascriptData: function () {
      return this.transcripts.slice(-1)[0];
    },
  },
  mounted() {
    this.svgContainerWidth = window.innerWidth;

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
  methods: {
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
    getSvgGroupMargin: function (id) {
      // TODO: 本当は揃えと寄せを見て判定
      let margin = this.settings[id].svgGroupMargin + 'px';
      return margin;
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
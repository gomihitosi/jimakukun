var vm = new Vue({
  el: '#app',
  data: {
    isRecording: false,
    recordStartDate: null,
    recognition: null,
    sameUserMaxSubCount: 1,
    settings: {
      'aaaa': getSettingsData()
    },
    showMenuSetting: getShowMenuSetting(),
    loginUser: { id: 'aaaa' },
    subs: [],
    svgContainerWidth: 0,
    svgContainerHeight: 240,
    transitionStyle: null,
    colorPicker: { value: '', top: 0, left: 0, isShow: false, key: '' },
  },
  computed: {
    transitionEnter: function () {
      const d = this.settings[this.loginUser.id];
      return `.svg-transition-enter { opacity: ${d.fadeTime > 0 ? 0 : 1}; transform: translate(${d.inPositionX}px, ${d.inPositionY}px); }`;
    },
    transitionLeaveTo: function () {
      const d = this.settings[this.loginUser.id];
      return `.svg-transition-leave-to { opacity: ${d.fadeTime > 0 ? 0 : 1}; transform: translate(${d.outPositionX}px, ${d.outPositionY}px); }`;
    },
    transitionMove: function () {
      const d = this.settings[this.loginUser.id];
      return `.svg-transition-move { transition: transform ${d.moveTime}s ${d.moveEasingType}; }`;
    },
    transitionActive: function () {
      const d = this.settings[this.loginUser.id];
      return `.svg-transition-enter-active,.svg-transition-leave-active { transition: opacity ${d.fadeTime}s ${d.fadeEasingType} 0s, transform ${d.moveTime}s ${d.moveEasingType} 0s; }`;
    }
  },
  mounted() {
    // リサイズ時処理
    const resizeFunc = () => {
      this.svgContainerWidth = window.innerWidth;
    };
    window.addEventListener('resize', resizeFunc);
    resizeFunc();

    // トランジション用CSS
    this.transitionStyle = [...document.styleSheets].find(v => v.ownerNode.id === 'transition-style');
    this.updateCss();

    // TODO: 認識停止ボタン 仮実装
    addEventListener('keydown', (e) => {
      if (e.code === this.settings[this.loginUser.id].isStopKey && (e.ctrlKey || e.metaKey)) {
        this.recognition.stop();
      }
    });

    const ID = this.loginUser.id;

    SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.lang = 'ja-JP';
    this.recognition.interimResults = this.settings[this.loginUser.id].isInterim;
    this.recognition.continuous = true;

    this.recognition.onresult = (e) => {
      // ユーザIDが一致する字幕が重複件数以上かつ、認識終了済字幕だった場合は最古から消去を行う
      if (this.getNotDeleteSameUserSubs(ID).length >= this.sameUserMaxSubCount && this.getNotDeleteSameUserSubs(ID)[0].isFinal) {
        this.firstSubRemove(ID);
      }
      // 日本語の途中で英単語などが認識された場合、別indexで認識が始まってしまう為
      // 認識結果リストの中から終了フラグが立っていない物を対象に認識語句をすべて結合して取り扱う
      // 英単語を認識した際に半角スペースが挿入されるので空文字に置換
      let transcript = [...e.results].filter(v => !v.isFinal).map(v => v[0].transcript).join('').replace(/ /g, '');
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
        targetSubs = this.getNotDeleteSameUserSubs(ID);
      } else {
        targetSubs[targetSubs.length - 1].text = transcript;
      }
      if (e.results[e.resultIndex].isFinal) {
        // 認識終了時は全て結合された状態で [e.resultIndex][0] に結果が入っているのでそれを使う
        // 英単語を認識した際に半角スペースが挿入されるので空文字に置換
        let finishText = e.results[e.resultIndex][0].transcript.replace(/ /g, '');
        targetSubs[targetSubs.length - 1].text = finishText;
        console.log(finishText);
        let target = this.getNotDeleteSameUserSubs(ID).reverse()[0];
        target.isFinal = true;
        target.end = Math.floor(e.timeStamp);

        // 字幕消去時間が設定されている場合はイベントを設定
        if (this.settings[ID].deleteTime > 0) {
          window.setTimeout(() => { target.isDelete = true; }, this.settings[ID].deleteTime * 1000);
        }
      }
    }
    this.recognition.onerror = (e) => {
      console.warn(e);
    }
    this.recognition.onend = (e) => {
      if (!this.isRecording) return;
      console.log('on end');
      this.start();
    }
    this.recognition.onnomatch = function (event) {
      console.error('on nomatch');
    }
  },
  methods: {
    eventHandler: function (methodName) {
      if (!methodName) return;
      this[methodName](arguments.lengnth > 1 ? arguments.slice(1) : undefined);
    },
    start: function () {
      console.log('start');
      if (!this.recordStartDate) this.recordStartDate = new Date();
      this.isRecording = true;
      this.recognition.start();
    },
    stop: function () {
      console.log('stop');
      this.isRecording = false;
      this.recognition.stop();
    },
    save: function () {
      this.settings[this.loginUser.id].save();
    },
    reset: function () {
      this.settings[this.loginUser.id].remove();
      this.settings[this.loginUser.id] = getSettingsData();
      this.settings[this.loginUser.id].save();
    },
    changeInterim: function (id) {
      this.recognition.interimResults = this.settings[this.loginUser.id].isInterim;
      this.recognition.stop();
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
    updateStopKey: function () {
      this.settings[this.loginUser.id].isStopKey = "*キーを入力*"
      let func = (e) => {
        if (e.code && !e.ctrlKey && !e.metaKey) {
          this.settings[this.loginUser.id].isStopKey = e.code;
          document.activeElement.blur();
          removeEventListener('keydown', func);
        }
      };
      addEventListener('keydown', func);
    },
    updateCss: function () {
      // 設定されているCSSを削除した後、再付与
      Object.keys([...Array(this.transitionStyle.cssRules.length)]).forEach(v => this.transitionStyle.deleteRule(0));
      this.transitionStyle.insertRule(this.transitionActive);
      this.transitionStyle.insertRule(this.transitionMove);
      this.transitionStyle.insertRule(this.transitionLeaveTo);
      this.transitionStyle.insertRule(this.transitionEnter);
    },
    colorPick: function (e, key) {
      this.colorPicker.left = e.clientX;
      this.colorPicker.top = e.clientY;
      this.colorPicker.isShow = true;
      this.colorPicker.key = key;
      this.colorPicker.value = this.settings[this.loginUser.id][this.colorPicker.key];
    },
    colorPickerUpdate: function (e) {
      this.settings[this.loginUser.id][this.colorPicker.key] = `rgba(${e.rgba.r}, ${e.rgba.g}, ${e.rgba.b}, ${e.rgba.a})`;
    },
  },
})
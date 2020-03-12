Vue.component('svg-block', {
  props: ['isBefore', 'text', 'settings'],
  template: `
<div class="svg-block" :class="{before : isBefore}" :style="{
    fontFamily:(isBefore ? settings.beforeTextFontFamily : settings.fontFamily),
    justifyContent: settings.svgBlockAlign,
  }">
  <div class="svg-box" v-for="(v, i) in [...text]" :style="{
        border: settings.isBorder ? '1px solid' : '0',
        width: settings.getSvgBoxWidth() + 'px',
        height: settings.getSvgBoxHeight() + 'px',
        margin: settings.getSvgBoxMargin(text.length, i),
      }">
    <div class="svg-bg" v-if="settings.isSvgBg" :style="{
        backgroundColor: settings.svgBgColor,
      }"></div>
    <svg class="svg" :style="{ left: settings.svgLeft, top: settings.svgTop }">
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

// カラーピッカー
const VueColor = window.VueColor
const VueColorChrome = VueColor.Chrome;
Vue.component('chrome-picker', VueColorChrome);
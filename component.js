Vue.component('svg-block', {
  props: ['isBefore', 'text', 'settings'],
  template: `
<div class="svg-block" :class="{before : isBefore}" :style="{
    fontFamily:(isBefore ? settings.beforeTextFontFamily : settings.fontFamily),
    justifyContent: isBefore ? settings.beforeTextPosition : '',
    alignItems: isBefore ? settings.beforeTextPosition : '',
  }">
  <div class="svg-bg" :style="{
    backgroundColor: settings.isSvgBg ? settings.svgBgColor : '',
    padding: settings.svgHeightOffset + 'px ' + settings.svgWidthOffset + 'px',
    justifyContent: !isBefore ? settings.svgBlockAlign : '',
    flexWrap: !isBefore ? 'wrap' : '',
    marginBottom: settings.isBeforeText && isBefore && settings.beforeColumnDirection === 'column' ? (-settings.svgHeightOffset) + 'px' : '',
    marginRight: settings.isBeforeText && isBefore && settings.beforeColumnDirection === 'row' ? (-settings.svgWidthOffset) + 'px' : '',
    marginTop: settings.isBeforeText && !isBefore && settings.beforeColumnDirection === 'column' ? (-settings.svgHeightOffset) + 'px' : '',
    marginLeft: settings.isBeforeText && !isBefore && settings.beforeColumnDirection === 'row' ? (-settings.svgWidthOffset) + 'px' : '',
  }">
    <div class="svg-box" v-for="(v, i) in [...text]" :style="{
          border: settings.isBorder ? '1px solid' : '0',
          width: settings.getSvgBoxWidth() + 'px',
          height: settings.getSvgBoxHeight() + 'px',
        }">
      <svg class="svg" :style="{
          left: settings.svgLeft,
          top: settings.svgTop, 
          overflow: settings.isOverlay ? 'visible' : '',
        }">
        <text class="svg-text" :x="settings.x + '%'" :y="settings.y + '%'" :style="{
          fontSize: settings.fontSize + 'px',
          fontWeight: settings.fontWeight,
          strokeWidth: settings.strokeWidth + 'px',
          fill: settings.fill,
          stroke: settings.stroke,
        }">{{ v }}</text>
      </svg>
    </div>
  </div>
</div>
`});

// カラーピッカー
const VueColor = window.VueColor
const VueColorChrome = VueColor.Chrome;
Vue.component('chrome-picker', VueColorChrome);
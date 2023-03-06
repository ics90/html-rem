# html-rem

> 为了方便实用设计设计宽度进行可视化屏幕开发,针对rem适配页面的的小插件，用以动态设置HTML根节点的字体大小
> 并返回当前页面状态下的font-size


```
npm install html-rem
```

```
const enum OptionKeys {
    width = 'width',
    height = 'height',
}

export type HtmlRemOption = {
    [key in OptionKeys]: number   // 视口尺寸
} & {
    designSize: number     // 设计图尺寸,单位是px
    maxSize?: number     // 最大缩放尺寸
    base?: number // 默认1rem = 100px
}

```

```
import Vue from 'vue'
import { calcAdapterSize } from 'html-rem'
Vue.prototype.$globalFontSize = calcAndListen({ width: 1920, designWidth: 1920 })

```

```
import { calcAndListen } from 'html-rem'
<!-- 加入resize监听回调 -->
calcAndListen({ width: 1920, designWidth: 1920 }, (fontSize: number) => {
  <!-- Todo: save global font size -->
})

```
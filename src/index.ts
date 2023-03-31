function isPxSizeAvaiable(target: string) {
    return /^(\d)*(.)?(\d)*(px)?$/g.test(target)
}

const enum OptionKeys {
    width = 'width',
    height = 'height',
}

// const OptionKeys: string[] = ['width', 'height']

export type HtmlRemOption = {
    [key in OptionKeys]: number   // 视口尺寸
} & {
    designSize: number     // 设计图尺寸,单位是px
    maxSize?: number     // 最大缩放尺寸
    base?: number
}

let docElement: any = document.documentElement;
let styleDom: HTMLStyleElement = document.createElement("style");

function refreshRem(option: HtmlRemOption): number {
    const rect: DOMRect = document.documentElement?.getBoundingClientRect()
    // const key: string = OptionKeys.find(k => option[key] && option[k] > 0)
    const key = 'width'
    const htmlSize: number = Math.min(rect[key] || 1920, option['maxSize'] || Number.MAX_VALUE)
    const rem: number = (htmlSize * (option.base || 100)) / option[key];
    styleDom.innerHTML = "html{font-size:" + rem + "px;}";
    // console.log('calc rem = ', rem)
    return rem
}

function addEventListener(option: HtmlRemOption, cb: Function): void {
    let timer: any = null
    function refreshFn() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => refreshRem(option), 300);
    }

    window.addEventListener("resize", refreshFn, false);
    window.addEventListener("pageshow", refreshFn, false);

    if (document.readyState === 'complete') {
        document.body.style.fontSize = '16px'
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.style.fontSize = '16px'
        })
    }
}

/**
 * 计算对应的rem
 * @param option HtmlRemOption
 * @returns rem
 */
export function calcAdapterSize(option: HtmlRemOption): number {
    console.assert(!option, '[html-rem]calcAdapterSize Option Error, Object need!!!')
    if (docElement.firstElementChild) {
        docElement.firstElementChild.appendChild(styleDom);
    } else {
        let div: HTMLElement = document.createElement("div");
        div.appendChild(styleDom);
        docElement.write(div.innerHTML);
    }

    return refreshRem(option)
}

/**
 * 计算对应的rem并且开始监听fontSize变化
 * @param option HtmlRemOption
 * @param cb 回调函数, font size change listener
 * @returns rem
 */
export function calcAndListen(option: HtmlRemOption, cb: Function): number {
    const rem = calcAdapterSize(option)
    cb && cb(rem)
    addEventListener(option, cb)
    return rem
}
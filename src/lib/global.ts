import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";

export function isMiroMode() {
    return !!qiankunWindow.__POWERED_BY_QIANKUN__;
}

export function inSingleWebView() {
    return !!qiankunWindow.__IN_SINGLE_WEB_VIEW__;
}

import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";

export function isMiroMode() {
    return !!qiankunWindow.__POWERED_BY_QIANKUN__;
}

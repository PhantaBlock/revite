import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";

export function isMicroMode() {
    return !!qiankunWindow.__POWERED_BY_QIANKUN__;
}

export function inSingleWebView() {
    return !!qiankunWindow.__IN_SINGLE_WEB_VIEW__;
}

export function getSKY() {
    return qiankunWindow.__SKY__;
}

export function openMicroChannelPage(path?: string) {
    const url = `${location.origin}/microChannel.html${location.search}#${path}`;
    console.log('##openMicroChannelPage:', url);
    microOpenUrl(url);
}

export function microOpenUrl(url: string) {
    const SKY = getSKY();

    if (!SKY) return;

    SKY.openUrl({ url });
}

export function delayTime(time = 0) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}
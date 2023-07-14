import localforage from "localforage";
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

export async function openMicroChannelPage(path?: string) {
    const { origin, search } = window.location;
    const searchBase = search ? `${search}&` : '?';

    const auth = await localforage.getItem('auth');

    const _auth = auth ? JSON.stringify(auth) : '';
    const _search = `${searchBase}auth=${_auth}`;

    const url = `${origin}/microChannel.html${_search}#${path}`;
    console.log('##openMicroChannelPage:', url);
    microOpenUrl(url);
}

export function microOpenUrl(url: string) {
    const SKY = getSKY();

    if (!SKY) return;

    SKY.openUrl({
        url,
        path: 'microChannel.html',
    });
}

export function delayTime(time = 0) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}
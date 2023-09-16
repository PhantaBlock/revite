import localforage from "localforage";
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import CryptoJS from 'crypto-js';

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

    SKY.openUrlProportion({
        url,
        path: 'microChannel.html',
        key: 'microChannel',
        width: 2309,
        height: 1843,
    });
}

export function delayTime(time = 0) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

const keyStr = '-mall4j-password'; // 解密用的key

export const encrypt = (word: string) => {
    const time = Date.now();

    const key = CryptoJS.enc.Utf8.parse(keyStr);
    const srcs = CryptoJS.enc.Utf8.parse(time + word);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
}
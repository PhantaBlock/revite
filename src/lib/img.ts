interface IOption {
    [key: string]: any;
}

export const getImageType = (url: string) => {
    const extension = url.split('.').pop();

    if (!extension) {
        return 'unknown';
    }

    if (/^(jpg|jpeg)$/i.test(extension)) {
        return 'JPEG';
    } else if (/^png$/i.test(extension)) {
        return 'PNG';
    } else if (/^gif$/i.test(extension)) {
        return 'GIF';
    } else if (/^webp$/i.test(extension)) {
        return 'WEBP';
    } else {
        return 'unknown';
    }
};

export const processImgSize = (ossUrl?: string, option?: IOption) => {
    if (!ossUrl) return '';
    const imgType = getImageType(ossUrl);
    if (imgType == 'WEBP' || ossUrl.indexOf('?') > -1) return ossUrl; // webp图片已压缩
    if (ossUrl && !ossUrl.match('^http')) return ossUrl;
    let param = '';

    const { q = 50, w, h, p = 80 } = option || {};
    if (w) {
        param += `w_${w},`;
    }
    if (h) {
        param += `h_${h},`;
    }

    if (!w && !h) {
        param += `p_${p}/format,`;
    }
    return `${ossUrl}?x-oss-process=image/resize,${param}webp/quality,q_${q}`
}

export const fitlterOssImg = (url: string, option?: IOption) => {
    const oss = 'https://img.war6sky.com';
    if (!url) return '';
    if (url.match('^http')) {
        const _url = url.replace('https://skyvs.oss-cn-hangzhou.aliyuncs.com', oss);
        return processImgSize(_url, option)
    } else {
        return processImgSize(`${oss}/${url}`, option)
    }
}

export type IPreImgOpt = {
    loadingSrc?: string,
    w: string | number,
    h: string | number,
    q: string | number,
}

export const preImgLoad = (sourceUrl: string, imageEl: any, option?: IPreImgOpt) => {
    const {
        loadingSrc,
        w,
        h,
        q,
    } = option || {};
    // 第一批webp头像 处理一下
    const mathWebpAvatar = sourceUrl.match(/\/gift\/prod\/20231207\/avatar[0-2].webp/i);
    if (mathWebpAvatar) {
        sourceUrl = sourceUrl.replace(/.webp/i, '.gif');
    }
    const preParam = { q: 10, w: (w / 4 || 10).toFixed(0), h: (h / 4 || 10).toFixed(0) };
    const newImage = new Image();
    newImage.src = fitlterOssImg(sourceUrl, { q, w, h });
    newImage.onload = () => {
        if (!imageEl?.current) return '';
        if (w | h | q) {
            imageEl.current.src = fitlterOssImg(sourceUrl, { q, w, h });
        } else {
            imageEl.current.src = sourceUrl;
        }
    };
    newImage.onerror = () => {
        console.warn(sourceUrl, '---preLoad error---');
    };
    return loadingSrc || fitlterOssImg(sourceUrl, preParam);
};
const base = 16 / 12;

// 仅适用于组件库默认样式转换
export const pxTorem = (num: number) => {
    return `${num / 12}rem`;
};

export const remTorem = (num: number) => {
    return `${num * base}rem`;
};

export const numTonum = (num: number) => {
    return (num / 16) * 12;
};

// 新版视觉稿要用这个方法转px
export const px2orem = (num: number) => {
    return `${num / 32}rem`;
};
// 两倍图number转换
export const num2 = (num: number) => {
    return (num / 32) * 12;
};

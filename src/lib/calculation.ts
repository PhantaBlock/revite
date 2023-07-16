const base = 16 / 16;
export const pxTorem = (num: number) => {
    return `${num / 16}rem`;
};

export const remTorem = (num: number) => {
    return `${num * base}rem`;
};

export const numTonum = (num: number) => {
    return (num / 16) * 16;
};

// 新版视觉稿要用这个方法转px
export const px2orem = (num: number) => {
    return `${num / 32}rem`;
};
// 两倍图number转换
export const num2 = (num: number) => {
    return (num / 32) * 12;
};

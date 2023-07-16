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

const base = 16 / 12;
export const pxTorem = (num: number) => {
    return `${num / 12}rem`;
};

export const remTorem = (num: number) => {
    return `${num * base}rem`;
};

export const numTonum = (num: number) => {
    return (num / 16) * 12;
};

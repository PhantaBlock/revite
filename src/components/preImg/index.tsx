import { useRef } from "preact/hooks";
import { preImgLoad } from "../../lib/img";

type IImg = {
    src: string;
    loadingSrc?: string;
    q?: string | number;
    w?: string | number;
    h?: string | number;
    [key: string]: any;
};

const PreImg = (props: IImg) => {
    const ImgEle: any = useRef(null);
    const {
        src = '',
        loadingSrc = '',
        q = '100',
        w = '',
        h = '',
    } = props;

    return (
        <img
            {...props}
            ref={ImgEle}
            src={preImgLoad(src, ImgEle, { w, h, q, loadingSrc })}
        />
    );
}

export default PreImg;
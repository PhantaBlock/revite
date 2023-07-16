import { createGlobalStyle } from "styled-components";

const DESIGN_WIDTH = 1920; // 设计稿的宽度
const windowWidth = window.innerWidth; // 视窗宽度
// windowWidth 这里不考虑屏幕宽度变化，如果需要考虑，可以将 windowWidth 作为一个变量传入 createGlobalStyle

export default createGlobalStyle`
    html {
        font-size: ${windowWidth / DESIGN_WIDTH}px;
    }
`;

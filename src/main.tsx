import "./styles/index.scss";
import { render } from "preact";

import "../external/lang/Languages.patch";
import { App } from "./pages/app";
import { MicroApp } from "./micro";
import "./updateWorker";

import { renderWithQiankun, qiankunWindow, QiankunProps } from 'vite-plugin-qiankun/dist/helper';

const renderApp = () => {
  window.document.documentElement.style.fontSize = 12 + 'px';
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  render(<App />, document.getElementById("app")!);
};

const initQianKun = () => {
  renderWithQiankun({
    bootstrap() {
      console.log('微应用：bootstrap');
    },
    mount(props) { // 获取主应用传入数据
      console.log('微应用：mount', props);
      const { inSingleWebView, SKY, ...rest } = props;

      qiankunWindow.__IN_SINGLE_WEB_VIEW__ = !!inSingleWebView;
      SKY && (qiankunWindow.__SKY__ = SKY);

      render((
        <MicroApp {...rest} />
      ), props?.container || document.getElementById("app")!);
    },
    unmount(props) {
      console.log('微应用：unmount', props);
    },
    update(props) {
      console.log('微应用：update', props);
    },
  });
}

// 判断是否使用 qiankun ，保证项目可以独立运行
qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : renderApp();


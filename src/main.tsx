import "./styles/index.scss";
import { render } from "preact";

import "../external/lang/Languages.patch";
import { App } from "./pages/app";
import { MiroApp } from "./miro";
import "./updateWorker";

import { renderWithQiankun, qiankunWindow, QiankunProps } from 'vite-plugin-qiankun/dist/helper';

const renderApp = (props?: QiankunProps) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  render(<App />, props?.container || document.getElementById("app")!);
};

const initQianKun = () => {
  renderWithQiankun({
    bootstrap() {
      console.log('微应用：bootstrap');
    },
    mount(props) { // 获取主应用传入数据
      console.log('微应用：mount', props);
      if (props.inSingleWebView) {
        qiankunWindow.__IN_SINGLE_WEB_VIEW__ = true;
      }

      render((
        <MiroApp
          exposeComponent={props.exposeComponent}
          token={props.token}
        />
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

// qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : renderApp(); // 判断是否使用 qiankun ，保证项目可以独立运行

qiankunWindow.__POWERED_BY_QIANKUN__ = true;
qiankunWindow.__IN_SINGLE_WEB_VIEW__ = false;
render((
  <MiroApp
    token="gco83tFUeonU9llse25BKzV2p5G2Wy+VaU+r3bkYmUmnlkc9L0N8x4mlC+NheCIp"
    userId="02c482c1b4994b6d9daa39a26a0ab633"
  />
), document.getElementById("app")!);

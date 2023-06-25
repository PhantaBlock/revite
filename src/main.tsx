import "./styles/index.scss";
import { render } from "preact";

import "../external/lang/Languages.patch";
import { App } from "./pages/app";
import { MiroApp } from "./miro";
import "./updateWorker";

import { renderWithQiankun, qiankunWindow, QiankunProps } from 'vite-plugin-qiankun/dist/helper'

const renderApp = (props?: QiankunProps) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    render(<MiroApp />, props?.container || document.getElementById("app")!);
};

const initQianKun = () => {
    renderWithQiankun({
      bootstrap() {
        console.log('微应用：bootstrap')
      },
      mount(props) { // 获取主应用传入数据
        console.log('微应用：mount', props)
        renderApp(props);
      },
      unmount(props) {
        console.log('微应用：unmount', props)
      },
      update(props) {
        console.log('微应用：update', props)
      },
    });
};

qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : renderApp(); // 判断是否使用 qiankun ，保证项目可以独立运行
  

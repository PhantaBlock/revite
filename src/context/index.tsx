import { Router, Link } from "react-router-dom";

import { ContextMenuTrigger } from "preact-context-menu";
import { Text } from "preact-i18n";
import { useEffect, useState } from "preact/hooks";

import { Preloader, UIProvider } from "@revoltchat/ui";

import { state } from "../mobx/State";

import Binder from "../controllers/client/jsx/Binder";
import ModalRenderer from "../controllers/modals/ModalRenderer";
import Locale from "./Locale";
import Theme from "./Theme";
import { history } from "./history";
import { delayTime } from "../lib/global";

const uiContext = {
    Link,
    Text: Text as any,
    Trigger: ContextMenuTrigger,
    emitAction: () => void {},
};

/**
 * This component provides all of the application's context layers.
 * @param param0 Provided children
 */
export default function Context({ children, beforeHydrate, delayForTest }: {
    children: Children;
    beforeHydrate?: () => Promise<void>;
    delayForTest?: boolean;
}) {
    const [ready, setReady] = useState(false);

    const _hydrate = async () => {
        await beforeHydrate?.();
        await state.hydrate();

        if (delayForTest) {
            await delayTime(1000);
        }

        setReady(true);
    };

    useEffect(() => {
        _hydrate().catch(e => console.log('##', e));
    }, []);

    // if (!ready) return <Preloader type="spinner" />;

    return (
        <Router history={history}>
            <UIProvider value={uiContext}>
                <Locale>
                    {ready ? (
                        <>{children}</>
                    ) : <Preloader type="spinner" />}
                    {/* Binder注册了state的监听写入localforage，需要先挂载 */}
                    <Binder />
                    <ModalRenderer />
                </Locale>
            </UIProvider>
            <Theme />
        </Router>
    );
}

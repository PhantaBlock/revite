import { Switch } from "react-router";
import { Route, HashRouter } from "react-router-dom";

import { useEffect, useState } from "preact/hooks";

import { internalSubscribe } from "../../lib/eventEmitter";

import SidebarBase from "./SidebarBase";
import MemberSidebar from "./right/MemberSidebar";
import { isMiroMode } from "../../lib/global";
import { SearchSidebar } from "./right/Search";


export default function RightSidebar() {
    const isMiro = isMiroMode();
    const [sidebar, setSidebar] = useState<"search" | undefined>();
    const close = () => setSidebar(undefined);

    useEffect(
        () =>
            internalSubscribe(
                "RightSidebar",
                "open",
                setSidebar as (...args: unknown[]) => void,
            ),
        [setSidebar],
    );

    const content =
        sidebar === "search" ? (
            <SearchSidebar close={close} />
        ) : (
            <MemberSidebar />
        );

    return (
        <SidebarBase>
            {isMiro ?
                <HashRouter>
                    <Route path="/server/:server/channel/:channel">{content}</Route>
                    <Route path="/channel/:channel">{content}</Route>
                </HashRouter> :
                <Switch>
                    <Route path="/server/:server/channel/:channel">{content}</Route>
                    <Route path="/channel/:channel">{content}</Route>
                </Switch>}
        </SidebarBase>
    );
}

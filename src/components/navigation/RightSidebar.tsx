import { Route, Switch } from "react-router";

import { useEffect, useState } from "preact/hooks";

import { internalSubscribe } from "../../lib/eventEmitter";

import SidebarBase from "./SidebarBase";
import MemberSidebar from "./right/MemberSidebar";
import { SearchSidebar } from "./right/Search";
import { isMicroMode } from "../../lib/global";
export default function RightSidebar() {
    const [sidebar, setSidebar] = useState<"search" | undefined>();
    const close = () => setSidebar(undefined);
    const isMicro = isMicroMode();

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
        <SidebarBase paddingTop={isMicro ? '5.4687rem' : ""} borderLeft={isMicro ? '1px solid #766A58' : ''}>
            <Switch>
                <Route path="/server/:server/channel/:channel">{content}</Route>
                <Route path="/channel/:channel">{content}</Route>
            </Switch>
        </SidebarBase>
    );
}

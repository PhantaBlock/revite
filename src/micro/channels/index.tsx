import { useEffect, useState } from "preact/compat";
import { observer } from "mobx-react-lite";
import Channel from "../../pages/channels/Channel";
import { useClient, useSession } from "../../controllers/client/ClientController";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Docked, OverlappingPanels, ShowIf } from "react-overlapping-panels";
import HomeSidebar from "../../components/navigation/left/HomeSidebar";
import RightSidebar from "../../components/navigation/RightSidebar";
import { isTouchscreenDevice } from "../../lib/isTouchscreenDevice";
import styled, { css } from "styled-components/macro";
import { useApplicationState } from "../../mobx/State";
import { SIDEBAR_CHANNELS } from "../../mobx/stores/Layout";
import Open from "../../pages/Open";
import MenuAdapter from "../menuAdapter";
import { remTorem, pxTorem, numTonum } from '../../lib/calculation';

const HomeContent = styled.div.attrs({
    "data-component": "content",
})`
    width: 100%;
    height: 100vh;
    overflow: hidden;
    // padding-top: ${pxTorem(45)};
    // height: 100vh;
    box-sizing: border-box;

    > div {
        width: 100%;
        height: 100%;
    }
`;

const Routes = styled.div.attrs({ "data-component": "routes" }) <{
    borders: boolean;
}>`
    min-width: 0;
    display: flex;
    position: relative;
    flex-direction: column;

    background: transparent !important;

    ${() =>
        isTouchscreenDevice &&
        css`
            overflow: hidden;
        `}
`;

export default observer(() => {
    const layout = useApplicationState().layout;
    const isOpen = layout.getSectionState(SIDEBAR_CHANNELS, true);

    return (
        <HomeContent>
            <HashRouter>
                <OverlappingPanels
                    width="100vw"
                    height={"var(--app-height)"}
                    leftPanel={isOpen ? { width: 310, component: <HomeSidebar /> } : undefined}
                    docked={isTouchscreenDevice ? Docked.None : Docked.Left}
                >
                    <Routes>
                        <Switch>
                            <Route
                                path="/channel/:channel/:message"
                                component={Channel}
                            />
                            <Route
                                path="/server/:server/channel/:channel/:message"
                                component={Channel}
                            />

                            <Route
                                path="/server/:server/channel/:channel"
                                component={Channel}
                            />
                            <Route path="/server/:server" component={Channel} />
                            <Route
                                path="/channel/:channel"
                                component={Channel}
                            />
                            <Route path="/open/:id" component={Open} />
                        </Switch>
                    </Routes>
                </OverlappingPanels>
            </HashRouter>
            <MenuAdapter />
        </HomeContent>
    );
});
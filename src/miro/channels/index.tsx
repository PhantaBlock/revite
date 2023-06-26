import { useEffect, useState } from "preact/compat";
import { observer } from "mobx-react-lite";
import Channel from "../../pages/channels/Channel";
import { useClient } from "../../controllers/client/ClientController";
import { HashRouter, Route, Switch } from "react-router-dom";
import { OverlappingPanels } from "react-overlapping-panels";
import HomeSidebar from "../../components/navigation/left/HomeSidebar";

export default observer(() => {
    return (
        <HashRouter>
            <OverlappingPanels
                width="100%"
                height="100%"
                leftPanel={{ width: 290, component: <HomeSidebar /> }}
            >
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
                </Switch>
            </OverlappingPanels>
        </HashRouter>
    );
});
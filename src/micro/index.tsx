import { lazy, Suspense, useEffect, useState } from "preact/compat";
import { Masks, Preloader } from "@revoltchat/ui";

import Context from "../context";
import { clientController } from "../controllers/client/ClientController";

import localforage from "localforage";

enum ComponentName {
    Friends = "Friends",
    TempChannel = "TempChannel",
    Channels = "Channels",
}

const Register = {
    [ComponentName.Friends]: lazy(() => import("../pages/friends/Friends")),
    [ComponentName.TempChannel]: lazy(() => import("./tempChannel")),
    [ComponentName.Channels]: lazy(() => import("./channels")),
};

const LoadSuspense: React.FC = ({ children }) => (
    // @ts-expect-error Typing issue between Preact and Preact.
    <Suspense fallback={<Preloader type="ring" />}>{children}</Suspense>
);

export function MicroApp(props: {
    exposeComponent: ComponentName;
    token: string;
    userId: string;
    needHandleAuthenticate?: boolean;
}) {
    const {
        exposeComponent = ComponentName.Friends,
        token,
        userId,
        needHandleAuthenticate = true,
        ...extra
    } = props;
    const Component = Register[exposeComponent];

    const beforeHydrate = async () => {
        if (!needHandleAuthenticate) return;

        const auth: any = await localforage.getItem('auth');
        let current: any = undefined;

        if (auth && typeof auth === 'object') {
            const sessions = Object.values(auth.sessions || {});
            current = sessions.find((item: any) => item.session.user_id === userId);
            console.log('##', sessions, current, userId);
        }

        if (!current) {
            console.log('##authenticate');
            // @ts-ignore-next-line
            const session = await clientController.apiClient.api.post("/users/authenticate", {
                token
            });

            current = { session };
        }

        console.log('##current auth:', current);

        const _auth = {
            sessions: {
                [current.session.user_id]: current,
            }
        };

        // 覆写 current auth
        await localforage.removeItem("auth");
        await localforage.setItem("auth", _auth);
    };

    return (
        <Context
            beforeHydrate={beforeHydrate}
            delayForTest={!needHandleAuthenticate}
        >
            <LoadSuspense>
                <Component {...extra} />
            </LoadSuspense>
        </Context>
    );
}

import { lazy, Suspense, useEffect, useState } from "preact/compat";
import { Masks, Preloader } from "@revoltchat/ui";

import Context from "../context";
import { useApi } from "../controllers/client/ClientController";

import localforage from "localforage";

enum ComponentName {
    Friends = "Friends",
    TempChannel = "TempChannel",
    Channels = "Channels",
}

const Register = {
    [ComponentName.Friends]: lazy(() => import("./friends")),
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
            current = sessions.find((item: any) => item.session.user_id === extra.userId);
            console.log('##', sessions, current, extra.userId);
        }

        if (!current) {
            console.log('##authenticate');
            const API = useApi();
            // @ts-ignore-next-line
            const session = await API.post("/users/authenticate", {
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
        <Context beforeHydrate={beforeHydrate}>
            <LoadSuspense>
                <Component {...extra} />
            </LoadSuspense>
        </Context>
    );
}

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
        if (!needHandleAuthenticate) return false;

        const auth: any = await localforage.getItem('auth');
        let current: any = undefined;

        if (auth && typeof auth === 'object') {
            const sessions = Object.values(auth.sessions || {});
            current = sessions.find((item: any) => item.session.user_id === userId);
            console.log('##', sessions, current, userId);
        }

        if (!current) {
            // 清除历史accounts
            await localforage.removeItem("auth");
            // @ts-ignore-next-line
            await clientController.login(undefined, token);

            return true;
        } else {
            const _auth = {
                sessions: {
                    [current.session.user_id]: current,
                }
            };

            // 清除其余accounts
            await localforage.setItem("auth", _auth);
        }

        return false;
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

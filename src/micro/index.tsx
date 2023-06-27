import { lazy, Suspense, useEffect, useState } from "preact/compat";
import { Masks, Preloader } from "@revoltchat/ui";

import Context from "../context";
import { clientController } from "../controllers/client/ClientController";

import localforage from "localforage";
import Auth from "../mobx/stores/Auth";

enum ComponentName {
    Friends = "Friends",
    TempChannel = "TempChannel",
    Channels = "Channel",
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
}) {
    const { exposeComponent = ComponentName.Friends, token, userId, ...extra } = props;
    const Component = Register[exposeComponent];

    const beforeHydrate = async () => {
        const auth: any = await localforage.getItem('auth');

        if (auth && typeof auth === 'object') {
            const sessions = Object.values(auth.sessions || {});
            const current: any = sessions.find((item: any) => item.session.user_id === userId);

            console.log('##', sessions, current, userId);

            if (!current) {
                // 清除历史accounts
                await localforage.removeItem("auth");
                // @ts-ignore-next-line
                await clientController.login(undefined, token);
            } else {
                const _auth = {
                    sessions: {
                        [current.session.user_id]: current,
                    }
                };

                // 清除其余accounts
                await localforage.setItem("auth", _auth);
            }
        }
    };

    return (
        <Context beforeHydrate={beforeHydrate}>
            <LoadSuspense>
                <Component {...extra} />
            </LoadSuspense>
        </Context>
    );
}

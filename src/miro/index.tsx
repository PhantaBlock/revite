import { lazy, Suspense, useEffect, useState } from "preact/compat";
import { Masks, Preloader } from "@revoltchat/ui";

import Context from "../context";
import { clientController, useSession } from "../controllers/client/ClientController";

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

export function MiroApp(props: {
    exposeComponent: ComponentName;
    token: string;
    userId: string;
}) {
    const { exposeComponent = ComponentName.TempChannel, token, userId, ...extra } = props;
    const Component = Register[exposeComponent];

    const beforeHydrate = async () => {
        const auth: any = await localforage.getItem('auth');

        if (auth && typeof auth === 'object') {
            const sessions = Object.keys(auth.sessions || {});
            const current = sessions.find(item => item === userId);

            if (!current) {
                // @ts-ignore-next-line
                await clientController.login(undefined, token);
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

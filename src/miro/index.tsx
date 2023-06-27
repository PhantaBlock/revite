import { lazy, Suspense, useEffect, useState } from "preact/compat";
import { Masks, Preloader } from "@revoltchat/ui";

import Context from "../context";
import { clientController, useSession } from "../controllers/client/ClientController";

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
}) {
    const { exposeComponent = ComponentName.TempChannel, token, ...extra } = props;
    const Component = Register[exposeComponent];
    const [ready, setReady] = useState<boolean>();

    useEffect(() => {
        console.log('##', clientController.isLoggedIn());
        // @ts-ignore-next-line
        clientController.login(undefined, token).then(() => {
        });
    }, [ready]);

    return (
        <Context onReady={() => setReady(true)}>
            <LoadSuspense>
                <Component {...extra} />
            </LoadSuspense>
        </Context>
    );
}

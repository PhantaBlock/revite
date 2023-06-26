import { lazy, Suspense, useEffect } from "preact/compat";
import { Masks, Preloader } from "@revoltchat/ui";

import Context from "../context";
import { clientController } from "../controllers/client/ClientController";

enum ComponentName {
    Friends = "Friends",
    TempChannel = "tempChannel",
}

const Register = {
    [ComponentName.Friends]: lazy(() => import("../pages/friends/Friends")),
    [ComponentName.TempChannel]: lazy(() => import("./tempChannel")),
};

const LoadSuspense: React.FC = ({ children }) => (
    // @ts-expect-error Typing issue between Preact and Preact.
    <Suspense fallback={<Preloader type="ring" />}>{children}</Suspense>
);

export function MiroApp({ exposeComponent = ComponentName.Friends, token }: {
    exposeComponent: ComponentName;
    token: string;
}) {
    const Component = Register[exposeComponent];

    useEffect(() => {
        // @ts-ignore-next-line
        clientController.login(undefined, token);
    }, []);

    return (
        <Context>
            <LoadSuspense>
                <Component />
            </LoadSuspense>
        </Context>
    );
}

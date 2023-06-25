import { lazy, Suspense } from "preact/compat";
import { Masks, Preloader } from "@revoltchat/ui";

import Context from "../context";

enum ComponentName {
    Friends = "Friends",
}

const Register = {
    [ComponentName.Friends]: lazy(() => import("../pages/friends/Friends")),
};

const LoadSuspense: React.FC = ({ children }) => (
    // @ts-expect-error Typing issue between Preact and Preact.
    <Suspense fallback={<Preloader type="ring" />}>{children}</Suspense>
);

export function MiroApp({ exposeComponent = ComponentName.Friends }: {
    exposeComponent: ComponentName
}) {
    const Component = Register[exposeComponent];

    return (
        <Context>
            <LoadSuspense>
                <Component />
            </LoadSuspense>
        </Context>
    );
}

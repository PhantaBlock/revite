import { lazy, Suspense } from "preact/compat";
import { Masks, Preloader } from "@revoltchat/ui";

import Context from "../context";

const Friends = lazy(() => import("../pages/friends/Friends"));

const LoadSuspense: React.FC = ({ children }) => (
    // @ts-expect-error Typing issue between Preact and Preact.
    <Suspense fallback={<Preloader type="ring" />}>{children}</Suspense>
);

export function MiroApp() {
    return (
        <Context>
            <LoadSuspense>
                <Friends />
            </LoadSuspense>
        </Context>
    );
}

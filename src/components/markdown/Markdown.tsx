import { Suspense, lazy } from "preact/compat";
import MessageCard from "../messageCard";

const Renderer = lazy(() => import("./RemarkRenderer"));

export interface MarkdownProps {
    content: string;
    disallowBigEmoji?: boolean;
    author?: any;
}

export default function Markdown(props: MarkdownProps) {
    if (!props.content) return null;

    const regex = /##([^#]+)##([^]+)/;
    const res = props.content.match(regex);

    if (res) {
        return <MessageCard type={res[1]} message={res[2]} author={props.author} />;
    }

    return (
        // @ts-expect-error Typings mis-match.
        <Suspense fallback={props.content}>
            <Renderer {...props} />
        </Suspense>
    );
}

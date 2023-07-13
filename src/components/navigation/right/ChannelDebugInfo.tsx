/* eslint-disable react-hooks/rules-of-hooks */
import { observer } from "mobx-react-lite";
import { Channel } from "revolt.js";

import { getRenderer } from "../../../lib/renderer/Singleton";
import { IconButton } from "../../../components/revoltchat";
import { remTorem, pxTorem, numTonum } from '../../../lib/calculation';

interface Props {
    channel: Channel;
}

export const ChannelDebugInfo = observer(({ channel }: Props) => {
    if (process.env.NODE_ENV !== "development") return null;
    const renderer = getRenderer(channel);

    return (
        <span style={{ display: "block", padding: `${pxTorem(12)} ${pxTorem(10)} 0 ${pxTorem(10)}` }}>
            <span
                style={{
                    display: "block",
                    fontSize: `${pxTorem(12)}`,
                    textTransform: "uppercase",
                    fontWeight: "600",
                }}>
                Channel Info
            </span>
            <p style={{ fontSize: `${pxTorem(10)}`, userSelect: "text" }}>
                State: <b>{renderer.state}</b> <br />
                Stale: <b>{renderer.stale ? "Yes" : "No"}</b> <br />
                Fetching: <b>{renderer.fetching ? "Yes" : "No"}</b> <br />
                <br />
                {renderer.state === "RENDER" && renderer.messages.length > 0 && (
                    <>
                        Start: <b>{renderer.messages[0]._id}</b> <br />
                        End:{" "}
                        <b>
                            {
                                renderer.messages[renderer.messages.length - 1]
                                    ._id
                            }
                        </b>{" "}
                        <br />
                        At Top: <b>{renderer.atTop ? "Yes" : "No"}</b> <br />
                        At Bottom: <b>{renderer.atBottom ? "Yes" : "No"}</b>
                    </>
                )}
            </p>
        </span>
    );
});

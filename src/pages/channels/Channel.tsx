import { Hash } from "@styled-icons/boxicons-regular";
import { Ghost } from "@styled-icons/boxicons-solid";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { Redirect, useParams } from "react-router-dom";
import { Channel as ChannelI } from "revolt.js";
import styled, { css } from "styled-components/macro";

import { Text } from "preact-i18n";
import { useEffect, useState } from "preact/hooks";

import ErrorBoundary from "../../lib/ErrorBoundary";
import { internalSubscribe } from "../../lib/eventEmitter";
import { isTouchscreenDevice } from "../../lib/isTouchscreenDevice";

import { useApplicationState } from "../../mobx/State";
import { SIDEBAR_MEMBERS } from "../../mobx/stores/Layout";

import AgeGate from "../../components/common/AgeGate";
import MessageBox from "../../components/common/messaging/MessageBox";
import JumpToBottom from "../../components/common/messaging/bars/JumpToBottom";
import NewMessages from "../../components/common/messaging/bars/NewMessages";
import TypingIndicator from "../../components/common/messaging/bars/TypingIndicator";
import RightSidebar from "../../components/navigation/RightSidebar";
import { PageHeader } from "../../components/ui/Header";
import { useClient } from "../../controllers/client/ClientController";
import ChannelHeader from "./ChannelHeader";
import { MessageArea } from "./messaging/MessageArea";
import VoiceHeader from "./voice/VoiceHeader";
import { isMicroMode } from "../../lib/global";


const ChannelMain = styled.div.attrs({ "data-component": "channel" })`
    flex-grow: 1;
    display: flex;
    min-height: 0;
    overflow: hidden;
    flex-direction: row;
    width: 100%;
    height: 100%;
`;

const ChannelContent = styled.div.attrs({
    "data-component": "content",
}) <{ isMicro?: boolean }>`
    flex-grow: 1;
    display: flex;
    overflow: hidden;
    flex-direction: column;

    ${(props) =>
        props.isMicro &&
        css`
            background: transparent !important;
            padding-top: 8.2815rem;
            box-sizing: border-box;
        `
    }

`;

const PlaceholderBase = styled.div`
    @keyframes floating {
        0% {
            transform: translate(0, 0px);
        }
        50% {
            transform: translate(0, 15px);
        }
        100% {
            transform: translate(0, -0px);
        }
    }

    flex-grow: 1;
    display: flex;
    overflow: hidden;
    flex-direction: column;

    .floating {
        animation-name: floating;
        animation-duration: 3s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
    }

    .placeholder {
        justify-content: center;
        text-align: center;
        margin: auto;
        padding: 12px;

        .primary {
            color: var(--secondary-foreground);
            font-weight: 700;
            font-size: 22px;
            margin: 0 0 5px 0;
        }

        .secondary {
            color: var(--tertiary-foreground);
            font-weight: 400;
        }

        svg {
            margin: 2em auto;
            fill-opacity: 0.8;
        }
    }
`;

export const Channel = observer(
    ({ id, server_id }: { id: string; server_id: string }) => {
        const isMicro = isMicroMode();
        const client = useClient();
        const state = useApplicationState();
        const exist = client.channels.exists(id);
        const channel = client.channels.get(id);

        if (!exist && !channel) {
            if (isMicro) {
                return <ChannelPlaceholder />;
            }

            if (server_id) {
                const server = client.servers.get(server_id);
                if (server && server.channel_ids.length > 0) {
                    let target_id = server.channel_ids[0];
                    const last_id = state.layout.getLastOpened(server_id);
                    if (last_id) {
                        if (client.channels.has(last_id)) {
                            target_id = last_id;
                        }
                    }

                    return (
                        <Redirect
                            to={`/server/${server_id}/channel/${target_id}`}
                        />
                    );
                }
            } else {
                return <Redirect to="/" />;
            }

            return <ChannelPlaceholder />;
        }

        if (channel?.channel_type === "VoiceChannel" && !isMicro) {
            return <VoiceChannel channel={channel} />;
        }

        return <TextChannel channel={channel} />;
    },
);

export const TextChannel = observer(({ channel, tempMode }: { channel: ChannelI, tempMode?: boolean }) => {
    const layout = useApplicationState().layout;
    const isMicro = isMicroMode();

    // Store unread location.
    const [lastId, setLastId] = useState<string | undefined>(undefined);

    useEffect(
        () =>
            internalSubscribe("NewMessages", "hide", () =>
                setLastId(undefined),
            ),
        [],
    );

    useEffect(
        () => internalSubscribe("NewMessages", "mark", setLastId as any),
        [],
    );

    // Mark channel as read.
    useEffect(() => {
        setLastId(
            (channel.unread
                ? channel.client.unreads?.getUnread(channel._id)?.last_id
                : undefined) ?? undefined,
        );

        const checkUnread = () =>
            channel.unread &&
            channel.client.unreads!.markRead(
                channel._id,
                channel.last_message_id!,
                true,
            );

        checkUnread();
        return reaction(
            () => channel.last_message_id,
            () => checkUnread(),
        );
    }, [channel]);
    return (
        <AgeGate
            type="channel"
            channel={channel}
            gated={
                !!(
                    (channel.channel_type === "TextChannel" ||
                        channel.channel_type === "Group") &&
                    channel.nsfw
                )
            }>
            {!tempMode && <ChannelHeader channel={channel} />}
            <ChannelMain>
                <ErrorBoundary section="renderer">
                    <ChannelContent isMicro={isMicro}>
                        <VoiceHeader id={channel._id} />
                        {!isMicro && <NewMessages channel={channel} last_id={lastId} />}
                        <MessageArea channel={channel} last_id={lastId} tempMode={tempMode!} />
                        <TypingIndicator channel={channel} />
                        <JumpToBottom channel={channel} />
                        <MessageBox channel={channel} tempMode={tempMode!} />
                    </ChannelContent>
                </ErrorBoundary>
                {!isTouchscreenDevice && !tempMode &&
                    layout.getSectionState(SIDEBAR_MEMBERS, true) && (
                        <RightSidebar />
                    )}
            </ChannelMain>
        </AgeGate>
    );
});

function VoiceChannel({ channel }: { channel: ChannelI }) {
    return (
        <>
            <ChannelHeader channel={channel} />
            <VoiceHeader id={channel._id} />
        </>
    );
}

function ChannelPlaceholder() {
    return (
        <PlaceholderBase>
            <PageHeader icon={<Hash size={24} isMicro={isMicroMode()} />}>
                <span className="name">
                    <Text id="app.main.channel.errors.nochannel" />
                </span>
            </PageHeader>

            <div className="placeholder">
                <div className="floating">
                    <Ghost width={80} />
                </div>
                <div className="primary">
                    <Text id="app.main.channel.errors.title" />
                </div>
                <div className="secondary">
                    <Text id="app.main.channel.errors.nochannels" />
                </div>
            </div>
        </PlaceholderBase>
    );
}

export default function ChannelComponent() {
    const { channel, server } =
        useParams<{ channel: string; server: string }>();

    return <Channel id={channel} server_id={server} key={channel} />;
}

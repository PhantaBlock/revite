import { At, Hash } from "@styled-icons/boxicons-regular";
import { Notepad, Group } from "@styled-icons/boxicons-solid";
import { observer } from "mobx-react-lite";
import { Channel, User } from "revolt.js";
import styled, { css } from "styled-components/macro";

import { isTouchscreenDevice } from "../../lib/isTouchscreenDevice";

import { useStatusColour } from "../../components/common/user/UserIcon";
import UserStatus from "../../components/common/user/UserStatus";
import Markdown from "../../components/markdown/Markdown";
import { PageHeader } from "../../components/ui/Header";
import ChannelIcon from "../../components/common/ChannelIcon";
import { ChannelName } from "../../controllers/client/jsx/ChannelName";
import { modalController } from "../../controllers/modals/ModalController";
import HeaderActions from "./actions/HeaderActions";
import { pxTorem } from '../../lib/calculation';
import { isMicroMode, openMicroChannelPage } from "../../lib/global";

export interface ChannelHeaderProps {
    channel: Channel;
    toggleSidebar?: () => void;
    toggleChannelSidebar?: () => void;
}

const Info = styled.div<{ isMicro?: boolean }>`
    flex-grow: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;

    display: flex;
    gap: var(--avatar-username-gap);
    align-items: center;

    * {
        display: inline-block;
    }

    .divider {
        height: 20px;
        margin: 0 5px;
        padding-left: 1px;
        background-color: var(--tertiary-background);
    }

    .status {
        width: 10px;
        height: 10px;
        display: inline-block;
        margin-inline-end: 6px;
        border-radius: var(--border-radius-half);
    }

    .desc {
        cursor: pointer;
        margin-top: 2px;
        font-size: 0.8em;
        font-weight: 400;
        color: var(--secondary-foreground);

        > * {
            pointer-events: none;
        }
    }
`;

const Info1 = styled.div`
    flex-grow: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;

    display: flex;
    gap: var(--avatar-username-gap);
    align-items: center;

    * {
        display: inline-block;
    }

    .divider {
        height: ${pxTorem(20)};
        margin: 0  ${pxTorem(5)};
        padding-left: ${pxTorem(1)};
        background-color: var(--tertiary-background);
    }
    .name {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        font-size: ${pxTorem(22)};
    }
    .header_status {
        margin-left: ${pxTorem(6)};
        width:  ${pxTorem(8.5)};
        height:  ${pxTorem(8.5)};
        display: inline-block;
        margin-inline-end:  ${pxTorem(6)};
        border-radius: var(--border-radius-half);
    }

    .desc {
        cursor: pointer;
        margin-top: ${pxTorem(2)};
        font-size: ${pxTorem(17)};
        font-weight: 400;
        color: var(--secondary-foreground);

        > * {
            pointer-events: none;
        }
    }
`;

const ImageWrap = styled.div`
    display: flex;
    flexShrink: 0;
    width: 4rem;
    height: 4rem;

    img {
        width: 100%;
        height: 100%;
    }
    margin-left: ${pxTorem(20)};
    margin-right: ${pxTorem(20)};
`

export default observer(({ channel }: ChannelHeaderProps) => {
    let icon, recipient: User | undefined;
    const isMicro = isMicroMode();
    switch (channel.channel_type) {
        case "SavedMessages":
            icon = <Notepad size={24} />;
            break;
        case "DirectMessage":
            icon = <At size={24} />;
            recipient = channel.recipient;
            break;
        case "Group":
            icon = <Group size={24} />;
            break;
        case "TextChannel":
            icon = <Hash size={24} />;
            break;
    }

    return (
        <PageHeader icon={icon} withTransparency height={isMicro ? pxTorem(132.5) : ''} isMicro={isMicro}>
            {!isMicro ? <Info>
                <span className="name">
                    <ChannelName channel={channel} />
                </span>
                {isTouchscreenDevice &&
                    channel.channel_type === "DirectMessage" && (
                        <>
                            <div className="divider" />
                            <span className="desc">
                                <div
                                    className="status"
                                    style={{
                                        backgroundColor:
                                            useStatusColour(recipient),
                                    }}
                                />
                                <UserStatus user={recipient} />
                            </span>
                        </>
                    )}
                {!isTouchscreenDevice &&
                    (channel.channel_type === "Group" ||
                        channel.channel_type === "TextChannel") &&
                    channel.description && (
                        <>
                            <div className="divider" />
                            <span
                                className="desc"
                                onClick={() =>
                                    modalController.push({
                                        type: "channel_info",
                                        channel,
                                    })
                                }>
                                <Markdown
                                    content={
                                        channel.description.split("\n")[0] ?? ""
                                    }
                                    disallowBigEmoji
                                />
                            </span>
                        </>
                    )}
            </Info> : <Info1 >
                <ImageWrap >
                    <ChannelIcon target={channel} size={60} />
                </ImageWrap>
                <div className="name">
                    <ChannelName channel={channel} />
                    {!isTouchscreenDevice &&
                        channel.channel_type === "DirectMessage" && (
                            <>
                                {/* <div className="divider" /> */}
                                <span className="desc">
                                    <UserStatus user={recipient} />
                                    <div
                                        className="header_status"
                                        style={{
                                            backgroundColor:
                                                useStatusColour(recipient),
                                        }}
                                    />
                                </span>
                            </>
                        )}
                </div>
                {!isTouchscreenDevice &&
                    (channel.channel_type === "Group" ||
                        channel.channel_type === "TextChannel") &&
                    channel.description && (
                        <>
                            <div className="divider" />
                            <span
                                className="desc"
                                onClick={() =>
                                    modalController.push({
                                        type: "channel_info",
                                        channel,
                                    })
                                }>
                                <Markdown
                                    content={
                                        channel.description.split("\n")[0] ?? ""
                                    }
                                    disallowBigEmoji
                                />
                            </span>
                        </>
                    )}
            </Info1>}
            <HeaderActions channel={channel} />
        </PageHeader >
    );
});

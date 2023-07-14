import { At, Hash } from "@styled-icons/boxicons-regular";
import { Notepad, Group } from "@styled-icons/boxicons-solid";
import { observer } from "mobx-react-lite";
import { Channel, User } from "revolt.js";
import styled from "styled-components/macro";

import { isTouchscreenDevice } from "../../lib/isTouchscreenDevice";
import { remTorem, pxTorem, numTonum } from '../../lib/calculation';

import { useStatusColour } from "../../components/common/user/UserIcon";
import UserStatus from "../../components/common/user/UserStatus";
import Markdown from "../../components/markdown/Markdown";
import { PageHeader } from "../../components/ui/Header";
import ChannelIcon from "../../components/common/ChannelIcon";
import { ChannelName } from "../../controllers/client/jsx/ChannelName";
import { modalController } from "../../controllers/modals/ModalController";
import HeaderActions from "./actions/HeaderActions";

export interface ChannelHeaderProps {
    channel: Channel;
    toggleSidebar?: () => void;
    toggleChannelSidebar?: () => void;
}

const Info = styled.div`
    flex-grow: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;

    display: flex;
    gap: ${pxTorem(22.5)};
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
        align-items: center;
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

export default observer(({ channel }: ChannelHeaderProps) => {
    let icon, recipient: User | undefined;
    switch (channel.channel_type) {
        case "SavedMessages":
            icon = <Notepad size={numTonum(24)} />;
            break;
        case "DirectMessage":
            icon = <At size={numTonum(24)} />;
            recipient = channel.recipient;
            break;
        case "Group":
            icon = <Group size={numTonum(24)} />;
            break;
        case "TextChannel":
            icon = <Hash size={numTonum(24)} />;
            break;
    }

    return (
        <PageHeader icon={icon} withTransparency>
            <Info>
                <div style={{
                    display: 'flex',
                    flexShrink: 0,
                    width: '5rem',
                    height: '5rem',
                }}>
                    <ChannelIcon target={channel} size={true ? 24 : 60} />
                </div>
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
            </Info>
            <HeaderActions channel={channel} />
        </PageHeader>
    );
});

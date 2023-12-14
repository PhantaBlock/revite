import { X } from "@styled-icons/boxicons-regular";
import { Crown } from "@styled-icons/boxicons-solid";
import { observer } from "mobx-react-lite";
import { User, Channel } from "revolt.js";

import styles from "./Item.module.scss";
import classNames from "classnames";
import { useTriggerEvents } from "preact-context-menu";
import { Localizer, Text } from "preact-i18n";
import { Redirect, useParams, useLocation } from "react-router-dom";

import { isTouchscreenDevice } from "../../../lib/isTouchscreenDevice";
import { stopPropagation } from "../../../lib/stopPropagation";

import { modalController } from "../../../controllers/modals/ModalController";
import ChannelIcon from "../../common/ChannelIcon";
import Tooltip from "../../common/Tooltip";
import UserIcon from "../../common/user/UserIcon";
import { Username } from "../../common/user/UserShort";
import UserStatus from "../../common/user/UserStatus";
import { IconButton } from "../../../components/revoltchat";
import { isMicroMode } from "../../../lib/global";
import { officialChannelId } from "../../../skyConstant";

type CommonProps = Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    "children" | "as"
> & {
    active?: boolean;
    alert?: "unread" | "mention";
    alertCount?: number;
    margin?: boolean;
    muted?: boolean;
};

interface UserWithVIP extends User {
    vip?: {
        term_type?: number;
        level_type?: number;
    };
}

type UserProps = CommonProps & {
    user: UserWithVIP;
    context?: Channel;
    channel?: Channel;
    rightSidebar?: boolean;
    pathname?: any;
};

// TODO: Gray out blocked names.
export const UserButton = observer((props: UserProps) => {
    const {
        active,
        alert,
        margin,
        alertCount,
        user,
        context,
        channel,
        rightSidebar,
        pathname,
        ...divProps
    } = props;
    const isMicro = isMicroMode();

    const menu = isMicro ? {} : {
        ...useTriggerEvents("Menu", {
            user: user._id,
            channel: channel?._id,
            unread: alert,
            contextualChannel: context?._id,
        })
    }

    const { term_type = 0, level_type = 0 } = user?.vip || {};
    const isVIP = level_type === 1;
    const VIPConfig = isVIP ? window.__VIP_CONFIG_MAP__?.[term_type] : undefined;

    return (
        <div
            {...divProps}
            className={classNames(styles.item, styles.user, {
                [styles.isMicro]: isMicro,
                [styles.rightSidebar]: isMicro && rightSidebar,
                [styles.isCurrent]: pathname?.includes(channel?._id)
            })}
            data-active={active}
            data-margin={margin}
            data-alert={typeof alert === "string"}
            data-online={
                typeof channel !== "undefined" ||
                (user.online && user.status?.presence !== "Invisible")
            }
            {...menu}>
            <UserIcon
                className={styles.avatar}
                target={user}
                size={isMicro ? '3.75rem' : 32}
                status
                showServerIdentity
            />
            <div className={styles.name}>
                <div
                    className={classNames(styles.nameWrap, {
                        [styles.isVIP]: isVIP,
                    })}
                >
                    {!!VIPConfig && <div className={styles.vipTag} style={{ backgroundImage: `url(${VIPConfig.icon})` }} />}
                    <Username user={user} showServerIdentity />
                </div>
                {
                    <div className={styles.subText}>
                        {typeof channel?.last_message?.content === "string" &&
                            alert ? (
                            channel.last_message.content.slice(0, 32)
                        ) : (
                            <UserStatus user={user} tooltip />
                        )}
                    </div>
                }
            </div>
            <div className={styles.button}>
                {context?.channel_type === "Group" &&
                    context.owner_id === user._id && (
                        <Localizer>
                            <Tooltip
                                content={<Text id="app.main.groups.owner" />}>
                                <Crown size={20} />
                            </Tooltip>
                        </Localizer>
                    )}
                {alert && (
                    <div className={styles.alert} data-style={alert}>
                        {alertCount}
                    </div>
                )}
                {!isTouchscreenDevice && channel && (
                    <IconButton
                        className={styles.icon}
                        onClick={(e) =>
                            stopPropagation(e) &&
                            modalController.push({
                                type: "close_dm",
                                target: channel,
                            })
                        }>
                        <X size={24} />
                    </IconButton>
                )}
            </div>
        </div>
    );
});

type ChannelProps = CommonProps & {
    channel: Channel;
    user?: User;
    compact?: boolean;
    rightSidebar?: boolean;
};

export const ChannelButton = observer((props: ChannelProps) => {
    const {
        active,
        alert,
        alertCount,
        channel,
        user,
        compact,
        muted,
        rightSidebar,
        ...divProps
    } = props;

    const { pathname } = useLocation();

    if (channel.channel_type === "SavedMessages") throw "Invalid channel type.";
    if (channel.channel_type === "DirectMessage") {
        if (typeof user === "undefined") throw "No user provided.";
        return <UserButton {...{ active, alert, channel, user, rightSidebar, pathname }} />;
    }

    const alerting = alert && !muted && !active;

    return (
        <div
            {...divProps}
            data-active={active}
            data-alert={alerting}
            data-muted={muted}
            aria-label={channel.name}
            className={classNames(styles.item, {
                [styles.compact]: compact,
                [styles.isMicro]: isMicroMode(),
                [styles.isCurrent]: pathname.includes(channel._id)
            })}
            {...useTriggerEvents("Menu", {
                channel: channel._id,
                unread: !!alert,
            })}>
            <div className={styles.avatar}>
                <ChannelIcon target={channel} size={compact ? 24 : 60} />
            </div>
            <div className={styles.name}>
                <div>{channel.name}</div>
                {channel.channel_type === "Group" && (
                    <div className={styles.subText}>
                        {typeof channel.last_message?.content === "string" &&
                            alert &&
                            !muted ? (
                            channel.last_message.content.slice(0, 32)
                        ) : (
                            <Text
                                id="quantities.members"
                                plural={channel.recipients!.length}
                                fields={{
                                    count: channel.recipients!.length,
                                }}
                            />
                        )}
                    </div>
                )}
            </div>
            <div className={styles.button}>
                {alerting && (
                    <div className={styles.alert} data-style={alert}>
                        {alertCount}
                    </div>
                )}
                {!isTouchscreenDevice
                    && channel.channel_type === "Group"
                    && channel._id !== officialChannelId
                    && (
                        <IconButton
                            className={styles.icon}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                modalController.push({
                                    type: "leave_group",
                                    target: channel,
                                })
                            }}>
                            <X size={24} />
                        </IconButton>
                    )}
            </div>
        </div>
    );
});

type ButtonProps = CommonProps & {
    onClick?: () => void;
    children?: Children;
    className?: string;
    compact?: boolean;
};

export default function ButtonItem(props: ButtonProps) {
    const {
        active,
        alert,
        alertCount,
        onClick,
        className,
        children,
        compact,
        ...divProps
    } = props;

    return (
        <div
            {...divProps}
            className={classNames(
                styles.item,
                { [styles.compact]: compact, [styles.normal]: !compact, [styles.isMicro]: isMicroMode() },
                className,
            )}
            onClick={onClick}
            data-active={active}
            data-alert={typeof alert === "string"}>
            <div className={styles.content}>{children}</div>
            {alert && (
                <div className={styles.alert} data-style={alert}>
                    {alertCount}
                </div>
            )}
        </div>
    );
}

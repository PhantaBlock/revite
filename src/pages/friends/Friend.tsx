import { X, Plus } from "@styled-icons/boxicons-regular";
import { PhoneCall, Envelope, UserX } from "@styled-icons/boxicons-solid";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import { User } from "revolt.js";

import styles from "./Friend.module.scss";
import classNames from "classnames";
import { useTriggerEvents } from "preact-context-menu";
import { Text } from "preact-i18n";

import { IconButton } from "../../components/revoltchat";

import { stopPropagation } from "../../lib/stopPropagation";
import { voiceState } from "../../lib/vortex/VoiceState";

import UserIcon from "../../components/common/user/UserIcon";
import UserStatus from "../../components/common/user/UserStatus";
import { modalController } from "../../controllers/modals/ModalController";

import { isMicroMode, openMicroChannelPage } from "../../lib/global";

interface Props {
    user: User;
    onInviteFriend?: () => void;
    pendingMode?: boolean;
}

export const Friend = observer(({ user, onInviteFriend, pendingMode }: Props) => {
    const isMicro = isMicroMode();
    const history = useHistory();

    const actions: Children[] = [];
    let subtext: Children = null;

    if (user.relationship === "Friend") {
        subtext = <UserStatus user={user} />;

        if (isMicro) {
            actions.push(
                <img src="https://skyvs.oss-cn-hangzhou.aliyuncs.com/resources/images/message.png" alt="" className={styles.message} />
            )
            if (user.online) {
                actions.push(
                    <IconButton
                        shape="circle"
                        className={classNames(styles.button, styles.inviteButton)}
                        onClick={(ev) => {
                            stopPropagation(ev);
                            onInviteFriend && onInviteFriend();
                        }}
                    >
                        邀请
                    </IconButton>
                );
            }
        } else {
            actions.push(
                <>
                    <IconButton
                        shape="circle"
                        className={classNames(styles.button, styles.success)}
                        onClick={(ev) =>
                            stopPropagation(
                                ev,
                                user
                                    .openDM()
                                    .then(voiceState.connect)
                                    .then((x) => {
                                        history.push(`/channel/${x._id}`);
                                    }),
                            )
                        }>
                        <PhoneCall size={20} />
                    </IconButton>
                    <IconButton
                        shape="circle"
                        className={styles.button}
                        onClick={(ev) =>
                            stopPropagation(
                                ev,
                                user
                                    .openDM()
                                    .then((channel) => history.push(`/channel/${channel._id}`)),
                            )
                        }>
                        <Envelope size={20} />
                    </IconButton>
                </>,
            );
        }
    }

    if (user.relationship === "Incoming") {
        if (isMicro) {
            actions.push(
                <div
                    key="pass"
                    className={styles.passBtn}
                    onClick={(ev) => stopPropagation(ev, user.addFriend())}
                >
                    <span>通过</span>
                </div>
            );
        } else {
            actions.push(
                <IconButton
                    shape="circle"
                    className={styles.button}
                    onClick={(ev) => stopPropagation(ev, user.addFriend())}>
                    <Plus size={24} />
                </IconButton>,
            );
        }

        subtext = <Text id="app.special.friends.incoming" />;
    }

    if (user.relationship === "Outgoing") {
        subtext = <Text id="app.special.friends.outgoing" />;
    }

    if (
        (user.relationship === "Friend" ||
            user.relationship === "Outgoing" ||
            user.relationship === "Incoming") && !isMicro
    ) {
        actions.push(
            <IconButton
                shape="circle"
                className={classNames(
                    styles.button,
                    styles.remove,
                    styles.error,
                )}
                onClick={(ev) =>
                    stopPropagation(
                        ev,
                        user.relationship === "Friend"
                            ? modalController.push({
                                type: "unfriend_user",
                                target: user,
                            })
                            : user.removeFriend(),
                    )
                }>
                <X size={24} />
            </IconButton>,
        );
    }

    if (isMicro && user.relationship === "Incoming") {
        actions.push(
            <div
                key="reject"
                className={classNames(styles.rejectBtn, "cusLineation")}
                onClick={(ev) =>
                    stopPropagation(
                        ev,
                        user.relationship === "Friend"
                            ? modalController.push({
                                type: "unfriend_user",
                                target: user,
                            })
                            : user.removeFriend(),
                    )
                }
            >
                拒绝
            </div>
        );
    }

    if (user.relationship === "Blocked") {
        actions.push(
            <IconButton
                shape="circle"
                className={classNames(styles.button, styles.error)}
                onClick={(ev) => stopPropagation(ev, user.unblockUser())}>
                <UserX size={24} />
            </IconButton>,
        );
    }

    const menu = pendingMode ? {} : useTriggerEvents("Menu", {
        user: user._id,
    });

    return (
        <div
            className={classNames(styles.friend, {
                [styles.isMicro]: isMicro,
            })}
            onClick={() => {
                if (isMicro) {
                    user
                        .openDM()
                        .then((channel) => {
                            openMicroChannelPage(`/channel/${channel._id}`);
                        });
                } else {
                    modalController.push({
                        type: "user_profile",
                        user_id: user._id,
                    })
                }
            }}
            {...menu}>
            <UserIcon target={user} size={36} status />
            <div className={styles.name}>
                <span>{user.display_name ?? user.username}</span>
                {subtext && <span className={styles.subtext}>{subtext}</span>}
            </div>
            <div className={styles.actions}>{actions}</div>
        </div>
    );
});

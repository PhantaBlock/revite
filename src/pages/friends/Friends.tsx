import { ChevronRight } from "@styled-icons/boxicons-regular";
import { UserDetail, MessageAdd, UserPlus } from "@styled-icons/boxicons-solid";
import { observer } from "mobx-react-lite";
import { User } from "revolt.js";

import styles from "./Friend.module.scss";
import classNames from "classnames";
import { Text } from "preact-i18n";

import { IconButton } from "../../components/revoltchat";

import { TextReact } from "../../lib/i18n";
import { isTouchscreenDevice } from "../../lib/isTouchscreenDevice";

import CollapsibleSection from "../../components/common/CollapsibleSection";
import Tooltip from "../../components/common/Tooltip";
import UserIcon from "../../components/common/user/UserIcon";
import { PageHeader } from "../../components/ui/Header";
import { useClient } from "../../controllers/client/ClientController";
import { modalController } from "../../controllers/modals/ModalController";
import { Friend } from "./Friend";

import { isMicroMode, openMicroChannelPage } from "../../lib/global";

export default observer(({ onInviteFriend }: {
    onInviteFriend: (userId: string) => void;
}) => {
    const isMicro = isMicroMode();
    const client = useClient();
    const users = [...client.users.values()];
    users.sort((a, b) => a.username.localeCompare(b.username));

    const friends = users.filter((x) => x.relationship === "Friend");

    const lists = [
        ["", users.filter((x) => x.relationship === "Incoming")],
        [
            "app.special.friends.sent",
            users.filter((x) => x.relationship === "Outgoing"),
            "outgoing",
        ],
        [
            "app.status.online",
            friends.filter(
                (x) => x.online && x.status?.presence !== "Invisible",
            ),
            "online",
        ],
        [
            "app.status.offline",
            friends.filter(
                (x) => !x.online || x.status?.presence === "Invisible",
            ),
            "offline",
        ],
        [
            "app.special.friends.blocked",
            users.filter((x) => x.relationship === "Blocked"),
            "blocked",
        ],
    ] as [string, User[], string][];

    const incoming = lists[0][1];
    const userlist: Children[] = incoming.map((x) => (
        <b key={x._id}>{x.username}</b>
    ));
    for (let i = incoming.length - 1; i > 0; i--) userlist.splice(i, 0, ", ");

    const isEmpty = lists.reduce((p: number, n) => p + n.length, 0) === 0;

    const renderHeaderActions = () => {
        return (
            <div className={styles.actions}>
                {/*<Tooltip content={"Create Category"} placement="bottom">
                            <IconButton onClick={() => openScreen({ id: 'special_input', type: 'create_group' })}>
                                <ListPlus size={28} />
                            </IconButton>
                        </Tooltip>
                        <div className={styles.divider} />*/}
                <Tooltip content={"创建群组"} placement="bottom">
                    <IconButton
                        onClick={() =>
                            modalController.push({
                                type: "create_group",
                            })
                        }>
                        <MessageAdd size={24} />
                    </IconButton>
                </Tooltip>
                <Tooltip content={"添加好友"} placement="bottom">
                    <IconButton
                        onClick={() =>
                            modalController.push({
                                type: "add_friend",
                            })
                        }>
                        <UserPlus size={27} />
                    </IconButton>
                </Tooltip>
                {/*
                    <div className={styles.divider} />
                    <Tooltip content={"Friend Activity"} placement="bottom">
                        <IconButton>
                            <TennisBall size={24} />
                        </IconButton>
                    </Tooltip>
                    */}
            </div>
        );
    };

    return (
        <>
            {isMicro ? (
                <div className={styles.add_firendWrap}>
                    <div onClick={() => {
                        openMicroChannelPage();
                    }}>
                        <img src="https://img.war6sky.com/resources/images/channel.png" alt="" className={styles.goGroup} />
                    </div>
                    <div
                        className={classNames(styles.add_firend, {
                        })}
                        onClick={() =>
                            modalController.push({
                                type: "add_friend",
                            })
                        }>+ 添加好友</div>
                </div>
            ) : (
                <PageHeader
                    icon={<UserDetail size={24} />}
                    withTransparency
                    noBurger>
                    <div className={styles.title}>
                        <Text id="app.navigation.tabs.friends" />
                    </div>
                    {renderHeaderActions()}
                </PageHeader>
            )}
            <div data-scroll-offset="true" data-avoids-navigation="true">
                <div
                    className={classNames(styles.list, {
                        'with-padding': !isMicro,
                        [styles.isMicro]: isMicro,
                    })}
                    data-empty={isEmpty}
                    data-mobile={isTouchscreenDevice}>
                    {isEmpty && (
                        <>
                            <img src="https://img.insrt.uk/xexu7/XOPoBUTI47.png/raw" />
                            <Text id="app.special.friends.nobody" />
                        </>
                    )}

                    {incoming.length > 0 && (
                        <div
                            className={styles.pending}
                            onClick={() =>
                                modalController.push({
                                    type: "pending_friend_requests",
                                    users: incoming,
                                })
                            }>
                            <div className={styles.avatars}>
                                {incoming.map(
                                    (x, i) =>
                                        i < 3 && (
                                            <UserIcon
                                                target={x}
                                                size={32}
                                                mask={
                                                    i <
                                                        Math.min(
                                                            incoming.length - 1,
                                                            2,
                                                        )
                                                        ? "url(#overlap)"
                                                        : undefined
                                                }
                                            />
                                        ),
                                )}
                            </div>
                            <div className={styles.details}>
                                <div className={classNames({ [styles.paddingDetails]: isMicro })}>
                                    <Text id="app.special.friends.pending" />
                                    {!isMicro && <span>{incoming.length}</span>}
                                </div>
                                <span className={styles.subTitle}>
                                    {incoming.length > 3 ? (
                                        <TextReact
                                            id="app.special.friends.from.several"
                                            fields={{
                                                userlist: userlist.slice(0, 6),
                                                count: incoming.length - 3,
                                            }}
                                        />
                                    ) : incoming.length > 1 ? (
                                        <TextReact
                                            id="app.special.friends.from.multiple"
                                            fields={{
                                                user: userlist.shift()!,
                                                userlist: userlist.slice(1),
                                            }}
                                        />
                                    ) : (
                                        <TextReact
                                            id="app.special.friends.from.single"
                                            fields={{ user: userlist[0] }}
                                        />
                                    )}
                                </span>
                            </div>
                            {isMicro ? (
                                <div className={styles.incomingNum}>{incoming.length}</div>
                            ) : (
                                <ChevronRight size={28} />
                            )}
                        </div>
                    )}

                    {lists.map(([i18n, list, section_id], index) => {
                        if (index === 0) return;
                        if (list.length === 0) return;

                        return (
                            <CollapsibleSection
                                key={section_id}
                                id={`friends_${section_id}`}
                                defaultValue={true}
                                sticky
                                large
                                summary={
                                    <div className="title title1">
                                        <Text id={i18n} /> — {list.length}
                                    </div>
                                }>
                                {list.map((x) => (
                                    <Friend key={x._id} user={x} onInviteFriend={() => onInviteFriend(x._id)} />
                                ))}
                            </CollapsibleSection>
                        );
                    })}
                    {
                        lists?.length <= 0 &&
                        <div className={styles.placeholder}>
                            <img src="https://img.war6sky.com/resources/images/zhanwei.png" alt="" />
                        </div>
                    }
                </div>
            </div>


        </>
    );
});
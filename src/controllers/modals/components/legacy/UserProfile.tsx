import { ListUl } from "@styled-icons/boxicons-regular";
import {
    Envelope,
    Edit,
    UserPlus,
    UserX,
    Group,
    InfoCircle,
} from "@styled-icons/boxicons-solid";
import { observer } from "mobx-react-lite";
import { Link, useHistory } from "react-router-dom";
import { UserPermission, API } from "revolt.js";

import styles from "./UserProfile.module.scss";
import { Localizer, Text } from "preact-i18n";
import { useEffect, useLayoutEffect, useState } from "preact/hooks";

import {
    Button,
    Category,
    Error,
    IconButton,
    Modal,
    Preloader,
} from '../../../../components/revoltchat';

import { noop } from "../../../../lib/js";
import { remTorem, numTonum, pxTorem, px2orem } from '../../../../components/revoltchat/lib/calculation';

import ChannelIcon from "../../../../components/common/ChannelIcon";
import ServerIcon from "../../../../components/common/ServerIcon";
import Tooltip from "../../../../components/common/Tooltip";
import UserBadges from "../../../../components/common/user/UserBadges";
import UserIcon from "../../../../components/common/user/UserIcon";
import { Username } from "../../../../components/common/user/UserShort";
import UserStatus from "../../../../components/common/user/UserStatus";
import Markdown from "../../../../components/markdown/Markdown";
import { useSession } from "../../../../controllers/client/ClientController";
import { modalController } from "../../../../controllers/modals/ModalController";
import { ModalProps } from "../../types";
import { isMicroMode, inSingleWebView, openMicroChannelPage } from "../../../../lib/global";

export const UserProfile = observer(
    ({
        user_id,
        isPlaceholder,
        placeholderProfile,
        ...props
    }: ModalProps<"user_profile">) => {


        console.log('999', props)

        const isMicro = isMicroMode();
        const isSingle = inSingleWebView();

        const [profile, setProfile] = useState<
            undefined | null | API.UserProfile
        >(undefined);
        const [mutual, setMutual] = useState<
            undefined | null | API.MutualResponse
        >(undefined);
        const [isPublicBot, setIsPublicBot] = useState<
            undefined | null | boolean
        >();

        const history = useHistory();
        const session = useSession()!;
        const client = session.client!;
        const [tab, setTab] = useState("profile");

        const user = client.users.get(user_id);
        if (!user) {
            if (props.onClose) useEffect(props.onClose, []);
            return null;
        }

        const users = mutual?.users.map((id) => client.users.get(id));

        const mutualGroups = [...client.channels.values()].filter(
            (channel) =>
                channel?.channel_type === "Group" &&
                channel.recipient_ids!.includes(user_id),
        );

        const mutualServers = mutual?.servers.map((id) =>
            client.servers.get(id),
        );

        useLayoutEffect(() => {
            if (!user_id) return;
            if (typeof profile !== "undefined") setProfile(undefined);
            if (typeof mutual !== "undefined") setMutual(undefined);
            if (typeof isPublicBot !== "undefined") setIsPublicBot(undefined);
            // eslint-disable-next-line
        }, [user_id]);

        useEffect(() => {
            if (isPlaceholder) {
                setProfile(placeholderProfile);
            }
        }, [isPlaceholder, placeholderProfile]);

        useEffect(() => {
            if (isPlaceholder) return;
            if (session.state === "Online" && typeof mutual === "undefined") {
                setMutual(null);
                user.fetchMutual().then(setMutual);
            }
        }, [mutual, session.state, isPlaceholder, user]);

        useEffect(() => {
            if (isPlaceholder) return;
            if (session.state === "Online" && typeof profile === "undefined") {
                setProfile(null);

                if (user.permission & UserPermission.ViewProfile) {
                    user.fetchProfile().then(setProfile).catch(noop);
                }
            }
        }, [profile, session.state, isPlaceholder, user]);

        useEffect(() => {
            if (
                session.state === "Online" &&
                user.bot &&
                typeof isPublicBot === "undefined"
            ) {
                setIsPublicBot(null);
                client.bots
                    .fetchPublic(user._id)
                    .then(() => setIsPublicBot(true))
                    .catch(noop);
            }
        }, [isPublicBot, session.state, user, client.bots]);

        const backgroundURL =
            profile &&
            client.generateFileURL(
                profile.background as any,
                { width: numTonum(1000) },
                true,
            ) || 'https://skyvs.oss-cn-hangzhou.aliyuncs.com/resources/images/IM-Bg.jpeg';

        const badges = user.badges ?? 0;
        const flags = user.flags ?? 0;

        const children = (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: pxTorem(950),
                height: pxTorem(700),

            }}>
                <div
                    className={styles.header}
                    data-force={profile?.background ? "light" : undefined}
                    style={{
                        backgroundImage:
                            backgroundURL &&
                            `linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url('${backgroundURL}')`,
                        paddingBottom: pxTorem(1),
                        display: 'block',
                        paddingTop: pxTorem(64),
                        paddingLeft: pxTorem(57)
                    }}>
                    <div className={styles.profile} style={{
                        marginBottom: pxTorem(20)
                    }}>
                        <UserIcon
                            size={numTonum(80)}
                            style={{
                                width: pxTorem(135),
                                height: pxTorem(135),
                                // marginTop: pxTorem(64),
                                // marginLeft: pxTorem(57)
                            }}
                            target={user}
                            animate
                            hover={typeof user.avatar !== "undefined"}
                            onClick={() =>
                                user.avatar &&
                                modalController.push({
                                    type: "image_viewer",
                                    attachment: user.avatar,
                                })
                            }
                        />
                        <div className={styles.details} style={{
                            marginLeft: pxTorem(35),
                            height: pxTorem(135)
                        }}>
                            <div className={styles.usernameDetail}>
                                <span
                                    className={styles.displayname}
                                    style={{
                                        fontSize: pxTorem(30)
                                    }}
                                    onClick={() =>
                                        modalController.writeText(user.username)
                                    }>
                                    {user.display_name ?? user.username}
                                </span>
                                <span style={{
                                    color: '#DCDCDB',
                                    opacity: '.4',
                                    fontSize: pxTorem(20),
                                    margin: `${pxTorem(10)} 0`
                                }}>
                                    ID ****
                                </span>
                                <span
                                    className={styles.username}
                                    style={{ fontSize: pxTorem(24), opacity: '.7' }}
                                    onClick={() =>
                                        modalController.writeText(
                                            user.username +
                                            "#" +
                                            user.discriminator,
                                        )
                                    }>
                                    <Localizer>
                                        <Tooltip
                                            content={
                                                <Text id="app.special.copy_username" />
                                            }>
                                            {/* {user.username}#{user.discriminator} */}
                                            “暂无简介”
                                        </Tooltip>
                                    </Localizer>
                                </span>
                            </div>
                            {user.status?.text && (
                                <span className={styles.status}>
                                    <UserStatus user={user} tooltip />
                                </span>
                            )}
                        </div>
                        {isPublicBot && (
                            <Link to={`/bot/${user._id}`}>
                                <Button
                                    palette="accent"
                                    compact
                                    onClick={props.onClose}>
                                    {"Add to server" /* FIXME: i18n */}
                                </Button>
                            </Link>
                        )}
                        {/* {(user.relationship === "Friend" || user.bot) && (
                            <Localizer>
                                <Tooltip
                                    content={
                                        <Text id="app.context_menu.message_user" />
                                    }>
                                    <IconButton
                                        onClick={() => {
                                            props.onClose?.();

                                            if (isMicro) {
                                                if (isSingle) {
                                                    window.location.hash = `/open/${user_id}`;
                                                } else {
                                                    openMicroChannelPage(`/open/${user_id}`);
                                                }
                                            } else {
                                                history.push(`/open/${user_id}`);
                                            }
                                        }}>
                                        <Envelope size={numTonum(30)} />
                                    </IconButton>
                                </Tooltip>
                            </Localizer>
                        )} */}
                        {user.relationship === "User" && !isPlaceholder && !isMicro && (
                            <IconButton
                                onClick={() => {
                                    props.onClose?.();
                                    history.push(`/settings/profile`);
                                }}>
                                <Edit size={28} />
                            </IconButton>
                        )}
                        {!user.bot &&
                            flags != 2 &&
                            flags != 4 &&
                            (user.relationship === "Incoming" ||
                                user.relationship === "None" ||
                                user.relationship === null) && (
                                <IconButton onClick={() => user.addFriend()}>
                                    <UserPlus size={numTonum(28)} />
                                </IconButton>
                            )}
                        {user.relationship === "Outgoing" && (
                            <IconButton onClick={() => user.removeFriend()}>
                                <UserX size={numTonum(28)} />
                            </IconButton>
                        )}
                    </div>
                    {badges > 0 && (
                        <div
                            style={{
                                marginInline: "1em",
                                padding: "0.5em",
                                background: "var(--primary-background)",
                                borderRadius: pxTorem(8),
                                width: "fit-content",
                                backgroundColor:
                                    "rgba(var(--primary-header-rgb), max(var(--min-opacity), 0.65))",
                                backdropFilter: `blur(${pxTorem(20)})`,
                            }}>
                            <UserBadges badges={badges} uid={user._id} />
                        </div>
                    )}
                    <div className={styles.tabs}>
                        <div style={{ fontSize: pxTorem(20) }}
                            data-active={tab === "profile"}
                            onClick={() => setTab("profile")}>
                            <Text id="app.special.popovers.user_profile.profile" />
                        </div>
                        {user.relationship !== "User" && (
                            <>
                                {!user.bot && (
                                    <div style={{ fontSize: pxTorem(20) }}
                                        data-active={tab === "friends"}
                                        onClick={() => setTab("friends")}>
                                        <Text id="app.special.popovers.user_profile.mutual_friends" />
                                    </div>
                                )}
                                <div style={{ fontSize: pxTorem(20) }}
                                    data-active={tab === "groups"}
                                    onClick={() => setTab("groups")}>
                                    <Text id="app.special.popovers.user_profile.mutual_groups" />
                                </div>
                                {!isMicro && <div
                                    data-active={tab === "servers"}
                                    onClick={() => setTab("servers")}>
                                    <Text id="app.special.popovers.user_profile.mutual_servers" />
                                </div>}
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.content}>
                    {tab === "profile" &&
                        (profile?.content || flags > 0 || user.bot ? (
                            <div>
                                {flags & 1 ? (
                                    /** ! FIXME: i18n this area */
                                    <Category>
                                        <Error error="User is suspended" />
                                    </Category>
                                ) : undefined}
                                {flags & 2 ? (
                                    <Category>
                                        <Error error="User deleted their account" />
                                    </Category>
                                ) : undefined}
                                {flags & 4 ? (
                                    <Category>
                                        <Error error="User is banned" />
                                    </Category>
                                ) : undefined}
                                {user.bot ? (
                                    <>
                                        {/* FIXME: this too */}
                                        <div className={styles.category}>
                                            {"bot owner"}
                                        </div>
                                        <div
                                            onClick={() =>
                                                user.bot &&
                                                modalController.push({
                                                    type: "user_profile",
                                                    user_id: user.bot.owner,
                                                })
                                            }
                                            className={styles.entry}
                                            key={user.bot.owner}>
                                            <UserIcon
                                                size={32}
                                                target={client.users.get(
                                                    user.bot.owner,
                                                )}
                                            />
                                            <span>
                                                <Username
                                                    user={client.users.get(
                                                        user.bot.owner,
                                                    )}
                                                />
                                            </span>
                                        </div>
                                    </>
                                ) : undefined}
                                {profile?.content && (
                                    <>
                                        <div className={styles.category}>
                                            <Text id="app.special.popovers.user_profile.sub.information" />
                                        </div>
                                        <div className={styles.markdown}>
                                            <Markdown
                                                content={profile.content}
                                            />
                                        </div>
                                    </>
                                )}
                                {/*<div className={styles.category}><Text id="app.special.popovers.user_profile.sub.connections" /></div>*/}
                            </div>
                        ) : (
                            <div className={styles.empty}>
                                <InfoCircle size={numTonum(72)} />
                                <Text id="app.special.popovers.user_profile.empty" />
                            </div>
                        ))}
                    {tab === "friends" &&
                        (users ? (
                            users.length === 0 ? (
                                <div className={styles.empty}>
                                    <UserPlus size={numTonum(72)} />
                                    <Text id="app.special.popovers.user_profile.no_users" />
                                </div>
                            ) : (
                                <div className={styles.entries}>
                                    {users.map(
                                        (x) =>
                                            x && (
                                                <div
                                                    onClick={() =>
                                                        modalController.push({
                                                            type: "user_profile",
                                                            user_id: x._id,
                                                        })
                                                    }
                                                    className={styles.entry}
                                                    key={x._id}>
                                                    <UserIcon
                                                        size={numTonum(32)}
                                                        target={x}
                                                        status
                                                    />
                                                    <span>{x.username}</span>
                                                </div>
                                            ),
                                    )}
                                </div>
                            )
                        ) : (
                            <Preloader type="ring" />
                        ))}
                    {tab === "groups" &&
                        (mutualGroups.length === 0 ? (
                            <div className={styles.empty}>
                                <Group size={numTonum(72)} />
                                <Text id="app.special.popovers.user_profile.no_groups" />
                            </div>
                        ) : (
                            <div className={styles.entries}>
                                {mutualGroups.map(
                                    (x) =>
                                        x?.channel_type === "Group" && (
                                            !isMicro ? <Link to={`/channel/${x._id}`}>
                                                <div
                                                    className={styles.entry}
                                                    key={x._id}>
                                                    <ChannelIcon
                                                        target={x}
                                                        size={numTonum(32)}
                                                    />
                                                    <span>{x.name}</span>
                                                </div>
                                            </Link> : <div
                                                className={styles.entry}
                                                key={x._id}
                                                onClick={() => {
                                                    if (isSingle) {
                                                        window.location.hash = `/channel/${x._id}`
                                                    } else {
                                                        // TODO 打开群组弹框
                                                    }
                                                }}
                                            >
                                                <ChannelIcon
                                                    target={x}
                                                    size={numTonum(32)}
                                                />
                                                <span>{x.name}</span>
                                            </div>
                                        ),
                                )}
                            </div>
                        ))}
                    {tab === "servers" &&
                        (!mutualServers || mutualServers.length === 0 ? (
                            <div className={styles.empty}>
                                <ListUl size={numTonum(72)} />
                                <Text id="app.special.popovers.user_profile.no_servers" />
                            </div>
                        ) : (
                            <div className={styles.entries}>
                                {mutualServers.map(
                                    (x) =>
                                        x && (
                                            <Link to={`/server/${x._id}`}>
                                                <div
                                                    className={styles.entry}
                                                    key={x._id}>
                                                    <ServerIcon
                                                        target={x}
                                                        size={numTonum(32)}
                                                    />
                                                    <span>{x.name}</span>
                                                </div>
                                            </Link>
                                        ),
                                )}
                            </div>
                        ))}
                </div>
            </div >
        );

        if (isPlaceholder) return <div>{children}</div>;

        return (
            <Modal
                {...props}
                nonDismissable={isPlaceholder}
                transparent
                noMaxSize={true}
                maxWidth={pxTorem(950)}>
                {children}
            </Modal>
        );
    },
);
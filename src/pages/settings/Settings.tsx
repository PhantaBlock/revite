import { Github } from "@styled-icons/boxicons-logos";
import {
    Sync as SyncIcon,
    Globe,
    LogOut,
    Desktop,
    ListUl,
} from "@styled-icons/boxicons-regular";
import {
    Bell,
    Palette,
    Coffee,
    IdCard,
    CheckShield,
    Flask,
    User,
    Megaphone,
    Speaker,
    Plug,
    Bot,
    Trash,
} from "@styled-icons/boxicons-solid";
import { observer } from "mobx-react-lite";
import { Route, Switch, useHistory } from "react-router-dom";
import { LIBRARY_VERSION } from "revolt.js";
import styled from "styled-components/macro";

import styles from "./Settings.module.scss";
import { openContextMenu } from "preact-context-menu";
import { Text } from "preact-i18n";

import { LineDivider } from '../../components/revoltchat';
import { remTorem, pxTorem, numTonum } from '../../lib/calculation';
import { useApplicationState } from "../../mobx/State";

import UserIcon from "../../components/common/user/UserIcon";
import { Username } from "../../components/common/user/UserShort";
import UserStatus from "../../components/common/user/UserStatus";
import ButtonItem from "../../components/navigation/items/ButtonItem";
import {
    useClient,
    clientController,
} from "../../controllers/client/ClientController";
import RequiresOnline from "../../controllers/client/jsx/RequiresOnline";
import { modalController } from "../../controllers/modals/ModalController";
import { GIT_BRANCH, GIT_REVISION, REPO_URL } from "../../revision";
import { APP_VERSION } from "../../version";
import { GenericSettings } from "./GenericSettings";
import { Account } from "./panes/Account";
import { Appearance } from "./panes/Appearance";
import { Audio } from "./panes/Audio";
import { ExperimentsPage } from "./panes/Experiments";
import { Feedback } from "./panes/Feedback";
import { Languages } from "./panes/Languages";
import { MyBots } from "./panes/MyBots";
import { Native } from "./panes/Native";
import { Notifications } from "./panes/Notifications";
import { PluginsPage } from "./panes/Plugins";
import { Profile } from "./panes/Profile";
import { Sessions } from "./panes/Sessions";
import { Sync } from "./panes/Sync";

const AccountHeader = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: var(--border-radius);
    overflow: hidden;
    margin-bottom: ${pxTorem(10)};

    .account {
        padding: ${pxTorem(20)};
        gap: ${pxTorem(10)};
        align-items: center;
        display: flex;
        background: var(--secondary-background);

        .details {
            display: flex;
            flex-direction: column;
            font-size: ${pxTorem(12)};
            gap: ${pxTorem(2)};

            .new {
                font-size: ${pxTorem(20)};
                font-weight: 600;
            }

            .full {
                font-size: ${pxTorem(14)};
                font-weight: 600;
            }
        }
    }

    .statusChanger {
        display: flex;
        align-items: center;
        background: var(--tertiary-background);

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        .status {
            padding-inline-start: ${pxTorem(12)};
            height: ${pxTorem(48)};
            display: flex;
            align-items: center;
            color: var(--secondary-foreground);
            flex-grow: 1;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        svg {
            width: ${pxTorem(48)};
            flex-shrink: 0;
        }
    }
`;

export default observer(() => {
    const history = useHistory();
    const client = useClient();
    const experiments = useApplicationState().experiments;

    function switchPage(to?: string) {
        if (to) {
            history.replace(`/settings/${to}`);
        } else {
            history.replace(`/settings`);
        }
    }

    return (
        <GenericSettings
            pages={[
                {
                    category: (
                        <Text id="app.settings.categories.user_settings" />
                    ),
                    id: "account",
                    icon: <User size={numTonum(20)} />,
                    title: <Text id="app.settings.pages.account.title" />,
                },
                {
                    id: "profile",
                    icon: <IdCard size={numTonum(20)} />,
                    title: <Text id="app.settings.pages.profile.title" />,
                },
                {
                    id: "sessions",
                    icon: <CheckShield size={numTonum(20)} />,
                    title: <Text id="app.settings.pages.sessions.title" />,
                },
                {
                    category: (
                        <Text id="app.settings.categories.client_settings" />
                    ),
                    id: "audio",
                    icon: <Speaker size={numTonum(20)} />,
                    title: <Text id="app.settings.pages.audio.title" />,
                },
                {
                    id: "appearance",
                    icon: <Palette size={numTonum(20)} />,
                    title: <Text id="app.settings.pages.appearance.title" />,
                },
                {
                    id: "plugins",
                    icon: <Plug size={numTonum(20)} />,
                    title: <Text id="app.settings.pages.plugins.title" />,
                    hidden: !experiments.isEnabled("plugins"),
                },
                {
                    id: "notifications",
                    icon: <Bell size={numTonum(20)} />,
                    title: <Text id="app.settings.pages.notifications.title" />,
                },
                {
                    id: "language",
                    icon: <Globe size={numTonum(20)} />,
                    title: <Text id="app.settings.pages.language.title" />,
                },
                {
                    id: "sync",
                    icon: <SyncIcon size={numTonum(20)} />,
                    title: <Text id="app.settings.pages.sync.title" />,
                },
                {
                    id: "native",
                    hidden: !window.isNative,
                    icon: <Desktop size={numTonum(20)} />,
                    title: <Text id="app.settings.pages.native.title" />,
                },
                {
                    id: "experiments",
                    icon: <Flask size={numTonum(20)} />,
                    title: <Text id="app.settings.pages.experiments.title" />,
                },
                {
                    divider: true,
                    category: "revolt",
                    id: "bots",
                    icon: <Bot size={numTonum(20)} />,
                    title: <Text id="app.settings.pages.bots.title" />,
                },
                {
                    id: "feedback",
                    icon: <Megaphone size={numTonum(20)} />,
                    title: <Text id="app.settings.pages.feedback.title" />,
                },
            ]}
            children={
                <Switch>
                    <Route path="/settings/profile">
                        <Profile />
                    </Route>
                    <Route path="/settings/sessions">
                        <RequiresOnline>
                            <Sessions />
                        </RequiresOnline>
                    </Route>
                    <Route path="/settings/appearance">
                        <Appearance />
                    </Route>
                    <Route path="/settings/plugins">
                        <PluginsPage />
                    </Route>
                    <Route path="/settings/audio">
                        <Audio />
                    </Route>
                    <Route path="/settings/notifications">
                        <Notifications />
                    </Route>
                    <Route path="/settings/language">
                        <Languages />
                    </Route>
                    <Route path="/settings/sync">
                        <Sync />
                    </Route>
                    <Route path="/settings/native">
                        <Native />
                    </Route>
                    <Route path="/settings/experiments">
                        <ExperimentsPage />
                    </Route>
                    <Route path="/settings/bots">
                        <MyBots />
                    </Route>
                    <Route path="/settings/feedback">
                        <Feedback />
                    </Route>
                    <Route path="/">
                        <Account />
                    </Route>
                </Switch>
            }
            defaultPage="account"
            switchPage={switchPage}
            category="pages"
            custom={
                <>
                    <ButtonItem
                        compact
                        onClick={() =>
                            modalController.push({ type: "changelog" })
                        }>
                        <ListUl size={numTonum(20)} />
                        <Text id="app.special.modals.changelogs.title" />
                    </ButtonItem>
                    <a
                        href="https://github.com/revoltchat"
                        target="_blank"
                        rel="noreferrer">
                        <ButtonItem compact>
                            <Github size={numTonum(20)} />
                            <Text id="app.settings.pages.source_code" />
                        </ButtonItem>
                    </a>
                    <a
                        href="https://insrt.uk/donate"
                        target="_blank"
                        rel="noreferrer">
                        <ButtonItem className={styles.donate} compact>
                            <Coffee size={numTonum(20)} />
                            <Text id="app.settings.pages.donate.title" />
                        </ButtonItem>
                    </a>
                    <LineDivider compact />
                    <ButtonItem
                        onClick={clientController.logoutCurrent}
                        className={styles.logOut}
                        compact>
                        <LogOut size={numTonum(20)} />
                        <Text id="app.settings.pages.logOut" />
                    </ButtonItem>
                    <div className={styles.version}>
                        <span className={styles.revision}>
                            <a
                                href={`${REPO_URL}/${GIT_REVISION}`}
                                target="_blank"
                                rel="noreferrer">
                                {GIT_REVISION.substr(0, 7)}
                            </a>
                            {` `}
                            <a
                                href={
                                    GIT_BRANCH !== "DETACHED"
                                        ? `https://github.com/revoltchat/revite/tree/${GIT_BRANCH}`
                                        : undefined
                                }
                                target="_blank"
                                rel="noreferrer">
                                ({GIT_BRANCH})
                            </a>
                        </span>
                        <span>
                            {GIT_BRANCH === "production" ? "Stable" : "Nightly"}{" "}
                            {APP_VERSION}
                        </span>
                        {window.isNative && (
                            <span>Native: {window.nativeVersion}</span>
                        )}
                        <span>
                            API: {client.configuration?.revolt ?? "N/A"}
                        </span>
                        <span>revolt.js: {LIBRARY_VERSION}</span>
                    </div>
                </>
            }
            indexHeader={
                <AccountHeader>
                    <div className="account">
                        <UserIcon
                            size={numTonum(64)}
                            target={client.user!}
                            status
                            onClick={() => openContextMenu("Status")}
                        />
                        <div className="details">
                            <span className="new">
                                {client.user.display_name ??
                                    client.user.username}
                            </span>
                            <span className="full">
                                {client.user.username}
                                {"#"}
                                {client.user.discriminator}
                            </span>
                            <UserStatus user={client.user!} />
                        </div>
                    </div>
                    <div className="statusChanger">
                        <a
                            className="status"
                            onClick={() =>
                                modalController.push({
                                    type: "custom_status",
                                })
                            }>
                            Change your status...
                        </a>
                        {client.user!.status?.text && (
                            <Trash
                                size={numTonum(24)}
                                onClick={() =>
                                    client.users.edit({
                                        remove: ["StatusText"],
                                    })
                                }
                            />
                        )}
                    </div>
                </AccountHeader>
            }
        />
    );
});

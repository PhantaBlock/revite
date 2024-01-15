import { Group } from "@styled-icons/boxicons-solid";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import { Message, API } from "revolt.js";
import styled, { css } from "styled-components/macro";

import { useContext, useEffect, useState } from "preact/hooks";

import { Button, Category, Preloader } from "../../../../components/revoltchat";
import { remTorem, pxTorem, numTonum } from '../../../../lib/calculation';

import { isTouchscreenDevice } from "../../../../lib/isTouchscreenDevice";

import { I18nError } from "../../../../context/Locale";

import ServerIcon from "../../../../components/common/ServerIcon";
import {
    useClient,
    useSession,
} from "../../../../controllers/client/ClientController";
import { takeError } from "../../../../controllers/client/jsx/error";

const EmbedInviteBase = styled.div`
    width: ${pxTorem(400)};
    height: ${pxTorem(80)};
    background-color: var(--secondary-background);
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    padding: 0 ${pxTorem(12)};
    margin-top: ${pxTorem(2)};
    ${() =>
        isTouchscreenDevice &&
        css`
            flex-wrap: wrap;
            height: ${pxTorem(130)};
            padding-top: ${pxTorem(8)};
            padding-bottom: ${pxTorem(10)};
            width: 100%;
            > button {
                width: 100%;
            }
        `}
`;

const EmbedInviteDetails = styled.div`
    flex-grow: 1;
    padding-inline-start: ${pxTorem(12)};
    ${() =>
        isTouchscreenDevice &&
        css`
            width: calc(100% - ${pxTorem(55)});
        `}
`;

const EmbedInviteName = styled.div`
    font-weight: bold;
    line-height: ${remTorem(1)};
    max-height: ${remTorem(2)};
    overflow: hidden;
`;

const EmbedInviteMemberCount = styled.div`
    display: flex;
    align-items: center;
    gap: ${pxTorem(2)};
    font-size: 0.8em;

    > svg {
        color: var(--secondary-foreground);
    }
`;

type Props = {
    code: string;
};

export function EmbedInvite({ code }: Props) {
    const history = useHistory();
    const session = useSession()!;
    const client = session.client!;
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [joinError, setJoinError] = useState<string | undefined>(undefined);
    const [invite, setInvite] = useState<
        (API.InviteResponse & { type: "Server" }) | undefined
    >(undefined);

    useEffect(() => {
        if (
            typeof invite === "undefined" &&
            (session.state === "Online" || session.state === "Ready")
        ) {
            client
                .fetchInvite(code)
                .then((data) =>
                    setInvite(data as API.InviteResponse & { type: "Server" }),
                )
                .catch((err) => setError(takeError(err)));
        }
    }, [client, code, invite, session.state]);

    if (typeof invite === "undefined") {
        return error ? (
            <EmbedInviteBase>
                <ServerIcon size={numTonum(55)} />
                <EmbedInviteDetails>
                    <EmbedInviteName>Invalid invite!</EmbedInviteName>
                </EmbedInviteDetails>
            </EmbedInviteBase>
        ) : (
            <EmbedInviteBase>
                <Preloader type="ring" />
            </EmbedInviteBase>
        );
    }

    return (
        <>
            <EmbedInviteBase>
                <ServerIcon
                    attachment={invite.server_icon}
                    server_name={invite.server_name}
                    size={numTonum(55)}
                />
                <EmbedInviteDetails>
                    <EmbedInviteName>{invite.server_name}</EmbedInviteName>
                    <EmbedInviteMemberCount>
                        <Group size={numTonum(12)} />
                        {invite.member_count.toLocaleString()}{" "}
                        {invite.member_count === 1 ? "member" : "members"}
                    </EmbedInviteMemberCount>
                </EmbedInviteDetails>
                {processing ? (
                    <div>
                        <Preloader type="ring" />
                    </div>
                ) : (
                    <Button
                        onClick={async () => {
                            setProcessing(true);

                            try {
                                await client.joinInvite(invite);

                                history.push(
                                    `/server/${invite.server_id}/channel/${invite.channel_id}`,
                                );
                            } catch (err) {
                                setJoinError(takeError(err));
                            } finally {
                                setProcessing(false);
                            }
                        }}>
                        {client.servers.get(invite.server_id)
                            ? "Joined"
                            : "Join"}
                    </Button>
                )}
            </EmbedInviteBase>
            {joinError && (
                <Category>
                    <I18nError error={joinError} />
                </Category>
            )}
        </>
    );
}

const INVITE_PATHS = [
    `${location.hostname}/invite`,
    "app.revolt.chat/invite",
    "nightly.revolt.chat/invite",
    "local.revolt.chat/invite",
    "rvlt.gg",
];

const RE_INVITE = new RegExp(
    `(?:${INVITE_PATHS.map((x) => x.replace(/\./g, "\\.")).join(
        "|",
    )})/([A-Za-z0-9]*)`,
    "g",
);

export default observer(({ message }: { message: Message }) => {
    if (typeof message.content !== "string") return null;
    const matches = [...message.content.matchAll(RE_INVITE)];

    if (matches.length > 0) {
        const entries = [
            ...new Set(matches.slice(0, 5).map((x) => x[1])),
        ].slice(0, 5);

        return (
            <>
                {entries.map(
                    (entry) =>
                        entry !== "discover" && (
                            <EmbedInvite key={entry} code={entry} />
                        ),
                )}
            </>
        );
    }

    return null;
});

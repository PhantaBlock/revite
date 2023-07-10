/* eslint-disable react-hooks/rules-of-hooks */
import { useHistory, useParams } from "react-router-dom";

import { Text } from "preact-i18n";
import { useEffect } from "preact/hooks";

import { Header } from "@revoltchat/ui";

import { useSession } from "../controllers/client/ClientController";
import { modalController } from "../controllers/modals/ModalController";
import { observer } from "mobx-react-lite";

function Open() {
    const history = useHistory();
    const session = useSession()!;

    console.log('##', session);

    if (!session) {
        return null;
    }

    const client = session.client!;
    const { id } = useParams<{ id: string }>();

    if (session.state !== "Online") {
        return (
            <Header palette="primary">
                <Text id="general.loading" />
            </Header>
        );
    }

    useEffect(() => {
        if (id === "saved") {
            for (const channel of [...client.channels.values()]) {
                if (channel?.channel_type === "SavedMessages") {
                    try {
                        history.push(`/channel/${channel._id}`);
                    } catch (error) {
                        window.location.hash = `/channel/${channel._id}`
                    }
                    return;
                }
            }

            client
                .user!.openDM()
                .then((channel) => {
                    try {
                        history.push(`/channel/${channel._id}`);
                    } catch (error) {
                        window.location.hash = `/channel/${channel._id}`
                    }
                })
                .catch((error) =>
                    modalController.push({
                        type: "error",
                        error,
                    }),
                );

            return;
        }

        const user = client.users.get(id);
        if (user) {
            const channel: string | undefined = [
                ...client.channels.values(),
            ].find(
                (channel) =>
                    channel?.channel_type === "DirectMessage" &&
                    channel.recipient_ids!.includes(id),
            )?._id;

            if (channel) {
                try {
                    history.push(`/channel/${channel}`);
                } catch (error) {
                    window.location.hash = `/channel/${channel}`
                }
            } else {
                client.users
                    .get(id)
                    ?.openDM()
                    .then((channel) => {
                        try {
                            history.push(`/channel/${channel._id}`);
                        } catch (error) {
                            window.location.hash = `/channel/${channel._id}`
                        }
                    })
                    .catch((error) =>
                        modalController.push({
                            type: "error",
                            error,
                        }),
                    );
            }

            return;
        }

        try {
            history.push("/");
        } catch (error) {
            window.location.hash = `/`
        }
    });

    return (
        <Header palette="primary">
            <Text id="general.loading" />
        </Header>
    );
}

export default observer(Open);
import { useEffect, useState } from "preact/compat";
import { observer } from "mobx-react-lite";
import { TextChannel } from "../../pages/channels/Channel";
import { useClient } from "../../controllers/client/ClientController";

export default observer(({ channelId }: {
    channelId: string;
}) => {
    const client = useClient();
    const channel = client.channels.get(channelId)!;

    if (!channel) {
        return null;
    }

    return <TextChannel channel={channel} tempMode />;
});
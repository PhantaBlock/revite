import { useEffect, useState } from "preact/compat";
import { observer } from "mobx-react-lite";
import { TextChannel } from "../../pages/channels/Channel";
import { useApi, useClient } from "../../controllers/client/ClientController";

export default observer(({ channelId, userId }: {
    channelId: string;
    userId: string;
}) => {
    const client = useClient();
    const channel = client.channels.get(channelId)!;

    useEffect(() => {
        // 这里需要用 activeClient.api
        // 请求时才会在headers里带上 X-Session-Token
        const API = useClient().api;
        // @ts-ignore-next-line
        API.put(`/channels/${channelId}/common/add/${userId}`);
    }, []);

    if (!channel) {
        return null;
    }

    return <TextChannel channel={channel} tempMode />;
});
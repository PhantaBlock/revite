import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { TextChannel } from "../../pages/channels/Channel";
import { useClient } from "../../controllers/client/ClientController";

export default observer(({ channelId = "01H3V59D0FQ0HFJ4FGJRCE1X77" }: {
    channelId: string;
}) => {
    const [channel, setChannel] = useState<any>("");

    useEffect(() => {
        setTimeout(() => {
            const client = useClient();
            setChannel(client.channels.get(channelId)!)
        }, 1000)
    }, [channelId])

    // 这里channel可能会拉取的慢了，需要看看怎么搞
    // console.log('##', client, channel);

    return !!channel && <TextChannel channel={channel} tempMode={false} />;
});
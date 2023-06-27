import { useEffect, useState } from "preact/compat";
import { observer } from "mobx-react-lite";
import { TextChannel } from "../../pages/channels/Channel";
import { useClient } from "../../controllers/client/ClientController";

export default observer(({ channelId = "01H3S1WJM7GSGW03BXWA3CVESW" }: {
    channelId: string;
}) => {
    const [channel, setChannel] = useState<any>();

    useEffect(() => {
        // 这里channel可能会拉取的慢了，需要看看怎么搞
        setTimeout(() => {
            const client = useClient();
            const _channel = client.channels.get(channelId)!;

            console.log('##', _channel);

            setChannel(_channel);
        }, 1000)
    }, [channelId])

    if (!channel) {
        return null;
    }

    return <TextChannel channel={channel} tempMode />;
});
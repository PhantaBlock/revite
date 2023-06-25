import { observer } from "mobx-react-lite";
import { TextChannel } from "../../pages/channels/Channel";
import { useClient } from "../../controllers/client/ClientController";

export default observer(({ channelId = "01H3S1WJM7GSGW03BXWA3CVESW" }: {
    channelId: string;
}) => {
    const client = useClient();
    const channel = client.channels.get(channelId)!;

    // 这里channel可能会拉取的慢了，需要看看怎么搞
    console.log('##', client, channel);

    return <TextChannel channel={channel} tempMode />;
});
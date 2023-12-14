// ! This should be moved into "./../../components/revoltchat"
import { Channel } from "revolt.js";

import { Text } from "preact-i18n";

import styles from './ChannelName.module.scss';

interface Props {
    channel?: Channel;
    prefix?: boolean;
}

/**
 * Channel display name
 */
export function ChannelName({ channel, prefix }: Props) {
    if (!channel) return <></>;

    if (channel.channel_type === "SavedMessages")
        return <Text id="app.navigation.tabs.saved" />;

    if (channel.channel_type === "DirectMessage") {
        if (channel.recipient?.vip?.level_type === 1) {
            const { term_type = 0 } = channel.recipient?.vip || {};
            const VIPConfig = window.__VIP_CONFIG_MAP__?.[term_type];

            return (
                <div className={styles.vipNameWrap}>
                    <span>{channel.recipient!.username}</span>
                    {!!VIPConfig && <div className={styles.vipTag} style={{ backgroundImage: `url(${VIPConfig.icon})` }} />}
                </div>
            )
        }


        return (
            <>
                {prefix && "@"}
                {channel.recipient!.username}
            </>
        );
    }

    if (channel.channel_type === "TextChannel" && prefix) {
        return <>{`#${channel.name}`}</>;
    }

    return <>{channel.name}</>;
}

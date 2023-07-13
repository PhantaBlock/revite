import {
    BarChartAlt2,
    Microphone,
    MicrophoneOff,
    PhoneOff,
    VolumeFull,
    VolumeMute,
} from "@styled-icons/boxicons-solid";
import { observer } from "mobx-react-lite";
import styled from "styled-components/macro";

import { Text } from "preact-i18n";
import { useMemo } from "preact/hooks";

import { Button } from '../../../components/revoltchat';
import { remTorem, pxTorem, numTonum } from '../../../lib/calculation';

import { voiceState, VoiceStatus } from "../../../lib/vortex/VoiceState";

import Tooltip from "../../../components/common/Tooltip";
import UserIcon from "../../../components/common/user/UserIcon";
import { useClient } from "../../../controllers/client/ClientController";
import { modalController } from "../../../controllers/modals/ModalController";

interface Props {
    id: string;
}

const VoiceBase = styled.div`
    margin-top: ${pxTorem(48)};
    padding: ${pxTorem(20)};
    background: var(--secondary-background);
    flex-grow: 1;

    .status {
        flex: 1 0;
        display: flex;
        position: absolute;
        align-items: center;

        padding: ${pxTorem(10)};
        font-size: ${pxTorem(13)};
        font-weight: 500;
        user-select: none;
        gap: ${pxTorem(6)};

        color: var(--success);
        border-radius: var(--border-radius);
        background: var(--primary-background);

        svg {
            cursor: help;
        }
    }

    display: flex;
    flex-direction: column;

    .participants {
        margin: ${pxTorem(40)} ${pxTorem(20)};
        justify-content: center;
        user-select: none;
        display: flex;
        flex-flow: row wrap;
        gap: ${pxTorem(16)};

        div:hover img {
            opacity: 0.8;
        }

        .disconnected {
            opacity: 0.5;
        }
    }

    .actions {
        display: flex;
        justify-content: center;
        gap: ${pxTorem(10)};
    }
`;

export default observer(({ id }: Props) => {
    if (voiceState.roomId !== id) return null;

    const client = useClient();
    const self = client.users.get(client.user!._id);

    const keys = Array.from(voiceState.participants.keys());
    const users = useMemo(() => {
        return keys.map((key) => client.users.get(key));
        // eslint-disable-next-line
    }, [keys]);

    return (
        <VoiceBase>
            <div className="participants">
                {users && users.length !== 0
                    ? users.map((user, index) => {
                        const user_id = keys![index];
                        return (
                            <div key={user_id}>
                                <UserIcon
                                    size={numTonum(80)}
                                    target={user}
                                    status={false}
                                    voice={
                                        client.user?._id === user_id &&
                                            voiceState.isDeaf()
                                            ? "deaf"
                                            : voiceState.participants!.get(
                                                user_id,
                                            )?.audio
                                                ? undefined
                                                : "muted"
                                    }
                                    onClick={() =>
                                        modalController.push({
                                            type: "user_profile",
                                            user_id,
                                        })
                                    }
                                />
                            </div>
                        );
                    })
                    : self !== undefined && (
                        <div key={self._id} className="disconnected">
                            <UserIcon
                                size={numTonum(80)}
                                target={self}
                                status={false}
                            />
                        </div>
                    )}
            </div>
            <div className="status">
                <BarChartAlt2 size={numTonum(16)} />
                {voiceState.status === VoiceStatus.CONNECTED && (
                    <Text id="app.main.channel.voice.connected" />
                )}
            </div>
            <div className="actions">
                <Tooltip content={"Leave call"} placement={"top"}>
                    <Button palette="error" onClick={voiceState.disconnect}>
                        <PhoneOff width={numTonum(20)} />
                    </Button>
                </Tooltip>
                {voiceState.isProducing("audio") ? (
                    <Tooltip content={"Mute microphone"} placement={"top"}>
                        <Button
                            onClick={() => voiceState.stopProducing("audio")}>
                            <Microphone width={numTonum(20)} />
                        </Button>
                    </Tooltip>
                ) : (
                    <Tooltip content={"Unmute microphone"} placement={"top"}>
                        <Button
                            onClick={() => voiceState.startProducing("audio")}>
                            <MicrophoneOff width={numTonum(20)} />
                        </Button>
                    </Tooltip>
                )}
                {voiceState.isDeaf() ? (
                    <Tooltip content={"Undeafen"} placement={"top"}>
                        <Button onClick={() => voiceState.stopDeafen()}>
                            <VolumeMute width={numTonum(20)} />
                        </Button>
                    </Tooltip>
                ) : (
                    <Tooltip content={"Deafen"} placement={"top"}>
                        <Button onClick={() => voiceState.startDeafen()}>
                            <VolumeFull width={numTonum(20)} />
                        </Button>
                    </Tooltip>
                )}
            </div>
        </VoiceBase>
    );
});

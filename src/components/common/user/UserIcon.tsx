import { VolumeMute, MicrophoneOff } from "@styled-icons/boxicons-solid";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { User, API } from "revolt.js";
import styled, { css } from "styled-components/macro";

import { useApplicationState } from "../../../mobx/State";

import fallback from "../assets/user.png";

import { useClient } from "../../../controllers/client/ClientController";
import IconBase, { IconBaseProps } from "../IconBase";

import { Header, IconButton } from "../../../components/revoltchat";
import { px2orem, pxTorem, num2 } from '../../../lib/calculation';

type VoiceStatus = "muted" | "deaf";
interface Props extends IconBaseProps<User> {
    status?: boolean;
    override?: string;
    voice?: VoiceStatus;
    masquerade?: API.Masquerade;
    showServerIdentity?: boolean;
}

export function useStatusColour(user?: User) {
    const theme = useApplicationState().settings.theme;

    return user?.online && user?.status?.presence !== "Invisible"
        ? user?.status?.presence === "Idle"
            ? theme.getVariable("status-away")
            : user?.status?.presence === "Focus"
                ? theme.getVariable("status-focus")
                : user?.status?.presence === "Busy"
                    ? theme.getVariable("status-busy")
                    : theme.getVariable("status-online")
        : theme.getVariable("status-invisible");
}

const VoiceIndicator = styled.div<{ status: VoiceStatus }>`
    width: ${pxTorem(10)};
    height: ${pxTorem(10)};
    border-radius: var(--border-radius-half);

    display: flex;
    align-items: center;
    justify-content: center;

    ${(props) =>
        (props.status === "muted" || props.status === "deaf") &&
        css`
            background: var(--error);
        `}
`;

export default observer(
    (
        props: Props &
            Omit<
                JSX.SVGAttributes<SVGSVGElement>,
                keyof Props | "children" | "as"
            >,
    ) => {
        const client = useClient();

        const {
            target,
            attachment,
            size,
            status,
            animate,
            mask,
            hover,
            showServerIdentity,
            masquerade,
            innerRef,
            override,
            ...svgProps
        } = props;

        let { url } = props;
        if (masquerade?.avatar) {
            url = client.proxyFile(masquerade.avatar);
        } else if (override) {
            url = override;
        } else if (!url) {
            let override;
            if (target && showServerIdentity) {
                const { server } = useParams<{ server?: string }>();
                if (server) {
                    const member = client.members.getKey({
                        server,
                        user: target._id,
                    });

                    if (member?.avatar) {
                        override = member?.avatar;
                    }
                }
            }

            // @ts-ignore-next-line
            url = target?.avatar_url || (
                client.generateFileURL(
                    override ?? target?.avatar ?? attachment ?? undefined,
                    { max_side: num2(256) },
                    animate,
                ) ?? (target ? target.defaultAvatarURL : fallback));
        }

        return (
            <IconBase
                {...svgProps}
                ref={innerRef}
                width={size}
                height={size}
                hover={hover}
                borderRadius="--border-radius-user-icon"
                aria-hidden="true"
                viewBox={`0 0 ${num2(32)} ${num2(32)}`}>
                <foreignObject
                    x="0"
                    y="0"
                    width={num2(32)}
                    height={num2(32)}
                    className="icon"
                    mask={mask ?? (status ? "url(#user)" : undefined)}>
                    {<img src={url} draggable={false} loading="lazy" />}
                </foreignObject>
                {props.status && (
                    <circle
                        cx={num2(26)}
                        cy={num2(26)}
                        r={num2(5)}
                        fill={useStatusColour(target)}
                    />
                )}
                {props.voice && (
                    <foreignObject x={num2(22)} y={num2(22)} width={num2(10)} height={num2(10)}>
                        <VoiceIndicator status={props.voice}>
                            {(props.voice === "deaf" && (
                                <VolumeMute size={num2(6)} />
                            )) ||
                                (props.voice === "muted" && (
                                    <MicrophoneOff size={num2(6)} />
                                ))}
                        </VoiceIndicator>
                    </foreignObject>
                )}
            </IconBase>
        );
    },
);

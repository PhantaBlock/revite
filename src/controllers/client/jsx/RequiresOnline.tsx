import { WifiOff } from "@styled-icons/boxicons-regular";
import styled from "styled-components/macro";

import { Text } from "preact-i18n";

import { Preloader } from '../../../components/revoltchat';
import { remTorem, pxTorem, numTonum } from '../../../lib/calculation';

import { useSession } from "../ClientController";

interface Props {
    children: Children;
}

const Base = styled.div`
    gap: ${pxTorem(16)};
    padding: 1em;
    display: flex;
    user-select: none;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    color: var(--tertiary-foreground);
    background: var(--secondary-header);

    > div {
        font-size: ${pxTorem(18)};
    }
`;

export default function RequiresOnline(props: Props) {
    const session = useSession();

    if (!session || session.state === "Connecting")
        return <Preloader type="ring" />;

    if (!(session.state === "Online" || session.state === "Ready"))
        return (
            <Base>
                <WifiOff size={numTonum(16)} />
                <div>
                    <Text id="app.special.requires_online" />
                </div>
            </Base>
        );

    return <>{props.children}</>;
}

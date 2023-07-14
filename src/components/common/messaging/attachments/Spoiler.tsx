import styled from "styled-components/macro";

import { Text } from "preact-i18n";

import { Button, Preloader } from "../../../../components/revoltchat";
import { remTorem, pxTorem, numTonum } from '../../../../lib/calculation';

const Base = styled.div`
    display: grid;
    place-items: center;

    z-index: 1;
    grid-area: 1 / 1;

    cursor: pointer;
    user-select: none;
    text-transform: uppercase;

    span {
        padding: ${pxTorem(8)};
        color: var(--foreground);
        background: var(--primary-background);
        border-radius: calc(var(--border-radius) * 4);
    }
`;

interface Props {
    set: (v: boolean) => void;
}

export default function Spoiler({ set }: Props) {
    return (
        <Base onClick={() => set(false)}>
            <span>
                <Text id="app.main.channel.misc.spoiler_attachment" />
            </span>
        </Base>
    );
}

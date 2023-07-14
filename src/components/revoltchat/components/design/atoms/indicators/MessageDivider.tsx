import React from "react";
import styled, { css } from "styled-components";
import { remTorem, pxTorem } from '../../../../lib/calculation';

const Base = styled.div<{ unread?: boolean }>`
    display: flex;
    align-items: center;
    height: 0;
    margin: ${pxTorem(17)} ${pxTorem(12)} ${pxTorem(5)};
    border-top: thin solid var(--tertiary-foreground);
    user-select: none;

    time {
        margin-top: ${pxTorem(-2)};
        font-size: ${remTorem(0.6875)};
        line-height: ${remTorem(0.6875)};
        font-weight: 600;
        padding-inline: ${pxTorem(5)} ${pxTorem(5)};

        // We set the background to mask the border.
        color: var(--tertiary-foreground);
        background: var(--primary-background);
    }

    ${(props) =>
        props.unread &&
        css`
            border-top: thin solid var(--accent);
        `}
`;

const Unread = styled.div`
    font-size: ${pxTorem(0.625)};
    font-weight: 600;
    background: var(--accent);
    color: var(--accent-contrast);

    padding: ${pxTorem(2)} ${pxTorem(6)};
    margin-top: ${pxTorem(-1)};
    border-radius: ${pxTorem(60)};
`;

interface Props {
    date?: string;
    unread?: boolean;
}

export function MessageDivider({ unread, date }: Props) {
    return (
        <Base unread={unread}>
            {unread && <Unread>NEW</Unread>}
            {date && <time>历史会话</time>}
        </Base>
    );
}

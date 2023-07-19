import React from "react";
import styled, { css } from "styled-components";
import { isMicroMode } from '../../../../../../lib/global';

const Base = styled.div<{ unread?: boolean, isMicro?: boolean }>`
    display: flex;
    align-items: center;
    height: 0;
    margin: 17px 12px 5px;
    border-top: thin solid var(--tertiary-foreground);
    user-select: none;

    time {
        margin-top: -2px;
        font-size: 0.6875rem;
        line-height: 0.6875rem;
        font-weight: 600;
        padding-inline: 5px 5px;
        transform: translateX(50%);

        // We set the background to mask the border.
        color: var(--tertiary-foreground);
        background: var(--primary-background);
    }

    ${(props) =>
        props.isMicro &&
        css`
            margin: 3.75rem 1.5625rem 1rem;

            time {
                font-size: 0.875rem;
                line-height: 0.9rem;
                transform: translateX(-50%);
                margin-left: 50%;
            }
        `}

    ${(props) =>
        props.unread &&
        css`
            border-top: thin solid var(--accent);
        `}
`;

const Unread = styled.div<{ isMicro?: boolean }>`
    font-size: 0.625rem;
    font-weight: 600;
    background: var(--accent);
    color: var(--accent-contrast);

    padding: 2px 6px;
    margin-top: -1px;
    border-radius: 60px;

    ${(props) =>
        props.isMicro &&
        css`
            font-size: 0.875rem;
            line-height: 0.9rem;
        `}
`;

interface Props {
    date?: string;
    unread?: boolean;
}

export function MessageDivider({ unread, date }: Props) {
    return (
        <Base unread={unread} isMicro={isMicroMode()}>
            {unread && <Unread>NEW</Unread>}
            {date && <time>历史会话</time>}
        </Base>
    );
}

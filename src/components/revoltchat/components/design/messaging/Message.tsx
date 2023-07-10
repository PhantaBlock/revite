import { observer } from "mobx-react-lite";
import React from "react";
import type { Message as MessageType } from "revolt.js";
import styled, { css } from "styled-components";
import { Avatar } from "../atoms";
import { Info } from "./Info";
import { numTonum, pxTorem, remTorem } from '../../../lib/calculation';

export interface Props {
    /**
     * Message
     */
    message: MessageType;

    /**
     * Whether this component is the head
     */
    head?: boolean;
}

const Wrapper = styled.div<Pick<Props, "head">>`
    display: flex;
    flex-direction: column;

    ${(props) =>
        props.head &&
        css`
            padding-top: ${pxTorem(14)};
        `}
`;

const MessageEl = styled.div`
    display: flex;
    line-height: ${pxTorem(18)};

    // Make time sent and edited components uniform
    time {
        font-size: ${pxTorem(10)};
        color: var(--tertiary-foreground);
    }
`;

const Tail = styled.div`
    width: ${pxTorem(62)};
    display: flex;
    justify-content: center;
`;

const Content = styled.div`
    font-size: ${pxTorem(14)};
    color: var(--foreground);

    display: flex;
    flex-direction: column;
`;

const Head = styled.div`
    gap: ${pxTorem(6)};
    display: flex;

    // Username
    span {
        font-weight: 600;
    }
`;

export const Message = observer(({ message, head }: Props) => {
    return (
        <Wrapper head={head}>
            <MessageEl>
                <Tail>
                    {head ? (
                        <Avatar
                            size={numTonum(36)}
                            src={message.author?.generateAvatarURL({
                                max_side: numTonum(256),
                            })}
                            interactive
                        />
                    ) : (
                        <Info message={message} head={head} />
                    )}
                </Tail>
                <Content>
                    {head && (
                        <Head>
                            <span>{message.author?.username}</span>
                            <Info message={message} head={head} />
                        </Head>
                    )}
                    <span>content</span>
                </Content>
            </MessageEl>
        </Wrapper>
    );
});

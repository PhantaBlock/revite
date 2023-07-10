import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { EmojiInfo } from "./Picker";
import { numTonum, pxTorem, remTorem } from '../../../../lib/calculation';

interface Props {
    /**
     * Active emoji information
     */
    active: {
        emoji: EmojiInfo | null;
    };

    /**
     * Emoji component
     */
    renderEmoji: React.FC<{ emoji: string }>;
}

const Base = styled.div`
    gap: ${pxTorem(8)};
    padding: ${pxTorem(8)};
    display: flex;
    align-items: center;
    flex-direction: row;

    color: var(--foreground);
    border-top: 3px solid var(--secondary-background);

    img {
        width: ${pxTorem(48)};
        height: ${pxTorem(48)};
        object-fit: contain;
    }
`;

export const EmojiPreview = observer(
    ({ active, renderEmoji: Emoji }: Props) => {
        if (!active.emoji) return null;

        return (
            <Base>
                <Emoji emoji={active.emoji.id} />
                <span>:{active.emoji.name ?? active.emoji.id}:</span>
            </Base>
        );
    },
);

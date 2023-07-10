import styled, { css } from "styled-components";
import { numTonum, pxTorem, remTorem } from '../../../../lib/calculation';

interface Props {
    /**
     * Gap between child elements.
     */
    gap?: string;

    /**
     * This column is a group of elements and should be visually distinct.
     */
    group?: boolean | string;

    /**
     * The contents of this column be vertically centred.
     */
    centred?: boolean;

    /**
     * This column should grow to fit parent container.
     */
    grow?: boolean;
}

/**
 * Generic Flex Column
 */
export const Column = styled.div<Props>`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.gap ?? `${pxTorem(8)}`};

    ${(props) =>
        props.group &&
        css`
            margin: ${typeof props.group === "string" ? props.group : `${pxTorem(16)}`} 0;
        `}

    ${(props) =>
        props.centred &&
        css`
            align-items: center;
        `}

    ${(props) =>
        props.grow &&
        css`
            flex-grow: 1;
        `}
`;

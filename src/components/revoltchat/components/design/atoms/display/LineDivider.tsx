import styled, { css } from "styled-components";
import { remTorem, pxTorem } from '../../../../lib/calculation';

export interface Props {
    readonly palette?: "primary" | "accent";
    readonly compact?: boolean;
}

export const LineDivider = styled.div<Props>`
    display: flex;
    margin: ${(props) => (props.compact ? `${pxTorem(6)}` : `${pxTorem(18)}`)} auto;
    user-select: none;
    align-items: center;

    height: ${pxTorem(1)};
    width: calc(100% - ${pxTorem(10)});

    ${(props) =>
        props.palette === "accent"
            ? css`
                  background: var(--accent);
              `
            : css`
                  background: var(--secondary-header);
              `}
`;

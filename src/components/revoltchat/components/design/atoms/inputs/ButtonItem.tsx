import styled from "styled-components";
import { numTonum, pxTorem, remTorem } from '../../../../lib/calculation';

export interface Props {
    selected?: boolean;
    height?: "compact" | "normal";
}

export const ButtonItem = styled.button<Props>`
    padding: 0 ${pxTorem(8)};
    cursor: pointer;
    user-select: none;
    height: ${(props) => (props.height === "compact" ? `${pxTorem(32)}` : `${pxTorem(42)}`)};

    border: 0;
    border-radius: var(--border-radius);

    color: var(--foreground);
    transition: 0.1s ease-in-out background-color;
    background: ${(props) => (props.selected ? "var(--hover)" : "transparent")};

    &:hover {
        background: var(--hover);
    }
`;

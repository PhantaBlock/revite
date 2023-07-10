import styled from "styled-components";
import { remTorem, pxTorem } from '../../../../lib/calculation';

export interface Props {
    compact?: boolean;
}

export const Category = styled.div<Props>`
    font-size: ${remTorem(0.75)};
    font-weight: 700;
    color: var(--foreground);
    text-transform: uppercase;

    margin-top: ${pxTorem(4)};
    margin-bottom: ${pxTorem(4)};
    white-space: nowrap;
    padding: ${(props) => (props.compact ? `0 ${pxTorem(4)}` : `${pxTorem(6)} 0 ${pxTorem(6)} ${pxTorem(8)}`)};

    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;

    &:first-child {
        margin-top: 0;
        padding-top: 0;
    }
`;

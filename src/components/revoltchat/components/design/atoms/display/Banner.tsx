import styled from "styled-components";
import { remTorem, pxTorem } from '../../../../lib/calculation';

export const Banner = styled.div`
    padding: ${pxTorem(8)};
    font-size: ${remTorem(0.775)};
    text-align: center;

    color: var(--accent);
    background: var(--primary-background);
`;

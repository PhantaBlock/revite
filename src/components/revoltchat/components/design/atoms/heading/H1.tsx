import styled from "styled-components";
import { remTorem } from '../../../../lib/calculation';

export const H1 = styled.h1`
    /* SETTINGS TITLE */
    margin: 0;
    line-height: ${remTorem(1)};
    font-size: ${remTorem(1.2)};
    font-weight: 600;
    color: var(--foreground);
`;

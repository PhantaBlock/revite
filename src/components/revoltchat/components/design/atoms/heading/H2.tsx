import React from "react";
import styled from "styled-components";
import { remTorem } from '../../../../lib/calculation';

export const H2 = styled.h2`
    /* MODAL TITLE */
    margin: 0;
    font-size: ${remTorem(0.9375)};
    font-weight: 700;
    color: var(--foreground);
`;

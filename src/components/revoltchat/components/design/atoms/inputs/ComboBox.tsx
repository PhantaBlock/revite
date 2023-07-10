import styled from "styled-components";
import { pxTorem, remTorem } from '../../../../lib/calculation';

export const ComboBox = styled.select`
    //min-height: ${pxTorem(42)};
    width: 100%;
    padding: ${pxTorem(11)} ${pxTorem(16)};

    font-size: ${remTorem(0.9375)};
    font-family: inherit;
    font-weight: 500;

    color: var(--foreground);
    background: var(--secondary-background);

    /*background-image: url(<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(200, 200, 200, 1);transform: ;msFilter:;"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>);
    background-repeat: no-repeat;
    background-position-x: 99%;
    background-position-y: ${pxTorem(5)};*/

    border: none;
    border-radius: var(--border-radius);
    box-sizing: border-box;
    outline: none;
    cursor: pointer;

    transition: 0.1s ease-in-out all;

    &:focus-visible {
        box-shadow: 0 0 0 1.5pt var(--accent);
    }
`;

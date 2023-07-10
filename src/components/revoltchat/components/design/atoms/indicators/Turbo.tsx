import React from "react";
import styled from "styled-components";
import { Bolt } from "@styled-icons/boxicons-solid";
import { numTonum, pxTorem, remTorem } from '../../../../lib/calculation';

const Base = styled.div`
    display: flex;
    position: relative;
    padding: ${pxTorem(1)} ${pxTorem(5)};
    gap: 2px;
    user-select: none;

    align-items: center;
    font-weight: 800;
    font-style: italic;
    font-size: ${remTorem(0.812)};
    text-transform: uppercase;

    background: var(--accent);
    color: var(--accent-foreground);

    border-radius: var(--border-radius);
    border-start-start-radius: 0 !important;

    &::before {
        content: "";
        position: absolute;

        top: 0;
        right: ${pxTorem(-4)};
        left: ${pxTorem(-4)};
        width: ${pxTorem(2)};
        height: ${pxTorem(4)};
        display: flex;

        border: ${pxTorem(8)} solid var(--accent);
        border-right: ${pxTorem(5)} solid transparent;
        border-left: ${pxTorem(5)} solid transparent;
        border-bottom: ${pxTorem(5)} solid transparent;
    }
`;

export function Turbo() {
    return (
        <Base>
            <Bolt size={numTonum(13)} /> Turbo
        </Base>
    );
}

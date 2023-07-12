import React from "react";
import styled, { keyframes } from "styled-components";
import { remTorem, pxTorem } from '../../../../lib/calculation';

const skSpinner = keyframes`
    0%, 80%, 100% { 
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    40% { 
        -webkit-transform: scale(1.0);
        transform: scale(1.0);
    }
`;

const prRing = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const PreloaderBase = styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    .spinner {
        width: ${pxTorem(58)};
        display: flex;
        text-align: center;
        margin: 100px auto 0;
        justify-content: space-between;
    }

    .spinner > div {
        width: ${pxTorem(14)};
        height: ${pxTorem(14)};
        background-color: var(--tertiary-foreground);

        border-radius: 100%;
        display: inline-block;
        animation: ${skSpinner} 1.4s infinite ease-in-out both;
    }

    .spinner div:nth-child(1) {
        animation-delay: -0.32s;
    }

    .spinner div:nth-child(2) {
        animation-delay: -0.16s;
    }

    .ring {
        display: inline-block;
        position: relative;
        width: ${pxTorem(48)};
        height: ${pxTorem(52)};
    }

    .ring div {
        width: ${pxTorem(32)};
        margin: ${pxTorem(8)};
        height: ${pxTorem(32)};
        display: block;
        position: absolute;
        box-sizing: border-box;
        border: ${pxTorem(2)} solid var(--foreground);
        border-radius: var(--border-radius-half);
        animation: ${prRing} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: var(--foreground) transparent transparent transparent;
    }

    .ring div:nth-child(1) {
        animation-delay: -0.45s;
    }

    .ring div:nth-child(2) {
        animation-delay: -0.3s;
    }

    .ring div:nth-child(3) {
        animation-delay: -0.15s;
    }
`;

export interface Props {
    type: "spinner" | "ring";
}

export function Preloader({ type }: Props) {
    return (
        <PreloaderBase>
            <div className={type}>
                <div />
                <div />
                <div />
            </div>
        </PreloaderBase>
    );
}

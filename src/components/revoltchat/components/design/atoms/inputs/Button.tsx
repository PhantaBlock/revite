import styled, { css } from "styled-components";
import { numTonum, pxTorem, remTorem, px2orem } from '../../../../lib/calculation';

export interface Props {
    readonly compact?: boolean | "icon";
    readonly palette?:
    | "primary"
    | "secondary"
    | "plain"
    | "plain-secondary"
    | "accent"
    | "success"
    | "warning"
    | "error";
    skyTheme?: boolean;
    confirmation?: boolean;
}

export const Button = styled.button<Props>`
    z-index: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;
    font-weight: 500;
    font-family: inherit;

    transition: 0.1s ease all;

    border: none;
    cursor: pointer;
    border-radius: var(--border-radius);

    &:disabled {
        cursor: not-allowed;
    }

    ${(props) =>
        props.compact === "icon"
            ? css`
                height: ${pxTorem(38)};
                width: ${pxTorem(38)};
            `
            : props.compact
                ? css`
            min-width: ${pxTorem(96)};
            font-size: ${remTorem(0.8125)};
            height: ${pxTorem(32)} !important;
            padding:  ${pxTorem(2)} ${pxTorem(12)} !important;
            `
                : css`
            height: ${pxTorem(38)};
            min-width: ${pxTorem(96)};
            padding: ${pxTorem(2)} ${pxTorem(16)};
            font-size: ${remTorem(0.8125)};
    `}
    ${(props) =>
        props.skyTheme && props.confirmation && css`
        font-weight: 700;
        border-radius: 0 !important;
        flex-direction: column;
        background: #FED06D !important;
        background-image: linear-gradient(0deg, #FED06D, #FED77D) !important;
        position: relative;
        color: #1C1616 !important;
        padding: 0;
        &::before {
            content: '';
            width: 100%;
            height: 50%;
            position: absolute;
            left: 0;
            bottom: 0;
            background-image: linear-gradient(180deg, #FFB65A, rgba(239, 176, 97, 0));
        }
        `
    }

    ${(props) => {
        if (props.skyTheme && props.confirmation)
            return
        switch (props.palette) {
            case "secondary":
                return css`
                    font-weight: 400;
                    color: var(--foreground);
                    background: var(--secondary-header);

                    &:hover {
                        background: var(--primary-header);
                    }

                    &:disabled {
                        background: var(--secondary-header);
                    }

                    &:active {
                        background: var(--secondary-background);
                    }
                `;
            case "plain":
            case "plain-secondary":
                return css`
                    font-weight: 500;
                    color: ${props.palette === "plain"
                        ? "var(--foreground)"
                        : "var(--secondary-foreground)"};
                    background: transparent;

                    &:hover {
                        text-decoration: underline;
                    }

                    &:disabled {
                        opacity: 0.5;
                    }

                    &:active {
                        color: var(--tertiary-foreground);
                    }
                `;
            case "accent":
            case "success":
            case "warning":
            case "error":
                return css`
                    font-weight: 600;
                    color: var(--${props.palette}-contrast);
                    background: var(--${props.palette});

                    &:hover {
                        filter: brightness(1.2);
                    }

                    &:active {
                        filter: brightness(0.8);
                    }

                    &:disabled {
                        filter: brightness(0.7);
                    }
                `;
            default:
            case "primary":
                return css`
                    
                    // color: var(--foreground);
                    // background: var(--primary-background);

                    // &:hover {
                    //     background: var(--secondary-header);
                    // }

                    // &:disabled {
                    //     background: var(--primary-background);
                    // }

                    // &:active {
                    //     background: var(--secondary-background);
                    // }
                `;
        }
    }
    }
`;

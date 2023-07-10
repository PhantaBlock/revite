import styled, { css } from "styled-components";
import { numTonum, pxTorem, remTorem } from '../../../../lib/calculation';

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

    ${(props) => {
        switch (props.palette) {
            case "secondary":
                return css`
                    font-weight: 500;
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
                    font-weight: 500;
                    color: var(--foreground);
                    background: var(--primary-background);

                    &:hover {
                        background: var(--secondary-header);
                    }

                    &:disabled {
                        background: var(--primary-background);
                    }

                    &:active {
                        background: var(--secondary-background);
                    }
                `;
        }
    }}
`;

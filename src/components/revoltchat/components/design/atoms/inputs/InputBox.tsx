import styled, { css } from "styled-components";
import { pxTorem, remTorem } from '../../../../lib/calculation';

export interface Props {
    readonly palette?: "primary" | "secondary";
}

export const InputBox = styled.input<Props>`
    //min-height: ${pxTorem(42)};
    width: 100%;
    padding: ${pxTorem(11)} ${pxTorem(16)};

    font-size: ${remTorem(0.9375)};
    font-family: inherit;
    font-weight: 500;

    border: none;
    border-radius: var(--border-radius);
    box-sizing: border-box;
    outline: none;

    transition: 0.1s ease-in-out all;

    &:disabled {
        filter: brightness(0.9);
    }

    &:focus-visible {
        box-shadow: 0 0 0 1.5pt var(--accent);
    }

    ${(props) =>
        props.palette === "primary"
            ? css`
                  color: var(--foreground);
                  background: var(--primary-background);

                  &:hover {
                      background: var(--secondary-background);
                  }
              `
            : css`
                  color: var(--secondary-foreground);
                  background: var(--secondary-background);

                  &:hover {
                      background: var(--hover);
                  }
              `}
`;

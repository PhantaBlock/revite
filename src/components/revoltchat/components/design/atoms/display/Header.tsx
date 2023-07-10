import styled, { css } from "styled-components";
import { remTorem, pxTorem } from '../../../../lib/calculation';

export interface Props {
    readonly palette: "primary" | "secondary";

    readonly topBorder?: boolean;
    readonly bottomBorder?: boolean;

    readonly withBackground?: boolean;
    readonly withTransparency?: boolean;
}

export const Header = styled.div<Props>`
    gap: ${pxTorem(10)};
    flex: 0 auto;
    display: flex;
    flex-shrink: 0;
    padding: 0 ${pxTorem(16)};
    align-items: center;

    font-weight: 600;
    user-select: none;

    height: var(--header-height);

    color: var(--foreground);
    background-size: cover !important;
    background-position: center !important;

    svg {
        flex-shrink: 0;
    }

    ${(props) =>
        props.withTransparency
            ? css`
                  background-color: rgba(
                      var(--${props.palette}-header-rgb),
                      max(var(--min-opacity), 0.75)
                  );
                  backdrop-filter: blur(${pxTorem(20)});

                  width: 100%;
                  z-index: 20;
                  position: absolute;
              `
            : css`
                  background-color: var(--${props.palette}-header);
              `}

    ${(props) =>
        props.withBackground &&
        css`
            align-items: flex-end;
            height: ${pxTorem(120)} !important;

            text-shadow: 0px 0px ${pxTorem(1)} black;
        `}

    ${(props) =>
        props.topBorder &&
        css`
            border-start-start-radius: ${pxTorem(8)};
        `}

    ${(props) =>
        props.bottomBorder &&
        css`
            border-end-start-radius: ${pxTorem(8)};
        `}
`;

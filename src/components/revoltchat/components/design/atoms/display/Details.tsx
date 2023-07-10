import styled, { css } from "styled-components";
import { remTorem, pxTorem } from '../../../../lib/calculation';

export interface Props {
    sticky?: boolean;
    large?: boolean;
}

export const Details = styled.details<Props>`
    // ! FIXME: clean up CSS
    summary {
        ${(props) =>
        props.sticky &&
        css`
                top: ${pxTorem(-1)};
                z-index: 10;
                position: sticky;
            `}

        ${(props) =>
        props.large &&
        css`
                /*padding: 5px 0;*/
                background: var(--primary-background);
                color: var(--secondary-foreground);

                .padding {
                    /*TOFIX: make this applicable only for the friends list menu, DO NOT REMOVE.*/
                    display: flex;
                    align-items: center;
                    padding: ${pxTorem(5)} 0;
                    margin: 0.8em 0px 0.4em;
                    cursor: pointer;
                }
            `}

        outline: none;
        cursor: pointer;
        list-style: none;
        user-select: none;
        align-items: center;
        transition: 0.2s opacity;

        font-size: ${remTorem(0.75)};
        font-weight: 600;
        text-transform: uppercase;

        &::marker,
        &::-webkit-details-marker {
            display: none;
        }

        .title {
            flex-grow: 1;
            margin-top: ${pxTorem(1)};
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .padding {
            display: flex;
            align-items: center;

            > svg {
                flex-shrink: 0;
                margin-inline-end: ${pxTorem(4)};
                transition: 0.2s ease transform;
            }
        }

        gap: ${pxTorem(4)};
        display: flex;
        align-items: center;
    }

    &:not([open]) {
        summary {
            opacity: 0.7;
        }

        summary svg {
            transform: rotateZ(-90deg);
        }
    }
`;

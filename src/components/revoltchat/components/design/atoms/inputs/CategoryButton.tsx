import React from "react";
import styled, { css } from "styled-components";
import { ChevronRight, LinkExternal } from "@styled-icons/boxicons-regular";
import { pxTorem, remTorem } from '../../../../lib/calculation';

interface BaseProps {
    // ! FIXME: Use Pick<>
    // figure out wtf largeDesc and hover are
    readonly account?: boolean;
    readonly disabled?: boolean;
    readonly largeDescription?: boolean;
}

const Base = styled.a<BaseProps>`
    // ! FIXME: clean up CSS
    padding: ${pxTorem(9.8)} ${pxTorem(12)};
    border-radius: var(--border-radius);
    margin-bottom: ${pxTorem(10)};
    color: var(--foreground);
    background: var(--secondary-header);
    gap: ${pxTorem(12)};
    display: flex;
    align-items: center;
    flex-direction: row;

    > svg {
        flex-shrink: 0;
    }

    .content {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        font-weight: 600;
        font-size: ${remTorem(0.875)};

        .title {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }

        .description {
            ${(props) =>
        props.largeDescription
            ? css`
                          font-size: ${remTorem(0.875)};
                      `
            : css`
                          font-size: ${remTorem(0.6875)};
                      `}

            font-weight: 400;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            color: var(--secondary-foreground);

            a:hover {
                text-decoration: underline;
            }
        }
    }

    ${(props) =>
        props.disabled
            ? css`
                  opacity: 0.4;
                  /*.content,
            .action {
                color: var(--tertiary-foreground);
            }*/

                  .action {
                      font-size: ${remTorem(0.875)};
                  }
              `
            : css`
                  cursor: pointer;
                  opacity: 1;
                  transition: 0.1s ease background-color;

                  &:hover {
                      background: var(--secondary-background);
                  }
              `}

    ${(props) =>
        props.account &&
        css`
            height: ${pxTorem(54)};

            .content {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                .title {
                    text-transform: uppercase;
                    font-size: ${remTorem(0.75)};
                    color: var(--secondary-foreground);
                }

                .description {
                    font-size: ${remTorem(0.9375)};
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }
        `}
`;

export interface Props extends BaseProps {
    readonly icon?: React.ReactNode;
    readonly children?: React.ReactNode;
    readonly description?: React.ReactNode;

    readonly onClick?: () => void;
    readonly action?: "chevron" | "external" | React.ReactNode;
}

export function CategoryButton({
    icon,
    children,
    description,
    account,
    disabled,
    onClick,
    action,
}: Props) {
    return (
        <Base onClick={onClick} disabled={disabled} account={account}>
            {icon}
            <div className="content">
                <div className="title">{children}</div>

                <div className="description">{description}</div>
            </div>
            <div className="action">
                {typeof action === "string" ? (
                    action === "chevron" ? (
                        <ChevronRight size={24} />
                    ) : (
                        <LinkExternal size={20} />
                    )
                ) : (
                    action
                )}
            </div>
        </Base>
    );
}

import React from "react";
import styled, { css } from "styled-components";
import { InfoCircle } from "@styled-icons/boxicons-solid";
import { remTorem, pxTorem, numTonum } from '../../../../lib/calculation';

interface Props {
    readonly palette?: "primary" | "success" | "warning" | "error";
    readonly children: React.ReactNode;
}

export const TipBase = styled.div<Omit<Props, "children">>`
    display: flex;
    gap: ${pxTorem(10)};
    padding: ${pxTorem(12)};
    font-size: ${remTorem(0.875)};
    font-weight: 500;
    overflow: hidden;
    background: var(--primary-header);
    border-radius: var(--border-radius);
    user-select: none;

    a {
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }

    svg {
        flex-shrink: 0;
    }

    ${(props) =>
        props.palette && props.palette !== "primary"
            ? css`
                  background: var(--${props.palette});
                  color: var(--${props.palette}-contrast);
                  border: ${pxTorem(2)} solid rgba(var(--${props.palette}-rgb), 0.8);
              `
            : css`
                  color: var(--foreground);
                  border: ${pxTorem(2)} solid var(--secondary-header);
              `}
`;

export function Tip(props: Props) {
    const { children, ...innerProps } = props;
    return (
        <TipBase {...innerProps}>
            <InfoCircle size={numTonum(20)} />
            {children}
        </TipBase>
    );
}

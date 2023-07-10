import React from "react";
import styled from "styled-components";
import { remTorem, pxTorem } from '../../../../lib/calculation';

const Base = styled.span`
    gap: ${pxTorem(6)};
    display: flex;
    align-items: center;
    flex-direction: row;
    color: var(--foreground);

    .error {
        font-weight: 600;
        color: var(--error);
    }
`;

export interface Props {
    error?: React.ReactNode;
    children?: React.ReactNode;
}

export function Error({ error, children }: Props) {
    return (
        <Base>
            {children}
            <span className="error">
                {children && error && <> &middot; </>}
                {error}
            </span>
        </Base>
    );
}

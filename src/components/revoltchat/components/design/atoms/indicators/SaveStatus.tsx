import React from "react";
import styled from "styled-components";
import { Pencil } from "@styled-icons/boxicons-solid";
import { Check, CloudUpload } from "@styled-icons/boxicons-regular";
import { numTonum, pxTorem } from '../../../../lib/calculation';

const Base = styled.div`
    display: flex;
    align-items: center;
    gap: ${pxTorem(8)};
    padding: ${pxTorem(4)};
    font-weight: 500;
    color: var(--foreground);
    text-transform: capitalize;
    user-select: none;
`;

export type EditStatus = "saved" | "editing" | "saving";
interface Props {
    status: EditStatus;
}

export function SaveStatus({ status }: Props) {
    return (
        <Base>
            {status === "saved" ? (
                <Check size={numTonum(20)} />
            ) : status === "editing" ? (
                <Pencil size={numTonum(20)} />
            ) : (
                <CloudUpload size={numTonum(20)} />
            )}
            {/* FIXME: add i18n */}
            <span>{status}</span>
        </Base>
    );
}

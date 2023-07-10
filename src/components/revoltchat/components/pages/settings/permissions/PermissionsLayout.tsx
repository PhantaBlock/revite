import React, { useState } from "react";
import styled from "styled-components";
import { Props as RoleListProps, RoleList } from "./RoleList";
import { numTonum, pxTorem, remTorem } from '../../../../lib/calculation';

const Base = styled.div`
    gap: ${pxTorem(24)};
    padding: ${pxTorem(8)};
    display: flex;

    > :nth-child(1) {
        width: ${pxTorem(120)};
        flex-shrink: 0;
    }

    > :nth-child(2) {
        flex-grow: 1;
    }
`;

export type Props = Omit<
    RoleListProps,
    "server" | "showDefault" | "selected" | "onSelect"
> & {
    editor: React.FC<{ selected: string }>;
    server?: RoleListProps["server"];
    channel?: {
        server?: RoleListProps["server"];
    };
};

/**
 * Component to add a role list sidebar to a role editor
 */
export function PermissionsLayout({
    channel,
    server: givenServer,
    editor: Editor,
    ...listProps
}: Props) {
    const [selected, setSelected] = useState("default");

    const editor = <Editor selected={selected} />;
    const server = givenServer ?? channel?.server;

    return server ? (
        <Base>
            <RoleList
                showDefault
                server={server}
                selected={selected}
                onSelect={setSelected}
                {...listProps}
            />
            {editor}
        </Base>
    ) : (
        editor
    );
}

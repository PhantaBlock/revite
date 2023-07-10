import { HelpCircle } from "@styled-icons/boxicons-solid";
import { observer } from "mobx-react-lite";
import React from "react";
import { User } from "revolt.js";
import styled from "styled-components";

import { useUI } from "../../../../lib";

import { Button, Avatar, Column, H1, Row, Tooltip } from "../../../design";
import { numTonum, pxTorem, remTorem } from '../../../../lib/calculation';

const UserId = styled.div`
    gap: ${pxTorem(4)};
    display: flex;
    align-items: center;
    font-size: ${pxTorem(12)};
    font-weight: 600;
    color: var(--tertiary-foreground);

    a {
        color: var(--tertiary-foreground);
    }
`;

export interface Props {
    /**
     * User object
     */
    user: User;
}

/**
 * Account information header component
 */
export const AccountDetail = observer(({ user }: Props) => {
    const { Link, Text, emitAction } = useUI();

    return (
        <Row gap={`${pxTorem(16)}`} centred>
            <Link to="/settings/profile" replace>
                <Avatar
                    src={user.generateAvatarURL({
                        max_side: numTonum(256),
                    })}
                    size={numTonum(72)}
                    interactive
                />
            </Link>
            <Row grow>
                <Column>
                    <H1>
                        {user.username}
                        {"#"}
                        {
                            (user as never as { discriminator: string })
                                .discriminator
                        }
                    </H1>
                    <UserId>
                        <Tooltip
                            content={
                                <Text id="app.settings.pages.account.unique_id" />
                            }>
                            <HelpCircle size={numTonum(16)} />
                        </Tooltip>
                        <Tooltip content={<Text id="app.special.copy" />}>
                            <a
                                onClick={() =>
                                    emitAction({
                                        type: "WriteClipboard",
                                        text: user._id,
                                    })
                                }>
                                {user._id}
                            </a>
                        </Tooltip>
                    </UserId>
                </Column>
            </Row>
            <Link to="/settings/profile" replace>
                <Button palette="secondary">
                    <Text id="app.settings.pages.profile.edit_profile" />
                </Button>
            </Link>
        </Row>
    );
});

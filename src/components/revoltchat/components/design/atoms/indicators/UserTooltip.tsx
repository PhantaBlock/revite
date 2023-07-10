import React from "react";
import { User } from "revolt.js";
import styled from "styled-components";
import { numTonum, pxTorem, remTorem } from '../../../../lib/calculation';

import { Tooltip, TooltipProps } from "./Tooltip";

const Base = styled.div`
    display: flex;
    flex-direction: column;

    .username {
        font-size: ${pxTorem(13)};
        font-weight: 600;
    }

    .username-new {
        font-size: ${pxTorem(11)};
        font-weight: 600;
        color: var(--secondary-foreground);
    }

    .status {
        font-size: ${pxTorem(11)};
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
`;

type Props = Omit<TooltipProps, "content"> & {
    /**
     * User to display
     */
    user: User;
};

/**
 * User tooltip component
 */
export function UserTooltip({ user, ...props }: Props) {
    return (
        <Tooltip
            {...props}
            content={
                <Base>
                    <span className="username">
                        {(user as unknown as { display_name: string })
                            .display_name ?? user.username}
                    </span>
                    <span className="username-new">
                        {user.username}
                        {"#"}
                        {
                            (user as unknown as { discriminator: string })
                                .discriminator
                        }
                    </span>
                    <span className="status">{user.status?.presence}</span>
                </Base>
            }
        />
    );
}

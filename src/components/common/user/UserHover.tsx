import { User } from "revolt.js";
import styled from "styled-components/macro";

import Tooltip from "../Tooltip";
import { Username } from "./UserShort";
import UserStatus from "./UserStatus";
import { Header, IconButton } from "../../../components/revoltchat";
import { remTorem, pxTorem, numTonum } from '../../../lib/calculation';

interface Props {
    user?: User;
    children: Children;
}

const Base = styled.div`
    display: flex;
    flex-direction: column;

    .username {
        font-size: ${pxTorem(13)};
        font-weight: 600;
    }

    .status {
        font-size: ${pxTorem(11)};
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .tip {
        display: flex;
        align-items: center;
        gap: ${pxTorem(4)};
        margin-top: ${pxTorem(2)};
        color: var(--secondary-foreground);
    }
`;

export default function UserHover({ user, children }: Props) {
    return (
        <Tooltip
            placement="right-end"
            content={
                <Base>
                    <Username className="username" user={user} />
                    <span className="status">
                        <UserStatus user={user} />
                    </span>
                    {/*<div className="tip"><InfoCircle size={13}/>Right-click on the avatar to access the quick menu</div>*/}
                </Base>
            }>
            {children}
        </Tooltip>
    );
}

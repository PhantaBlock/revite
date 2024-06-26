import { User } from "revolt.js";

import { Checkbox, Row, Column } from "../../../components/revoltchat";
import { remTorem, pxTorem, numTonum } from '../../../lib/calculation';

import UserIcon from "./UserIcon";
import { Username } from "./UserShort";

type UserProps = { value: boolean; onChange: (v: boolean) => void; user: User };

export default function UserCheckbox({ user, ...props }: UserProps) {
    return (
        <Checkbox
            {...props}
            title={
                <Row centred>
                    <UserIcon target={user} size={numTonum(32)} />
                    <Column centred>
                        <Username user={user} />
                    </Column>
                </Row>
            }
        />
    );
}

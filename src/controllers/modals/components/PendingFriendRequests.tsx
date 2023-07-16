import { Text } from "preact-i18n";

import { Column, Modal } from '../../../components/revoltchat';

import { Friend } from "../../../pages/friends/Friend";
import { ModalProps } from "../types";

export default function PendingFriendRequests({
    users,
    ...props
}: ModalProps<"pending_friend_requests">) {
    return (
        <Modal
            width="40.625rem"
            {...props}
            title={<Text id="app.special.friends.pending" />}>
            <Column>
                {users.map((x) => (
                    <Friend user={x!} key={x!._id} />
                ))}
            </Column>
        </Modal>
    );
}

import { Text } from "preact-i18n";

import { Column, Modal } from '../../../components/revoltchat';

import { Friend } from "../../../pages/friends/Friend";
import { ModalProps } from "../types";
import { px2orem, remTorem, numTonum } from '../../../lib/calculation';

export default function PendingFriendRequests({
    users,
    ...props
}: ModalProps<"pending_friend_requests">) {
    return (
        <Modal {...props}
            maxHeight={px2orem(878)}
            title={<Text id="app.special.friends.pending" />}>
            <Column>
                {users.map((x) => (
                    <Friend user={x!} key={x!._id} pendingMode />
                ))}
            </Column>
        </Modal >
    );
}

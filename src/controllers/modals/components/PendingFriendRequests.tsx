import { Text } from "preact-i18n";

import { Column, Modal } from '../../../components/revoltchat';

import { Friend } from "../../../pages/friends/Friend";
import { ModalProps } from "../types";
import { pxTorem, remTorem, numTonum } from '../../../lib/calculation';

export default function PendingFriendRequests({
    users,
    ...props
}: ModalProps<"pending_friend_requests">) {
    return (
        <Modal {...props}
            maxWidth={pxTorem(977)}
            maxHeight={pxTorem(878)}
            title={<Text id="app.special.friends.pending" />}>
            <Column>
                {users.map((x) => (
                    <Friend user={x!} key={x!._id} />
                ))}
            </Column>
        </Modal>
    );
}

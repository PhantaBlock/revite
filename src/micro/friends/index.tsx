import { useEffect, useState } from "preact/compat";
import { observer } from "mobx-react-lite";
import { TextChannel } from "../../pages/channels/Channel";
import { useClient } from "../../controllers/client/ClientController";
import Friends from "../../pages/friends/Friends";

export default observer(({ onInviteFriend }: {
    onInviteFriend: (userId: string) => void;
}) => {
    return (
        <div style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Friends onInviteFriend={onInviteFriend} />
        </div>
    );
});
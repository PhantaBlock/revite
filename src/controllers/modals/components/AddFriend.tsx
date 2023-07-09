import { Text } from "preact-i18n";

import { ModalForm } from '../../src';

import { noop } from "../../../lib/js";

import { useClient } from "../../client/ClientController";
import { ModalProps } from "../types";

/**
 * Add friend modal
 */
export default function AddFriend({ ...props }: ModalProps<"add_friend">) {
    const client = useClient();

    return (
        <ModalForm
            {...props}
            title="添加好友"
            schema={{
                username: "text",
            }}
            data={{
                username: {
                    field: "用户名",
                    placeholder: "",
                },
            }}
            callback={({ username }) =>
                client.api.post(`/users/friend`, { username }).then(noop)
            }
            actions={[{
                onClick: () => true,
                children: "取消",
                palette: "plain",
            }]}
            submit={{
                children: <Text id="app.special.modals.actions.ok" />,
            }}
        />
    );
}

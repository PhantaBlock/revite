import { Text } from "preact-i18n";

import { ModalForm } from '../../../components/revoltchat';

import { noop } from "../../../lib/js";

import { useClient } from "../../client/ClientController";
import { ModalProps } from "../types";
import { pxTorem, remTorem } from "../../../lib/calculation";
import { css } from "styled-components";

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
                    field: "",
                    placeholder: "输入玩家ID/名称",

                    style: {
                        marginTop: pxTorem(50),
                        marginBottom: pxTorem(40),
                        color: '#FFE1B3',
                        border: `${pxTorem(2)} solid`,
                        borderImage: `linear-gradient(180deg, #FFBE5A, rgba(255, 226, 119, 0.3)) 1 / 1 / 0 stretch`,
                    }
                },
            }}
            callback={({ username }) =>
                client.api.post(`/users/friend`, { username }).then(noop)
            }
            actions={[
                // {
                //     onClick: () => true,
                //     children: "取消",
                //     palette: "plain",
                // }
            ]}
            submit={{
                children: <div style={{ zIndex: 1, width: pxTorem(160)}} > <Text id="app.special.modals.actions.add_now" /></ div>,
            }}
        />
    );
}

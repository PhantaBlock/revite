import styled from "styled-components";

import { Text } from "preact-i18n";
import { useMemo, useState } from "preact/hooks";

import { Modal } from "../../../components/revoltchat/components/design";

import UserCheckbox from "../../../components/common/user/UserCheckbox";
import { pxTorem, numTonum } from "../../../lib/calculation";
import { useClient } from "../../client/ClientController";
import { ModalProps } from "../types";

const List = styled.div`
    max-width: 100%;
    max-height: ${pxTorem(360)};
    overflow-y: scroll;
`;

export default function UserPicker({
    callback,
    omit,
    ...props
}: ModalProps<"user_picker">) {
    const [selected, setSelected] = useState<string[]>([]);
    const omitted = useMemo(
        () => new Set([...(omit || []), "00000000000000000000000000"]),
        [omit],
    );

    const client = useClient();

    return (
        <Modal
            {...props}
            title={<Text id="app.special.popovers.user_picker.select" />}
            actions={[
                {
                    children: <Text id="app.special.modals.actions.ok" />,
                    onClick: () => callback(selected).then(() => true),
                    confirmation: true
                },
            ]}>
            <List>
                {[...client.users.values()]
                    .filter(
                        (x) =>
                            x &&
                            x.relationship === "Friend" &&
                            !omitted.has(x._id),
                    )
                    .map((x) => (
                        <UserCheckbox
                            key={x._id}
                            user={x}
                            value={selected.includes(x._id)}
                            onChange={(v) => {
                                if (v) {
                                    setSelected([...selected, x._id]);
                                } else {
                                    setSelected(
                                        selected.filter((y) => y !== x._id),
                                    );
                                }
                            }}
                        />
                    ))}
            </List>
        </Modal>
    );
}

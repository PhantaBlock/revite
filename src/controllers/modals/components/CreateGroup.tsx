import { useHistory } from "react-router-dom";

import { Text } from "preact-i18n";

import { ModalForm } from "../../src";

import { useClient } from "../../client/ClientController";
import { mapError } from "../../client/jsx/error";
import { ModalProps } from "../types";

/**
 * Group creation modal
 */
export default function CreateGroup({ ...props }: ModalProps<"create_group">) {
    const history = useHistory();
    const client = useClient();

    return (
        <ModalForm
            {...props}
            title={<Text id="app.main.groups.create" />}
            schema={{
                name: "text",
            }}
            data={{
                name: {
                    field: (
                        <Text id="app.main.groups.name" />
                    ) as React.ReactChild,
                },
            }}
            callback={async ({ name }) => {
                const group = await client.channels
                    .createGroup({
                        name,
                        users: [],
                    })
                    .catch(mapError);
                try {
                    history.push(`/channel/${group._id}`);
                } catch (error) {
                    window.location.hash = `#/channel/${group._id}`;
                }
            }}
            actions={[{
                onClick: () => true,
                children: "取消",
                palette: "plain",
            }]}
            submit={{
                children: <Text id="app.special.modals.actions.create" />,
            }}
        />
    );
}

import { observer } from "mobx-react-lite";
import { Channel } from "revolt.js";
import styled from "styled-components/macro";

import { Text } from "preact-i18n";
import { IconButton } from "../../../../components/revoltchat";
import { remTorem, pxTorem, numTonum } from '../../../../lib/calculation';

interface Props {
    channel: Channel;
}

const Base = styled.div`
    position: relative;

    > div {
        height: ${pxTorem(26)};
        top: ${pxTorem(-26)};
        position: absolute;
        font-size: ${pxTorem(13)};
        gap: ${pxTorem(8)};
        display: flex;
        padding: 0 ${pxTorem(10)};
        user-select: none;
        align-items: center;
        flex-direction: row;
        width: calc(100% - var(--scrollbar-thickness));
        color: var(--secondary-foreground);
        background-color: rgba(
            var(--secondary-background-rgb),
            max(var(--min-opacity), 0.75)
        );
        backdrop-filter: blur(${pxTorem(10)});
    }

    .avatars {
        display: flex;

        img {
            width: ${pxTorem(16)};
            height: ${pxTorem(16)};
            object-fit: cover;
            border-radius: var(--border-radius-half);
            background: var(--secondary-background);
            //background-clip: border-box;
            border: ${pxTorem(2)} solid var(--secondary-background);

            &:not(:first-child) {
                margin-left: ${pxTorem(-6)};
            }
        }
    }

    .usernames {
        min-width: 0;
        font-size: ${pxTorem(13)};
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        //font-weight: 600;
    }
`;

export default observer(({ channel }: Props) => {
    const users = channel.typing.filter(
        (x) =>
            typeof x !== "undefined" &&
            x._id !== x.client.user!._id &&
            x.relationship !== "Blocked",
    );

    if (users.length > 0) {
        users.sort((a, b) =>
            a!._id.toUpperCase().localeCompare(b!._id.toUpperCase()),
        );

        let text;
        if (users.length >= 5) {
            text = <Text id="app.main.channel.typing.several" />;
        } else if (users.length > 1) {
            const userlist = [...users].map(
                (x) => x!.display_name ?? x!.username,
            );
            const user = userlist.pop();

            text = (
                <Text
                    id="app.main.channel.typing.multiple"
                    fields={{
                        user,
                        userlist: userlist.join(", "),
                    }}
                />
            );
        } else {
            text = (
                <Text
                    id="app.main.channel.typing.single"
                    fields={{
                        user: users[0]!.display_name ?? users[0]!.username,
                    }}
                />
            );
        }

        return (
            <Base>
                <div>
                    <div className="avatars">
                        {users.map((user) => (
                            <img
                                key={user!._id}
                                loading="eager"
                                src={user!.generateAvatarURL({ max_side: 256 })}
                            />
                        ))}
                    </div>
                    <div className="usernames">{text}</div>
                </div>
            </Base>
        );
    }

    return null;
});

import { Pencil } from "@styled-icons/boxicons-regular";
import { observer } from "mobx-react-lite";
import styled from "styled-components/macro";
import { InputBox } from "../../../../components/revoltchat";
import { remTorem, pxTorem, numTonum } from '../../../../lib/calculation';

import { useDebounceCallback } from "../../../../lib/debounce";

import { useApplicationState } from "../../../../mobx/State";

import { Variables } from "../../../../context/Theme";

const Container = styled.div`
    row-gap: ${pxTorem(8)};
    display: grid;
    column-gap: ${pxTorem(16)};
    grid-template-columns: repeat(auto-fill, minmax(${pxTorem(200)}, 1fr));
    margin-bottom: ${pxTorem(20)};

    .entry {
        padding: ${pxTorem(12)};
        margin-top: ${pxTorem(8)};
        border: ${pxTorem(1)} solid black;
        border-radius: var(--border-radius);

        span {
            flex: 1;
            display: block;
            font-weight: 600;
            font-size: ${remTorem(0.875)};
            margin-bottom: ${pxTorem(8)};
            text-transform: capitalize;

            background: inherit;
            background-clip: text;
            -webkit-background-clip: text;
        }

        .override {
            gap: ${pxTorem(8)};
            display: flex;

            .picker {
                width: ${pxTorem(38)};
                height: ${pxTorem(38)};
                display: grid;
                cursor: pointer;
                place-items: center;
                border-radius: var(--border-radius);
                background: var(--primary-background);
            }

            input[type="text"] {
                width: 0;
                min-width: 0;
                flex-grow: 1;
            }
        }

        .input {
            width: 0;
            height: 0;
            position: relative;

            input {
                opacity: 0;
                border: none;
                display: block;
                cursor: pointer;
                position: relative;

                top: ${pxTorem(48)};
            }
        }
    }
`;

export default observer(() => {
    const theme = useApplicationState().settings.theme;
    const setVariable = useDebounceCallback(
        (data) => {
            const { key, value } = data as { key: Variables; value: string };
            theme.setVariable(key, value);
        },
        [theme],
        100,
    );

    return (
        <Container>
            {(
                [
                    "accent",
                    "background",
                    "foreground",
                    "primary-background",
                    "primary-header",
                    "secondary-background",
                    "secondary-foreground",
                    "secondary-header",
                    "tertiary-background",
                    "tertiary-foreground",
                    "block",
                    "message-box",
                    "mention",
                    "scrollbar-thumb",
                    "scrollbar-track",
                    "status-online",
                    "status-away",
                    "status-busy",
                    "status-streaming",
                    "status-invisible",
                    "success",
                    "warning",
                    "error",
                    "hover",
                ] as const
            ).map((key) => (
                <div
                    className="entry"
                    key={key}
                    style={{ backgroundColor: theme.getVariable(key) }}>
                    <div className="input">
                        <input
                            type="color"
                            value={theme.getVariable(key)}
                            onChange={(el) =>
                                setVariable({
                                    key,
                                    value: el.currentTarget.value,
                                })
                            }
                        />
                    </div>
                    <span
                        style={{
                            color: theme.getContrastingVariable(
                                key,
                                theme.getVariable("primary-background"),
                            ),
                        }}>
                        {key}
                    </span>
                    <div className="override">
                        <div
                            className="picker"
                            onClick={(e) =>
                                e.currentTarget.parentElement?.parentElement
                                    ?.querySelector("input")
                                    ?.click()
                            }>
                            <Pencil size={numTonum(24)} />
                        </div>
                        <InputBox
                            type="text"
                            className="text"
                            value={theme.getVariable(key)}
                            onChange={(el) =>
                                setVariable({
                                    key,
                                    value: el.currentTarget.value,
                                })
                            }
                        />
                    </div>
                </div>
            ))}
        </Container>
    );
});

import React, { useRef } from "react";
import styled, { css } from "styled-components";
import { Check } from "@styled-icons/boxicons-regular";
import { Palette } from "@styled-icons/boxicons-solid";
import { useDebounceCallback } from "../../../../lib/debounce";
import { numTonum, pxTorem, remTorem } from '../../../../lib/calculation';

interface Props {
    readonly presets?: string[][];

    readonly value: string;
    readonly onChange: (value: string) => void;
}

const DEFAULT_PRESETS = [
    [
        "#7B68EE",
        "#3498DB",
        "#1ABC9C",
        "#F1C40F",
        "#FF7F50",
        "#FD6671",
        "#E91E63",
        "#D468EE",
    ],
    [
        "#594CAD",
        "#206694",
        "#11806A",
        "#C27C0E",
        "#CD5B45",
        "#FF424F",
        "#AD1457",
        "#954AA8",
    ],
];

const Base = styled.div`
    display: flex;

    input {
        width: 0;
        padding: 0;
        border: 0;
        margin: 0;
        height: 0;
        top: ${pxTorem(72)};
        opacity: 0;
        position: relative;
        pointer-events: none;
    }

    .overlay {
        position: relative;
        width: 0;

        div {
            width: ${pxTorem(8)};
            height: ${pxTorem(68)};
            background: linear-gradient(
                to right,
                var(--primary-background),
                transparent
            );
        }
    }
`;

const Swatch = styled.div<{ type: "small" | "large"; colour: string }>`
    flex-shrink: 0;
    cursor: pointer;
    border: ${pxTorem(2)} solid transparent;
    border-radius: var(--border-radius);
    background-color: ${(props) => props.colour};

    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.1s ease-in-out all;

    &:hover {
        border: ${pxTorem(2)} solid var(--foreground);
    }

    svg {
        transition: inherit;
        color: var(--accent-contrast);
    }

    ${(props) =>
        props.type === "small"
            ? css`
                  width: ${pxTorem(30)};
                  height: ${pxTorem(30)};
              `
            : css`
                  width:${pxTorem(68)};
                  height:${pxTorem(68)};
              `}
`;

const Rows = styled.div`
    gap: ${pxTorem(8)};
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding-bottom: ${pxTorem(4)};

    > div {
        gap: ${pxTorem(8)};
        display: flex;
        flex-direction: row;
        padding-inline-start: ${pxTorem(8)};
    }
`;

export function ColourSwatches({ value, onChange, presets }: Props) {
    const ref = useRef<HTMLInputElement | null>(null!);
    const setValue = useDebounceCallback(
        (value) => onChange(value as string),
        [onChange],
        100,
    );

    return (
        <Base>
            <input
                ref={ref}
                type="color"
                value={value}
                onChange={(ev) => setValue(ev.currentTarget.value)}
            />
            <Swatch
                colour={value}
                type="large"
                onClick={() => ref.current?.click()}>
                <Palette size={numTonum(32)} />
            </Swatch>

            <div className="overlay">
                <div />
            </div>

            <Rows>
                {(presets ?? DEFAULT_PRESETS).map((row, i) => (
                    <div key={i}>
                        {row.map((swatch, i) => (
                            <Swatch
                                colour={swatch}
                                type="small"
                                key={i}
                                onClick={() => onChange(swatch)}>
                                {swatch === value && <Check size={numTonum(22)} />}
                            </Swatch>
                        ))}
                    </div>
                ))}
            </Rows>
        </Base>
    );
}

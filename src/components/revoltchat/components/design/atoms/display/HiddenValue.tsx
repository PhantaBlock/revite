import React, { useState } from "react";
import styled from "styled-components";
import { useText } from "../../../../lib";
import { remTorem, pxTorem } from '../../../../lib/calculation';

const Toggle = styled.a`
    font-size: ${pxTorem(13)}
`;

interface Props {
    /**
     * Actual value to show
     */
    value: string;

    /**
     * Placeholder value when hidden
     */
    placeholder: string;
}

export function HiddenValue({ value, placeholder }: Props) {
    const [shown, set] = useState(false);
    const Text = useText();

    return (
        <>
            {shown ? value : placeholder}{" "}
            <Toggle
                onClick={(ev) => {
                    ev.stopPropagation();
                    set(!shown);
                }}>
                <Text
                    id={`app.special.modals.actions.${
                        shown ? "hide" : "reveal"
                    }`}
                />
            </Toggle>
        </>
    );
}

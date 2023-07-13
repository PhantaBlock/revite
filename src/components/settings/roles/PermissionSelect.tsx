import { Lock } from "@styled-icons/boxicons-solid";
import Long from "long";
import { API, Channel, Member, Server } from "revolt.js";
import { Permission } from "revolt.js";
import styled, { css } from "styled-components";

import { Text } from "preact-i18n";
import { useMemo } from "preact/hooks";

import { Checkbox, OverrideSwitch } from "../../../components/revoltchat";
import { remTorem, pxTorem, numTonum } from '../../../lib/calculation';

interface PermissionSelectProps {
    id: keyof typeof Permission;
    target?: Channel | Server;
    permission: number;
    value: API.OverrideField | number;
    onChange: (value: API.OverrideField | number) => void;
}

type State = "Allow" | "Neutral" | "Deny";

const PermissionEntry = styled.label<{ disabled?: boolean }>`
    gap: ${pxTorem(8)};
    width: 100%;
    margin: ${pxTorem(8)} 0;
    display: flex;
    align-items: center;

    .title {
        flex-grow: 1;

        display: flex;
        flex-direction: column;
    }

    .lock {
        margin-inline-start: ${pxTorem(4)};
    }

    .description {
        font-size: 0.8em;
        color: var(--secondary-foreground);
    }

    ${(props) =>
        props.disabled &&
        css`
            color: var(--tertiary-foreground);
        `}
`;

export function PermissionSelect({
    id,
    permission,
    value,
    onChange,
    target,
}: PermissionSelectProps) {
    const state: State = useMemo(() => {
        if (typeof value === "object") {
            if (Long.fromNumber(value.d).and(permission).eq(permission)) {
                return "Deny";
            }

            if (Long.fromNumber(value.a).and(permission).eq(permission)) {
                return "Allow";
            }

            return "Neutral";
        }
        if (Long.fromNumber(value).and(permission).eq(permission)) {
            return "Allow";
        }

        return "Neutral";

    }, [value]);

    function onSwitch(state: State) {
        if (typeof value !== "object") throw "!";

        // Convert to Long so we can do bitwise ops.
        let allow = Long.fromNumber(value.a);
        let deny = Long.fromNumber(value.d);

        // Clear the current permission value.
        if (allow.and(permission).eq(permission)) {
            allow = allow.xor(permission);
        }

        if (deny.and(permission).eq(permission)) {
            deny = deny.xor(permission);
        }

        // Apply the current permission state.
        if (state === "Allow") {
            allow = allow.or(permission);
        }

        if (state === "Deny") {
            deny = deny.or(permission);
        }

        // Invoke state change.
        onChange({
            a: allow.toNumber(),
            d: deny.toNumber(),
        });
    }

    const member =
        target &&
        (target instanceof Server ? target.member : target.server?.member);

    const disabled = member && !member.hasPermission(target!, id);

    return (
        <PermissionEntry disabled={disabled}>
            <span className="title">
                <span>
                    <Text id={`permissions.${id}.t`}>{id}</Text>
                    {disabled && <Lock className="lock" size={numTonum(14)} />}
                </span>
                <span className="description">
                    <Text id={`permissions.${id}.d`} />
                </span>
            </span>
            {typeof value === "object" ? (
                <OverrideSwitch
                    disabled={disabled}
                    state={state}
                    onChange={onSwitch}
                />
            ) : (
                <Checkbox
                    disabled={disabled}
                    value={state === "Allow"}
                    onChange={() =>
                        onChange(
                            Long.fromNumber(value, false)
                                .xor(permission)
                                .toNumber(),
                        )
                    }
                />
            )}
        </PermissionEntry>
    );
}

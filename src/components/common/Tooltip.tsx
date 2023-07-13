import Tippy, { TippyProps } from "@tippyjs/react";
import styled from "styled-components/macro";

import { Text } from "preact-i18n";
import { remTorem, pxTorem, numTonum } from '../../lib/calculation';

type Props = Omit<TippyProps, "children"> & {
    children: Children;
    content: Children;
};

export default function Tooltip(props: Props) {
    const { children, content, ...tippyProps } = props;

    return (
        <Tippy content={content} animation="shift-away" {...tippyProps}>
            {/*
            // @ts-expect-error Type mis-match. */}
            <div style={`display: flex;`}>{children}</div>
        </Tippy>
    );
}

const PermissionTooltipBase = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;

    span {
        font-size: ${pxTorem(11)};
        font-weight: 700;
        text-transform: uppercase;
        color: var(--secondary-foreground);
    }

    code {
        font-family: var(--monospace-font);
    }
`;

export function PermissionTooltip(
    props: Omit<Props, "content"> & { permission: string },
) {
    const { permission, ...tooltipProps } = props;

    return (
        <Tooltip
            content={
                <PermissionTooltipBase>
                    <span>
                        <Text id="app.permissions.required" />
                    </span>
                    <code>{permission}</code>
                </PermissionTooltipBase>
            }
            {...tooltipProps}
        />
    );
}

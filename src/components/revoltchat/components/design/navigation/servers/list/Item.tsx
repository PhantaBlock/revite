import { observer } from "mobx-react-lite";
import React from "react";
import styled, { css } from "styled-components";
import type { Server } from "revolt.js";
import { DraggableProps } from "../../../../common";

import { Avatar } from "../../../atoms";
import { Unreads } from "../../../atoms/indicators/Unreads";
import { Swoosh } from "./Swoosh";
import { useLink, useTrigger } from "../../../../../lib/context";
import { Tooltip } from "../../../atoms/indicators/Tooltip";
import { INotificationChecker } from "revolt.js/dist/util/Unreads";
import { numTonum, pxTorem, remTorem } from '../../../../../lib/calculation';

export const ItemContainer = styled.div<{ head?: boolean }>`
    width: ${pxTorem(56)};
    padding-left: ${pxTorem(7)};
    padding-right: ${pxTorem(7)};
    padding-bottom: ${pxTorem(6)};

    cursor: pointer;

    ${(props) =>
        props.head &&
        css`
            padding-top: ${pxTorem(6)};
        `}
`;

const SwooshWrapper = styled.div`
    position: absolute;
    left: ${pxTorem(-7)};
    top: ${pxTorem(-32)};

    z-index: -1;
`;

export function SwooshOverlay() {
    return (
        <div style={{ position: "relative" }}>
            <SwooshWrapper>
                <Swoosh />
            </SwooshWrapper>
        </div>
    );
}

const Inner = observer(({ item, permit }: InnerProps) => {
    const Link = useLink();
    const Trigger = useTrigger();
    const unread = !!item.isUnread(permit);
    const count = item.getMentions(permit).length;

    return (
        <Tooltip content={item.name} div right>
            <Trigger id="Menu" data={{ server: item._id, unread }}>
                <Link to={"/server/" + item._id}>
                    <Avatar
                        size={numTonum(42)}
                        interactive
                        fallback={item.name}
                        holepunch={(unread || count > 0) && "top-right"}
                        overlay={<Unreads unread={unread} count={count} />}
                        src={item.generateIconURL({ max_side: numTonum(256) }, false)}
                    />
                </Link>
            </Trigger>
        </Tooltip>
    );
});

export type InnerProps = {
    item: Server;
    permit: INotificationChecker;
};

type Props = DraggableProps<Server> &
    InnerProps & {
        active: boolean;
    };

export function Item({ provided, isDragging, active, ...innerProps }: Props) {
    return (
        <ItemContainer
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={provided.draggableProps.style}>
            {active && <SwooshOverlay />}
            <Inner {...innerProps} />
        </ItemContainer>
    );
}

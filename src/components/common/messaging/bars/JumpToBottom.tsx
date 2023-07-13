import { DownArrowAlt } from "@styled-icons/boxicons-regular";
import { observer } from "mobx-react-lite";
import { Channel } from "revolt.js";
import styled, { css } from "styled-components/macro";

import { Text } from "preact-i18n";

import { internalEmit } from "../../../../lib/eventEmitter";
import { isTouchscreenDevice } from "../../../../lib/isTouchscreenDevice";
import { getRenderer } from "../../../../lib/renderer/Singleton";
import { remTorem, pxTorem, numTonum } from '../../../../lib/calculation';

export const Bar = styled.div<{ position: "top" | "bottom"; accent?: boolean }>`
    z-index: 1;
    position: relative;

    @keyframes bottomBounce {
        0% {
            transform: translateY(${pxTorem(33)});
        }
        100% {
            transform: translateY(0px);
        }
    }

    @keyframes topBounce {
        0% {
            transform: translateY(${pxTorem(-33)});
        }
        100% {
            transform: translateY(0px);
        }
    }

    ${(props) =>
        props.position === "top" &&
        css`
            top: 0;
            animation: topBounce 340ms cubic-bezier(0.2, 0.9, 0.5, 1.16)
                forwards;
        `}

    ${(props) =>
        props.position === "bottom" &&
        css`
            top: ${pxTorem(-28)};
            animation: bottomBounce 340ms cubic-bezier(0.2, 0.9, 0.5, 1.16)
                forwards;

            ${() =>
                isTouchscreenDevice &&
                css`
                    top: ${pxTorem(-90)};
                `}
        `}

    > div {
        height: ${pxTorem(28)};
        width: 100%;
        position: absolute;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: ${pxTorem(12)};
        font-weight: 600;
        padding: 0 ${pxTorem(8)};
        user-select: none;
        justify-content: space-between;
        transition: color ease-in-out 0.08s;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        ${(props) =>
        props.accent
            ? css`
                      color: var(--accent-contrast);
                      background-color: rgba(
                          var(--accent-rgb),
                          max(var(--min-opacity), 0.9)
                      );
                      backdrop-filter: blur(${pxTorem(20)});
                  `
            : css`
                      color: var(--secondary-foreground);
                      background-color: rgba(
                          var(--secondary-background-rgb),
                          max(var(--min-opacity), 0.9)
                      );
                      backdrop-filter: blur(${pxTorem(20)});
                  `}

        ${(props) =>
        props.position === "top"
            ? css`
                      top: ${pxTorem(48)};
                      border-radius: 0 0 var(--border-radius)
                          var(--border-radius);
                  `
            : css`
                      border-radius: var(--border-radius) var(--border-radius) 0
                          0;
                  `}

                  ${() =>
        isTouchscreenDevice &&
        css`
                top: ${pxTorem(56)};
            `}

        > div {
            display: flex;
            align-items: center;
            gap: ${pxTorem(6)};

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &:hover {
            color: var(--primary-text);
        }

        &:active {
            transform: translateY(${pxTorem(1)});
        }

        ${() =>
        isTouchscreenDevice &&
        css`
                height: ${pxTorem(34)};
                padding: 0 ${pxTorem(12)};
            `}
    }

    @media only screen and (max-width: 800px) {
        .right > span {
            display: none;
        }
    }
`;

export default observer(({ channel }: { channel: Channel }) => {
    const renderer = getRenderer(channel);
    if (renderer.state !== "RENDER" || renderer.atBottom) return null;

    return (
        <Bar position="bottom">
            <div
                onClick={() => {
                    renderer.jumpToBottom(true);
                    internalEmit("NewMessages", "hide");
                }}>
                <div>
                    <Text id="app.main.channel.misc.viewing_old" />
                </div>
                <div className="right">
                    <span>
                        <Text id="app.main.channel.misc.jump_present" />
                    </span>
                    <DownArrowAlt size={numTonum(18)} />
                </div>
            </div>
        </Bar>
    );
});

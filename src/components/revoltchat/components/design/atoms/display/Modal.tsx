import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled, { css } from "styled-components";

import {
    animationFadeIn,
    animationFadeOut,
    animationZoomIn,
    animationZoomOut,
} from "../../../common/animations";
import { IconButton } from '../inputs/IconButton';
import { X } from "@styled-icons/boxicons-regular";

import { H2 } from "../heading/H2";
import { H4 } from "../heading/H4";
import { Button, Props as ButtonProps } from "../inputs/Button";
import { pxTorem, remTorem, numTonum, px2orem, num2 } from '../../../../lib/calculation';

export type Action = Omit<React.HTMLAttributes<HTMLButtonElement>, "as"> &
    Omit<ButtonProps, "onClick"> & {
        confirmation?: boolean;
        onClick: () => void | boolean | Promise<boolean>;
    };

export interface Props {
    padding?: string;
    maxWidth?: string;
    maxHeight?: string;

    disabled?: boolean;
    transparent?: boolean;
    nonDismissable?: boolean;

    needPadding?: boolean;
    noMaxSize?: boolean;

    actions?: Action[];
    onClose?: (force: boolean) => void;

    signal?: "close" | "confirm" | "force";
    registerOnClose?: (fn: () => void) => () => void;
    registerOnConfirm?: (fn: () => void) => () => void;

    title?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;

}

const IconButtonWrap = styled.div`
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 1;
    svg {
        color: #FFBE5A;
    }
`

const Base = styled.div<{ closing?: boolean }>`
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    z-index: 9999;
    position: fixed;

    max-height: 100%;
    user-select: none;

    animation-duration: 0.2s;
    animation-fill-mode: forwards;

    display: grid;
    overflow-y: auto;
    place-items: center;

    color: var(--foreground);
    background: rgba(0, 0, 0, 0.8);

    ${(props) =>
        props.closing
            ? css`
                  animation-name: ${animationFadeOut};

                  > div {
                      animation-name: ${animationZoomOut};
                  }
              `
            : css`
                  animation-name: ${animationFadeIn};
              `}
`;

const Container = styled.div<
    Pick<Props, "transparent" | "maxWidth" | "maxHeight" | "noMaxSize"> & { actions: boolean }
>`
    max-width: min(calc(100vw - ${pxTorem(50)}), ${(props) => props.maxWidth ?? '54rem'});

    max-height: min(
        calc(100vh -${pxTorem(20)}),
        ${(props) => props.maxHeight ?? '33rem'}
    );
    width: ${(props) => props.width};
    height: ${(props) => props.height};

    border: ${pxTorem(2)} solid;
    border-image: linear-gradient(180deg, #FFBE5A, rgba(255, 226, 119, 0.3));
    border-image-slice: 1;

    margin: ${pxTorem(20)};
    display: flex;
    flex-direction: column;

    animation-name: ${animationZoomIn};
    animation-duration: 0.25s;
    animation-timing-function: cubic-bezier(0.3, 0.3, 0.18, 1.1);
    background-image: linear-gradient(180deg, rgba(27, 15, 14, 0.9) 1%, rgba(10, 9, 24, 0.5) 99%);
    backdrop-filter: blur(0.625rem);

    ${(props) =>
        props.noMaxSize &&
        css`
            max-height: none !important;
            max-width: none !important;
        `}

    ${(props) =>
        !props.maxWidth &&
        css`
            width: 100%;
        `}

    ${(props) =>
        !props.transparent &&
        css`
            overflow: hidden;
            // background: var(--secondary-header);
            // border-radius: var(--border-radius);
        `}
`;

const Title = styled.div`
    padding: 0 ${remTorem(1)};
    min-height: ${px2orem(182)};
    display: flex;
    justify-content: center;
    font-size: ${px2orem(70)};
    flex-shrink: 0;
    word-break: break-word;
    display: flex;
    flex-direction: column;

    border-bottom: ${pxTorem(1)} solid #FEBD5A;
    color: #FFE1B3;
    font-family: PingFangHK-Regular;
`;

const Content = styled.div<Pick<Props, "transparent" | "padding" | "needPadding">>`
    flex-grow: 1;
    padding-top: 0;
    padding: ${(props) => !props.needPadding ? 0 : props.padding ?? `${remTorem(1)} ${remTorem(2)} ${remTorem(2)}`};

    overflow-y: auto;
    font-size: ${remTorem(0.9375)};

    display: flex;
    flex-direction: column;

    ${(props) =>
        !props.transparent &&
        css`
            // background: var(--secondary-header);
        `}
`;

const Actions = styled.div`
    flex-shrink: 0;
    display: flex;
    padding: ${px2orem(65)} ${px2orem(78)};
    flex-direction: row-reverse;

    // background: var(--secondary-background);
    border-radius: 0 0 var(--border-radius) var(--border-radius);

    border-top: ${pxTorem(1)} solid #FEBD5A;
`;

export const Modal: (props: Props) => JSX.Element = ({
    children,
    actions,
    disabled,
    onClose,
    title,
    description,
    nonDismissable,
    registerOnClose,
    registerOnConfirm,
    signal,
    ...props
}: Props) => {
    const [closing, setClosing] = useState(false);

    const closeModal = useCallback(() => {
        setClosing(true);
        if (!closing) setTimeout(() => onClose?.(true), 2e2);
    }, [closing, props]);

    const confirm = useCallback(async () => {
        if (await actions?.find((x) => x.confirmation)?.onClick?.()) {
            closeModal();
        }
    }, [actions]);

    useEffect(() => registerOnClose?.(closeModal), [closeModal]);
    useEffect(() => registerOnConfirm?.(confirm), [confirm]);

    useEffect(() => {
        if (signal === "confirm") {
            confirm();
        } else if (signal) {
            if (signal === "close" && nonDismissable) {
                return;
            }

            closeModal();
        }
    }, [signal]);

    return createPortal(
        <Base closing={closing} onClick={() => !nonDismissable && closeModal()}>
            <Container
                {...props}
                actions={actions ? actions.length > 0 : false}
                onClick={(e) => e.stopPropagation()}>
                {(title || description) && (
                    <Title>
                        {title && <>{title}</>}
                        {description && <H4>{description}</H4>}
                    </Title>
                )}
                <IconButtonWrap>
                    <IconButton
                        onClick={(e) =>
                            closeModal()
                        }>
                        <X size={numTonum(36)} />
                    </IconButton>
                </IconButtonWrap>
                <Content {...props} needPadding={title !== undefined || description !== undefined}>{children}</Content>
                {actions && actions.length > 0 && (
                    <Actions>
                        {actions.map((x, index) => (
                            // @ts-expect-error cope
                            <Button
                                disabled={disabled}
                                key={index}
                                skyTheme={x.skyTheme}
                                confirmation={x.confirmation}
                                style={x.style}
                                {...x}
                                onClick={async () => {
                                    if (await x.onClick()) {
                                        closeModal();
                                    }
                                }}
                            >
                                <div
                                    style={{
                                        zIndex: 1,
                                        width: `${px2orem(692)}`,
                                        height: `${px2orem(138)}`,
                                        'font-size': `${px2orem(50)}`,
                                        display: 'flex',
                                        'align-items': 'center',
                                        'justify-content': 'center'
                                    }} > {x.children}</div>
                            </Button>
                        ))}
                    </Actions>
                )}
            </Container>
        </Base >,
        document.body,
    );
};

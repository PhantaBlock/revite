import Lottie, { LottieRefCurrentProps } from "lottie-react";

import { useEffect, useRef } from "preact/hooks";

import { Button, Column, InputBox, Modal, Row } from '../../../components/revoltchat';
import { pxTorem, remTorem } from "../../../lib/calculation";

import { useClient } from "../../client/ClientController";
import { modalController } from "../ModalController";
import { ModalProps } from "../types";
import usernameAnim from "./legacy/usernameUpdateLottie.json";

/**
 * Changelog: Username update
 */
export default function ChangelogUsernames({
    onClose,
    signal,
}: ModalProps<"changelog_usernames">) {
    const client = useClient();

    const lottieRef = useRef<LottieRefCurrentProps>();

    useEffect(() => {
        if (lottieRef.current) {
            const timer = setTimeout(() => lottieRef.current!.play(), 2500);
            return () => clearTimeout(timer);
        }
    }, [lottieRef]);

    return (
        <Modal onClose={onClose} signal={signal} transparent>
            {
                (
                    <Column gap="0">
                        <div
                            style={{
                                background: "black",
                                borderStartStartRadius: pxTorem(12),
                                borderStartEndRadius: pxTorem(12),
                                display: "grid",
                                placeItems: "center",
                                padding: "1.5em",
                            }}>
                            <Lottie
                                lottieRef={lottieRef as never}
                                animationData={usernameAnim}
                                autoplay={false}
                                loop={false}
                                style={{ width: pxTorem(240) }}
                            />
                        </div>
                        <div
                            style={{
                                padding: "1em",
                                background: "var(--secondary-header)",
                                textAlign: "center",
                            }}>
                            <Column
                                gap={pxTorem(6)}
                                style={{
                                    alignItems: "center",
                                }}>
                                <span
                                    style={{
                                        fontSize: "1.5em",
                                        fontWeight: 700,
                                        marginBottom: pxTorem(12),
                                    }}>
                                    Usernames are Changing
                                </span>
                                <span
                                    style={{
                                        color: "var(--secondary-foreground)",
                                        fontSize: "0.9em",
                                        fontWeight: 500,
                                    }}>
                                    We've changed how usernames work on Revolt.
                                    Now you can set a display name in addition
                                    to a username with a number tag for easier
                                    sharing.
                                </span>
                                <span
                                    style={{
                                        color: "var(--secondary-foreground)",
                                        fontSize: "0.9em",
                                        fontWeight: 500,
                                    }}>
                                    Here's how your new username looks:
                                </span>
                                <InputBox
                                    value={
                                        client.user!.display_name ??
                                        client.user!.username
                                    }
                                    style={{
                                        maxWidth: pxTorem(180),
                                    }}
                                    disabled
                                />
                                <InputBox
                                    value={
                                        client.user.username +
                                        "#" +
                                        client.user.discriminator
                                    }
                                    style={{
                                        maxWidth: pxTorem(180),
                                    }}
                                    disabled
                                />
                                <a
                                    href="https://revolt.chat/posts/evolving-usernames"
                                    target="_blank">
                                    Read more about this change
                                </a>
                            </Column>
                        </div>
                        <Row
                            style={{
                                padding: "1em",
                                borderEndStartRadius: pxTorem(12),
                                borderEndEndRadius: pxTorem(12),
                                background: "var(--secondary-background)",
                                textAlign: "center",
                                justifyContent: "end",
                            }}>
                            <Button palette="plain" onClick={onClose}>
                                Skip for now
                            </Button>
                            <Button
                                palette="accent"
                                onClick={() => {
                                    modalController.openLink(
                                        "/settings/profile",
                                    );
                                    onClose();
                                }}>
                                Edit Profile
                            </Button>
                        </Row>
                    </Column>
                ) as any
            }
        </Modal>
    );
}

import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { observer } from "mobx-react-lite";
import { Modal, Button } from "@revoltchat/ui";
import { ModalProps } from "../../../controllers/modals/types";
import styles from "./index.module.scss";
import Cls from "classnames";
import { useSession } from "../../../controllers/client/ClientController";
import { FileUploader } from "../../../controllers/client/jsx/legacy/FileUploads";
import { Text } from "preact-i18n";
import TextAreaAutoSize from "../../../lib/TextAreaAutoSize";
import { API } from "revolt.js";
import AutoComplete, {
    useAutoComplete,
} from "../../../components/common/AutoComplete";
import { useTranslation } from "../../../lib/i18n";

const ProfileSetting = observer(({ ...props }: ModalProps<"profile_setting">) => {
    const translate = useTranslation();
    const session = useSession()!;
    const client = session.client!;
    const [profile, setProfile] = useState<undefined | API.UserProfile>(
        undefined,
    );
    const [changed, setChanged] = useState(false);

    const refreshProfile = useCallback(() => {
        client
            .user!.fetchProfile()
            .then((res: any) => setProfile(res ?? {}));
    }, [client.user, setProfile]);

    useEffect(() => {
        if (profile === undefined && session.state === "Online") {
            refreshProfile();
        }
    }, [profile, session.state, refreshProfile]);

    function setContent(content?: string) {
        setProfile({ ...profile, content });
        if (!changed) setChanged(true);
    }

    const {
        onChange,
        onKeyUp,
        onKeyDown,
        onFocus,
        onBlur,
        ...autoCompleteProps
    } = useAutoComplete(setContent, {
        users: { type: "all" },
    });

    const renderContainer = () => {
        return (
            <div className={styles.container}>
                <div className={styles.row}>
                    <div className={styles.pfp}>
                        <h3>头像</h3>
                        <FileUploader
                            width={92}
                            height={92}
                            style="icon"
                            fileType="avatars"
                            behaviour="upload"
                            maxFileSize={4_000_000}
                            onUpload={(avatar) => client.users.edit({ avatar })}
                            remove={() => client.users.edit({ remove: ["Avatar"] })}
                            defaultPreview={client.user!.generateAvatarURL(
                                { max_side: 256 },
                                true,
                            )}
                            previewURL={client.user!.generateAvatarURL(
                                { max_side: 256 },
                                true,
                            )}
                        />
                    </div>
                </div>
                <h3>简介</h3>
                <AutoComplete detached {...autoCompleteProps} />
                <TextAreaAutoSize
                    maxRows={10}
                    minHeight={200}
                    maxLength={2000}
                    value={profile?.content ?? ""}
                    disabled={typeof profile === "undefined"}
                    onChange={(ev) => {
                        onChange(ev);
                        setContent(ev.currentTarget.value);
                    }}
                    placeholder={translate(
                        `app.settings.pages.profile.${typeof profile === "undefined"
                            ? "fetching"
                            : "placeholder"
                        }`,
                    )}
                    onKeyUp={onKeyUp}
                    onKeyDown={onKeyDown}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                <Button
                    className={styles.saveButton}
                    palette="secondary"
                    onClick={() => {
                        setChanged(false);
                        client.users.edit({
                            avatar_url: 'https://skyvs.oss-cn-hangzhou.aliyuncs.com/avatars/default/001.png',
                            profile: {
                                content: profile?.content,
                            },
                            username: '改下名'
                        });
                    }}
                    disabled={!changed}>
                    <Text id="app.special.modals.actions.save" />
                </Button>
            </div>
        )
    };

    return (
        <Modal
            {...props}
            // transparent
            className={Cls(styles.ProfileSetting, styles.rewrite)}
        >
            {renderContainer()}
        </Modal>
    );
});

export default ProfileSetting;
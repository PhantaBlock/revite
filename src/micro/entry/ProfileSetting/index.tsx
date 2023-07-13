import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { observer } from "mobx-react-lite";
import { Modal, Button, InputElement } from '../../../components/revoltchat';
import { remTorem, pxTorem, numTonum } from '../../../lib/calculation';
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
import UserIcon from "../../../components/common/user/UserIcon";

const avatarList = new Array(41).fill('').map((item, index) => {
    const _index = index < 9 ? `0${index + 1}` : index + 1;
    return `https://skyvs.oss-cn-hangzhou.aliyuncs.com/avatars/default/0${_index}.png`;
})

const ProfileSetting = observer(({ ...props }: ModalProps<"profile_setting">) => {
    const translate = useTranslation();
    const session = useSession()!;
    const client = session.client!;
    const [avatar, setAvatar] = useState('');
    const [username, setUsername] = useState('');

    const [profile, setProfile] = useState<undefined | API.UserProfile>(
        undefined,
    );

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

    useEffect(() => {
        if (client.user) {
            client.user.avatar_url && setAvatar(client.user.avatar_url);
            setUsername(client.user.username);
        }
    }, [client.user])

    function setContent(content?: string) {
        setProfile({ ...profile, content });
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
                <div className={styles.header}>
                    <div>编辑资料</div>
                </div>
                <div
                    className={Cls(styles.saveButton, "cusLineation")}
                    onClick={() => {
                        client.users.edit({
                            avatar_url: avatar,
                            profile: {
                                content: profile?.content,
                            },
                            username,
                            token: props.token,
                        }).then(() => {
                            props.onUpdateProfile && props.onUpdateProfile();
                            window.Toast('修改成功');
                        });
                    }}
                >
                    保存
                </div>
                <div className={styles.body}>
                    <div className={styles.column} style={{ flex: '0 0' }}>
                        <UserIcon
                            target={client.user!}
                            size={100}
                            status={false}
                            override={avatar}
                        />
                        <InputElement
                            type="text"
                            value={username}
                            onChange={(v) => setUsername(v)}
                        />
                        <AutoComplete detached {...autoCompleteProps} />
                        <TextAreaAutoSize
                            className={styles.textArea}
                            maxLength={20}
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
                    </div>
                    <div className={styles.column}>
                        <div className={styles.tabWrap}>
                            <div className={styles.tabItem}>头像</div>
                        </div>
                        <div className={styles.avatarList}>
                            {avatarList.map((item => (
                                <div
                                    className={Cls(styles.avatarItem, {
                                        [styles.selected]: item === avatar,
                                    })}
                                    key={item}
                                    onClick={() => {
                                        setAvatar(item);
                                    }}
                                >
                                    <img src={item} alt=" " />
                                </div>
                            )))}
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <Modal
            {...props}
            // transparent
            className={Cls(styles.ProfileSetting, styles.rewrite, "cusLineationBorder")}
        >
            {renderContainer()}
        </Modal>
    );
});

export default ProfileSetting;
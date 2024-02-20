import { useEffect, useRef, useState } from "preact/compat";
import { observer } from "mobx-react-lite";
import { useClient, useSession } from "../../controllers/client/ClientController";
import Friends from "../../pages/friends/Friends";
import MenuAdapter from "../menuAdapter";
import styles from "./index.module.scss";
import UserIcon from "../../components/common/user/UserIcon";
import UserStatus from "../../components/common/user/UserStatus";
import Cls from 'classnames';
import { modalController } from "../../controllers/modals/ModalController";
import { remTorem, pxTorem, numTonum, px2orem } from '../../lib/calculation';

export default observer(({ onInviteFriend, token, onUpdateProfile }: {
    onInviteFriend: (userId: string) => void;
    onUpdateProfile: () => void;
    token: string,
}) => {
    const session = useSession()!;
    const self = session?.client?.user;
    const triedSetAvatar = useRef(false);

    useEffect(() => {
        if (self?.avatar_url === null && !triedSetAvatar.current) {
            triedSetAvatar.current = true;

            // 静默直塞一个默认头像，数据更新依赖webSocket,这里粗暴的加个延时先用下
            setTimeout(() => {
                session?.client?.users.edit({
                    avatar_url: "https://img.war6sky.com/avatars/default/002.png",
                    profile: {},
                    token: token,
                });
            }, 1000);
        }
    }, [self?.avatar_url])

    return (
        <div className={styles.Entry}>
            <div className={styles.userWrap} onClick={() => {
                modalController.push({
                    type: "profile_setting",
                    token,
                    onUpdateProfile,
                });
            }}>
                {!!self && (
                    <>
                        <UserIcon target={self} size={px2orem(140)} status />
                        <div className={styles.name}>
                            <span>{self.username}</span>
                            <span className={styles.subtext}>
                                <UserStatus user={self} />
                            </span>
                        </div>
                    </>
                )}
            </div>
            <div className={styles.tabWrap}>
                <div className={Cls(styles.tabItem, styles.active)}>联系人</div>
            </div>
            <Friends onInviteFriend={onInviteFriend} />
            <MenuAdapter />
        </div>
    );
});
import { useEffect, useState } from "preact/compat";
import { observer } from "mobx-react-lite";
import { useClient, useSession } from "../../controllers/client/ClientController";
import Friends from "../../pages/friends/Friends";
import MenuAdapter from "../menuAdapter";
import styles from "./index.module.scss";
import UserIcon from "../../components/common/user/UserIcon";
import UserStatus from "../../components/common/user/UserStatus";
import Cls from 'classnames';
import { modalController } from "../../controllers/modals/ModalController";

export default observer(({ onInviteFriend }: {
    onInviteFriend: (userId: string) => void;
}) => {
    const session = useSession()!;
    const self = session?.client?.user;

    return (
        <div className={styles.Entry}>
            <div className={styles.userWrap} onClick={() => {
                modalController.push({
                    type: "profile_setting",
                });
            }}>
                {!!self && (
                    <>
                        <UserIcon target={self} size={40} status />
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
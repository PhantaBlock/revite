import styles from './index.module.scss';
import get from 'lodash.get';
import Cls from 'classnames';

enum GameType {
    War3 = 'War3',
    RPG = 'RPG',
    CH3C = 'CH3C'
}

const mapPathMap = {
    [GameType.RPG]: 'game_config.RPG.rpg_map',
    [GameType.War3]: 'game_config.War3.map_config.map',
    [GameType.CH3C]: 'game_config.CH3C.map_config.map',
};

const RequestInvite = ({ author }: { author?: any }) => {
    const isSelf = author?.relationship === 'User';

    const handleClick = () => {
        if (isSelf) return;

        window.__QUERY_MY_ROOM__?.().then(async (res: any) => {
            const { room } = res || {};

            if (!res?.room) {
                throw {
                    errorMsg: '您未处于房间内',
                }
            }

            const channel: any = await author.openDM();

            const map = get(room, (mapPathMap as any)[room.game_type!]);
            const openSlots = (room.slots || []).filter((item: any) => item.settings?.status === 'Open');
            const message = {
                roomId: room.id,
                roomNum: room.room_no || room.id,
                roomName: room.name,
                roomType: room.room_type,
                currentPlayer: room.max_players! - openSlots.length,
                maxPlayer: room.max_players,
                gameType: room.game_type,
                matchMode: get(room, 'game_config.War3.match_mode'),
                mapName: map?.name,
                mapImg: map?.image,
                map,
            };

            await channel.sendMessage(`##ROOM_RECRUIT##${JSON.stringify(message)}`);
        }).catch((error: any) => {
            error?.errorMsg && window.__TOAST__?.(error?.errorMsg);
        });
    };

    return (
        <div className={Cls(styles.RequestInvite, { [styles.isSelf]: isSelf })} onClick={handleClick}>
            <div class={styles.descWrap}>
                <div>{isSelf ? '求邀' : '请求您'}</div>
                <div className={styles.title}>邀请{isSelf ? '我' : 'TA'} 一起玩吧！</div>
            </div>
            {!isSelf && <div className={styles.actionBtn}>邀请</div>}
        </div>
    );
};

export default RequestInvite;
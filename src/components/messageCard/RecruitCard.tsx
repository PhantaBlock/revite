import styles from './index.module.scss';

interface IMessage {
    roomId: number;
    roomName: string;
    roomType: string;
    currentPlayer: number;
    maxPlayer: number;
    gameType: string;
    gameMode: string;
    mapName: string;
    mapImg: string;
}

const RecruitCard = ({ data }: { data: IMessage }) => {
    const handleClick = () => {
        window.__JOIN_ROOM__?.({
            game_type: data.gameType,
            room_id: Number(data.roomId),
        }).then((res: any) => {
            if (window.__SKY__) {
                window.__SKY__.activePage();
                window.__SKY__.postEvent({
                    event: 'JOIN_ROOM',
                    details: res?.room,
                });
            }
        }).catch((error: any) => {
            error?.errorMsg && window.__TOAST__?.(error?.errorMsg);
        });
    };

    return (
        <div className={styles.RecruitCard} onClick={handleClick}>
            <div className={styles.imgWrap}>
                <img src={data.mapImg} alt=" " />
            </div>
            <div className={styles.infoWrap}>
                <div className={styles.mapName}>
                    <div className={styles.ellipsis}>{data.mapName}</div>
                    <div className={styles.fixed}>(<span>{data.currentPlayer}</span>/{data.maxPlayer})</div>
                </div>
                <div className={styles.otherInfo}>
                    <div>{data.gameType === 'War3' ? 'RTS' : data.gameType}</div>
                    <div>{data.gameMode}</div>
                </div>
            </div>
            <div className={styles.joinBtn}>加入</div>
        </div>
    );
};

export default RecruitCard;
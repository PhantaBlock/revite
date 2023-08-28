import styles from './index.module.scss';

interface IMessage {
    roomId: number;
    roomName: string;
    roomType: string;
    currentPlayer: number;
    maxPlayer: number;
    gameType: string;
    matchMode: string;
    mapName: string;
    mapImg: string;
}

const QuickMatchImg = 'https://skyvs.oss-cn-hangzhou.aliyuncs.com/resources/images/icons.jpeg';
const matchModeMap: any = {
    OneVsOne: '1v1',
    TwoVsTwo: '2v2',
    FourVsFour: '4v4',
};

const RecruitCard = ({ data }: { data: IMessage }) => {
    const isQuickMatch = data.roomType === 'QuickMatch';

    const handleClick = () => {
        window.__JOIN_ROOM__?.({
            game_type: data.gameType,
            room_id: Number(data.roomId),
        }).then((res: any) => {
            window.__TOAST__?.('加入成功');

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
                <img src={isQuickMatch ? QuickMatchImg : data.mapImg} alt=" " />
            </div>
            <div className={styles.infoWrap}>
                <div className={styles.mapName}>
                    <div className={styles.ellipsis}>{isQuickMatch ? 'RTS娱乐匹配' : data.mapName}</div>
                    <div className={styles.fixed}>(<span>{data.currentPlayer}</span>/{data.maxPlayer})</div>
                </div>
                <div className={styles.otherInfo}>
                    <div>{data.gameType === 'War3' ? 'RTS' : data.gameType}</div>
                    <div>{matchModeMap[data.matchMode]}</div>
                </div>
            </div>
            <div className={styles.joinBtn}>加入</div>
        </div>
    );
};

export default RecruitCard;
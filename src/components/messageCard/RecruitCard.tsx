import styles from './index.module.scss';

interface IMessage {
    roomId: number;
    roomNum: string;
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

const RecruitCard = ({ data, author }: { data: IMessage, author?: any }) => {
    const isQuickMatch = data.roomType === 'QuickMatch';
    const isLadder = data.roomType === 'Ladder';

    const isVIP = !!author?.vip;
    const { term_type = 0 } = author?.vip || {};
    const VIPConfig = window.__VIP_CONFIG_MAP__?.[term_type];

    console.log('##', isVIP);

    let mapName = data.mapName;

    if (isQuickMatch) {
        mapName = 'RTS娱乐匹配';
    } else if (isLadder) {
        mapName = '天梯排位';
    }

    const handleClick = () => {
        window.__ACCEPT_INVITE__?.({
            room_id: Number(data.roomId),
            inviter_id: author?._id,
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
            {isVIP && !!VIPConfig && !!data.roomNum && (
                <div className={styles.vipRoomWrap}>
                    <div className={styles.vipRoomInfo} style={{ backgroundImage: `url(${VIPConfig.inviteTag})` }}>
                        <div className={styles.roomNum}>{data.roomNum}</div>
                        <div className={styles.roomRights}>收益+{VIPConfig.roomExtra}</div>
                    </div>
                </div>
            )}
            <div className={styles.row}>
                <div className={styles.imgWrap}>
                    <img src={(isQuickMatch || isLadder) ? QuickMatchImg : data.mapImg} alt=" " />
                </div>
                <div className={styles.infoWrap}>
                    <div className={styles.mapName}>
                        <div className={styles.ellipsis}>{mapName}</div>
                        <div className={styles.fixed}>(<span>{data.currentPlayer}</span>/{data.maxPlayer})</div>
                    </div>
                    <div className={styles.otherInfo}>
                        <div>{data.gameType === 'War3' ? 'RTS' : data.gameType}</div>
                        <div>{matchModeMap[data.matchMode]}</div>
                    </div>
                </div>
                <div className={styles.joinBtn}>加入</div>
            </div>
        </div>
    );
};

export default RecruitCard;
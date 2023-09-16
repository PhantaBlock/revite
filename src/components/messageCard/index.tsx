import RecruitCard from "./RecruitCard";

interface IMessageCard {
    type: string;
    message: string;
}

const MessageCard = ({ type, message }: IMessageCard) => {
    const data = JSON.parse(message || '{}');

    if (type === 'ROOM_RECRUIT') {
        return <RecruitCard data={data} />
    }

    return null;
};

export default MessageCard;
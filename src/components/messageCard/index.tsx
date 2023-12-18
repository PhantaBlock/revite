import RecruitCard from "./RecruitCard";
import RequestInvite from './RequestInvite';

interface IMessageCard {
    type: string;
    message: string;
    author?: any;
}

const MessageCard = ({ type, message, author }: IMessageCard) => {
    const data = JSON.parse(message || '{}');

    if (type === 'ROOM_RECRUIT') {
        return <RecruitCard data={data} author={author} />
    }

    if (type === 'REQUEST_INVITE') {
        return <RequestInvite author={author} />
    }

    return null;
};

export default MessageCard;
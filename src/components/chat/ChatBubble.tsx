import { Badge, Card } from 'antd';
import styled from 'styled-components';

interface ChatBubbleProps {
  date: string;
  username: string;
  isMyChat: boolean;
  message: string;
}

const ChatBubble = ({ message, date, username, isMyChat }: ChatBubbleProps) => {
  const padding = isMyChat ? '10px 80px 10px 20px' : '10px 20px 10px 80px';
  return (
    <div className={isMyChat ? 'my-chat' : 'peer-chat'}>
      <Badge.Ribbon placement={isMyChat ? 'end' : 'start'} text={username}>
        <StyledCard bodyStyle={{ padding }}>
          <p>{message}</p>
        </StyledCard>
      </Badge.Ribbon>
      <span className={'chat-date'}>{date}</span>
    </div>
  );
};

const StyledCard = styled(Card)`
  p {
    white-space: pre;
    margin: 0;
  }
`;

export default ChatBubble;

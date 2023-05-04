import { Badge, Card } from 'antd';
import styled from 'styled-components';
import { theme } from '../../style/theme';

interface ChatBubbleProps {
  date: string;
  username: string;
  isMyChat: boolean;
  message: string;
}

const ChatBubble = ({ message, date, username, isMyChat }: ChatBubbleProps) => {
  const padding = isMyChat ? '10px 80px 10px 20px' : '10px 20px 10px 80px';
  return (
    <div
      className={isMyChat ? 'chat-bubble  my-chat' : 'chat-bubble peer-chat'}
    >
      <Badge.Ribbon
        color={isMyChat ? theme.color.primary200 : theme.color.primary400}
        placement={isMyChat ? 'end' : 'start'}
        text={username}
      >
        <StyledCard bodyStyle={{ padding }}>
          <p>{message}</p>
        </StyledCard>
      </Badge.Ribbon>
      <div className={'chat-date'}>
        <span>{date}</span>
      </div>
    </div>
  );
};

const StyledCard = styled(Card)`
  p {
    word-wrap: break-word;
    white-space: pre-wrap;
    margin: 0;
  }
`;

export default ChatBubble;

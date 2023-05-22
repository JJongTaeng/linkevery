import { Badge, Card } from 'antd';
import color from 'color';
import { HTMLAttributes } from 'react';
import stc from 'string-to-color';
import styled from 'styled-components';

interface ChatBubbleProps extends HTMLAttributes<HTMLDivElement> {
  date: string;
  username: string;
  isMyChat: boolean;
  message: string;
}

const ChatBubble = ({
  message,
  date,
  username,
  isMyChat,
  ...props
}: ChatBubbleProps) => {
  const padding = isMyChat ? '10px 80px 10px 20px' : '10px 20px 10px 80px';
  const sum = (arr: number[]) =>
    arr.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  const getColorObj = (colorCode: string) => color(colorCode) as any;
  const isBlack = () =>
    sum(getColorObj(stc(username)).color as number[]) / 765 > 0.6;
  return (
    <ChatBubbleContainer
      {...props}
      $isBlack={isBlack()}
      className={isMyChat ? 'chat-bubble  my-chat' : 'chat-bubble peer-chat'}
    >
      <Badge.Ribbon
        style={isMyChat ? { display: 'none' } : {}}
        color={stc(username)}
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
    </ChatBubbleContainer>
  );
};

const ChatBubbleContainer = styled.div<{ $isBlack: boolean }>`
  .ant-ribbon-text {
    color: ${({ $isBlack }) => ($isBlack ? '#333' : '#eee')};
  }
`;

const StyledCard = styled(Card)`
  p {
    word-wrap: break-word;
    white-space: pre-wrap;
    margin: 0;
  }
`;

export default ChatBubble;

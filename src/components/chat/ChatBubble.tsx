import { Card, Image, Tag } from 'antd';
import color from 'color';
import dayjs from 'dayjs';
import { HTMLAttributes } from 'react';
import stc from 'string-to-color';
import styled from 'styled-components';
import { chatUtils } from 'service/utils/ChatUtils';
import { utils } from 'service/utils/Utils';

interface ChatBubbleProps extends HTMLAttributes<HTMLDivElement> {
  date?: string;
  username?: string;
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
  const getColorObj = (colorCode: string) => color(colorCode) as any;
  const isDark = () =>
    utils.sum(getColorObj(stc(username)).color as number[]) / 765 > 0.6;
  const chatMessageType = chatUtils.getChatType(message);
  const urlRegex = /(http[s]?:\/\/)?([^\/\s]+\/)([^\s]*)/g;

  const getURL = (message: string) => message.match(urlRegex)?.[0];

  const chatElementByMessageType = {
    text: <p>{message}</p>,
    image: <Image src={message} />,
    url: (
      <>
        <a href={getURL(message)} target="_blank" rel="noopener noreferrer">
          {getURL(message)}
        </a>
        <span>{message.replace(getURL(message) || '', '')}</span>
      </>
    ),
    file: <></>,
    pdf: <></>,
  };

  return (
    <ChatBubbleContainer
      {...props}
      $isBlack={isDark()}
      className={isMyChat ? 'chat-bubble  my-chat' : 'chat-bubble peer-chat'}
    >
      {username && (
        <div className="chat-header">
          <Tag
            color={stc(username)}
            style={isMyChat ? { display: 'none' } : {}}
          >
            <span>{username}</span>
          </Tag>
        </div>
      )}
      <div className="chat-content">
        <StyledCard size="small">
          {chatElementByMessageType[chatMessageType]}
        </StyledCard>
        {date && (
          <span className="chat-time">{dayjs(date).format('HH:mm')}</span>
        )}
      </div>
    </ChatBubbleContainer>
  );
};

const ChatBubbleContainer = styled.div<{ $isBlack: boolean }>`
  .ant-tag-has-color {
    color: ${({ $isBlack }) => ($isBlack ? '#333' : '#eee')};
  }
  .chat-header {
    display: flex;
    align-items: center;
    margin-bottom: 3px;
    margin-top: 8px;
  }
  .chat-time {
    font-size: 12px;
    color: ${({ theme }) => theme.color.grey100};
    align-self: flex-end;
    margin: 3px;
  }
  .chat-content {
    display: flex;

    a {
      word-wrap: break-word;
    }
  }
`;

const StyledCard = styled(Card)`
  p {
    word-wrap: break-word;
    white-space: pre-wrap;
    margin: 0;
  }
  min-width: 60px;
  max-width: 400px;
`;

export default ChatBubble;

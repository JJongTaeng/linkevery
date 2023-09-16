import React, { useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Button, Divider } from 'antd';
import dayjs from 'dayjs';
import ChatBubble from './ChatBubble';
import { storage } from '../../service/storage/StorageService';
import styled from 'styled-components';
import { useChat } from '../../hooks/room/useChat';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { utils } from '../../service/utils/Utils';
import { getChatListPageByDB } from '../../store/thunk/chatThunk';
import { PAGE_OFFSET } from '../../style/constants';
import { useParams } from 'react-router-dom';
import SvgArrowDown from '../icons/ArrowDown';

const ChatList = () => {
  const {
    setPage,
    handleVisibleScrollButton,
    moveToChatScrollBottom,
    state,
    elements: { chatListElement, chatLoadingTriggerElement },
  } = useChat();
  const { roomName } = useParams<{
    roomName: string;
  }>();
  const { messageList, status } = useAppSelector((state) => ({
    messageList: state.chat.messageList,
    status: state.status,
  }));
  const storeDispatch = useAppDispatch();

  const [isIntersecting] = useIntersectionObserver<HTMLDivElement>(
    chatLoadingTriggerElement,
    {
      root: chatListElement.current,
    },
  );

  useEffect(() => {
    chatListElement?.current?.addEventListener(
      'scroll',
      handleVisibleScrollButton,
    );

    return () => {
      chatListElement.current?.removeEventListener(
        'scroll',
        handleVisibleScrollButton,
      );
      setPage(0);
    };
  }, []);

  useEffect(() => {
    if (state.page === 1) {
      moveToChatScrollBottom();
    }
    if (utils.isBottomScrollElement(chatListElement.current!)) {
      moveToChatScrollBottom();
    }
  }, [messageList.length, state.page]);

  useEffect(() => {
    if (isIntersecting && !status.isMaxPageMessageList) {
      storeDispatch(
        getChatListPageByDB({
          roomName: roomName!,
          page: state.page + 1,
          offset: PAGE_OFFSET,
        }),
      );
      setPage(state.page + 1);
    }
  }, [isIntersecting, status.isMaxPageMessageList]);
  const isSameTime = (before: string, after: string) =>
    dayjs(before).isSame(after, 'minute');

  const isSameDay = (before: string, after: string) =>
    dayjs(before).isSame(after, 'day');

  return (
    <StyledChatList id={'chat-list'} ref={chatListElement}>
      <div id="chat-loading-trigger" ref={chatLoadingTriggerElement} />
      {messageList.map(({ message, userKey, date, username }, index) => {
        const prevMessage = messageList[index - 1];
        const currentMessage = messageList[index];
        const nextMessage = messageList[index + 1];

        const isSameUserPrev = prevMessage?.userKey === currentMessage.userKey;
        const isSameUser = nextMessage?.userKey === currentMessage.userKey;

        const isSameUserAndSameTimeForTime =
          isSameUser && isSameTime(currentMessage?.date, nextMessage?.date);
        const isSameUserAndSameTimeForUsername =
          isSameTime(prevMessage?.date, currentMessage?.date) && isSameUserPrev;
        return (
          <React.Fragment key={nanoid()}>
            {isSameDay(prevMessage?.date, currentMessage?.date) ? null : (
              <Divider className="chat-date" plain>
                {dayjs(currentMessage.date).format('YYYY년 MM월 DD일')}
              </Divider>
            )}
            <ChatBubble
              key={nanoid()}
              message={message}
              date={
                isSameUserAndSameTimeForTime
                  ? undefined
                  : dayjs(date).format('YYYY-MM-DD HH:mm')
              }
              username={isSameUserAndSameTimeForUsername ? undefined : username}
              isMyChat={userKey === storage.getItem('userKey')}
            />
          </React.Fragment>
        );
      })}
      {state.isVisibleScrollButton && (
        <Button
          className={'scroll-down-button'}
          style={{ marginBottom: 8 }}
          onClick={() => {
            moveToChatScrollBottom();
          }}
          shape="circle"
        >
          <SvgArrowDown />
        </Button>
      )}
    </StyledChatList>
  );
};

const StyledChatList = styled.div`
  &::-webkit-scrollbar {
    background-color: white;
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: ${({ theme }) => theme.color.primary200};
  }
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 100px);
  overflow: overlay;
  padding: 20px 20px 0 20px;
  box-shadow: ${({ theme }) => theme.boxShadow};

  border-radius: 8px;
  .chat-bubble {
    max-width: 100%;
    margin-bottom: 4px;
  }
  .peer-chat {
    align-self: flex-start;
  }
  .my-chat {
    align-self: flex-end;
    .ant-card {
      order: 2;
    }
    .chat-time {
      display: flex;
      justify-content: flex-end;
      order: 1;
    }
  }
  .chat-name,
  .chat-time {
    span {
      color: ${({ theme }) => theme.color.primary200};
      font-size: 12px;
    }
  }
  .chat-date {
    color: ${({ theme }) => theme.color.grey100};
  }

  .scroll-down-button {
    position: absolute;
    left: calc(50% - 16px);
    bottom: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
export default ChatList;

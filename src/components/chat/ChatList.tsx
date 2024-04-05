import React, { useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import { Button, Divider } from 'antd';
import dayjs from 'dayjs';
import ChatBubble from './ChatBubble';
import { storage } from '../../service/storage/StorageService';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { utils } from '../../service/utils/Utils';
import { getChatListPageByDB } from '../../store/thunk/chatThunk';
import { PAGE_OFFSET } from '../../style/constants';
import { useParams } from 'react-router-dom';
import SvgArrowDown from '../icons/ArrowDown';
import { chatActions } from '../../store/features/chatSlice';
import { debounce } from 'throttle-debounce';

const ChatList = () => {
  const chatListElement = useRef<HTMLDivElement>(null);
  const chatLoadingTriggerElement = useRef<HTMLDivElement>(null);
  const { roomName } = useParams<{
    roomName: string;
  }>();
  const { messageList, isMaxPage, page, isVisibleScrollButton } =
    useAppSelector((state) => ({
      messageList: state.chat.messageList,
      isVisibleScrollButton: state.chat.isVisibleScrollButton,
      page: state.chat.page,
      isMaxPage: state.chat.isMaxPage,
    }));

  const dispatch = useAppDispatch();

  const [isIntersecting] = useIntersectionObserver<HTMLDivElement>(
    chatLoadingTriggerElement,
    {
      root: chatListElement.current,
    },
  );

  const handleVisibleScrollButton = debounce(200, () => {
    if (utils.isBottomScrollElement(chatListElement.current!)) {
      dispatch(
        chatActions.setIsVisibleScrollButton({ isVisibleScrollButton: false }),
      );
    } else {
      dispatch(
        chatActions.setIsVisibleScrollButton({ isVisibleScrollButton: true }),
      );
    }
  });

  const moveToChatScrollBottom = () => {
    setTimeout(() => {
      if (chatListElement.current)
        chatListElement.current.scrollTop =
          chatListElement?.current?.scrollHeight;
    }, 0);
  };

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
      dispatch(chatActions.setPage({ page: 0 }));
    };
  }, []);

  useEffect(() => {
    if (page === 1) {
      // 1페이지에서 스크롤 아래로
      moveToChatScrollBottom();
    }
    if (utils.isBottomScrollElement(chatListElement.current!)) {
      moveToChatScrollBottom(); // 스크롤이 하단 고정일 때, 새로운 메시지 도착 시 스크롤 아래로
    }
  }, [messageList.length, page]);

  useEffect(() => {
    if (isIntersecting && !isMaxPage) {
      dispatch(
        getChatListPageByDB({
          roomName: roomName!,
          page: page + 1,
          offset: PAGE_OFFSET,
        }),
      );
      dispatch(chatActions.setPage({ page: page + 1 }));
    }
  }, [isIntersecting, isMaxPage]);
  const isSameTime = (before: string, after: string) =>
    dayjs(before).isSame(after, 'minute');

  const isSameDay = (before: string, after: string) =>
    dayjs(before).isSame(after, 'day');

  return (
    <ChatListContainer ref={chatListElement} id={'chat-list'}>
      <StyledChatList>
        <div id="chat-loading-trigger" ref={chatLoadingTriggerElement} />
        {messageList.map(
          ({ message, userKey, date, username, messageType }, index) => {
            const prevMessage = messageList[index - 1];
            const currentMessage = messageList[index];
            const nextMessage = messageList[index + 1];

            const isSameUserPrev =
              prevMessage?.userKey === currentMessage.userKey;
            const isSameUser = nextMessage?.userKey === currentMessage.userKey;

            const isSameUserAndSameTimeForTime =
              isSameUser && isSameTime(currentMessage?.date, nextMessage?.date);
            const isSameUserAndSameTimeForUsername =
              isSameTime(prevMessage?.date, currentMessage?.date) &&
              isSameUserPrev;
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
                  type={messageType}
                  username={
                    isSameUserAndSameTimeForUsername ? undefined : username
                  }
                  isMyChat={userKey === storage.getItem('userKey')}
                />
              </React.Fragment>
            );
          },
        )}
        {isVisibleScrollButton && (
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
    </ChatListContainer>
  );
};

const ChatListContainer = styled.div`
  margin-bottom: 10px;
  &::-webkit-scrollbar {
    background-color: white;
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: ${({ theme }) => theme.color.primary200};
  }

  flex: 1 1 auto;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.boxShadow};

  overflow: overlay;
`;

const StyledChatList = styled.div`
  display: flex;
  flex: 0 0 auto;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  padding: 20px 20px 0 20px;

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

import { Button, Divider } from 'antd';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useRoom } from 'hooks/room/useRoom';
import { useIntersectionObserver } from 'hooks/useIntersectionObserver';
import { storage } from 'service/storage/StorageService';
import { utils } from 'service/utils/Utils';
import { chatActions } from 'store/features/chatSlice';
import { roomActions } from 'store/features/roomSlice';
import { statusActions } from 'store/features/statusSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getChatListPageByDB } from 'store/thunk/chatThunk';
import { deleteAllMemberByDB, getRoomByDB } from 'store/thunk/roomThunk';
import { getUserByDB } from 'store/thunk/userThunk';
import { PAGE_OFFSET } from 'style/constants';
import ChatBubble from 'components/chat/ChatBubble';
import SvgArrowDown from 'components/icons/ArrowDown';
import UsernameModal from './UsernameModal';
import { useApp } from 'hooks/useApp';
import ChatForm from './ChatForm';

const Room = () => {
  const [app] = useApp();
  const {
    state,
    setPage,
    setUsernameModalVisible,
    handleVisibleScrollButton,
    handleViewportResize,
    handleUsernameSubmit,
    moveToChatScrollBottom,
    elements: { chatListElement, chatLoadingTriggerElement },
  } = useRoom();

  const { roomName } = useParams<{
    roomName: string;
  }>();
  const { username, messageList, status } = useAppSelector((state) => ({
    status: state.status,
    messageList: state.chat.messageList,
    username: state.user.username,
  }));
  const storeDispatch = useAppDispatch();

  const [isIntersecting] = useIntersectionObserver<HTMLDivElement>(
    chatLoadingTriggerElement,
    {
      root: chatListElement.current,
    },
  );

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

  useEffect(() => {
    if (username && roomName) {
      storage.setItem('roomName', roomName);
      setUsernameModalVisible(false);
      app.dispatch.sendConnectionConnectMessage({}); // socket join
      app.dispatch.sendConnectionJoinRoomMessage({ roomName }); // join
      storeDispatch(roomActions.setRoomName(roomName));
      storeDispatch(getRoomByDB(roomName));
    } else {
      setUsernameModalVisible(true);
    }
    return () => {
      app.disconnect();
      storeDispatch(chatActions.resetChatList());
      storeDispatch(statusActions.resetAllStatusState());
      setPage(0);
    };
  }, [username, roomName]);

  useEffect(() => {
    if (state.page === 1) {
      moveToChatScrollBottom();
    }
    if (utils.isBottomScrollElement(chatListElement.current!)) {
      moveToChatScrollBottom();
    }
  }, [messageList.length, state.page]);

  useEffect(() => {
    storeDispatch(getUserByDB());
    chatListElement?.current?.addEventListener(
      'scroll',
      handleVisibleScrollButton,
    );
    window.addEventListener('beforeunload', async () => {
      roomName && storeDispatch(deleteAllMemberByDB({ roomName }));
    });

    window.visualViewport?.addEventListener('resize', handleViewportResize);
    window.visualViewport?.addEventListener('scroll', handleViewportResize);

    return () => {
      chatListElement.current?.removeEventListener(
        'scroll',
        handleVisibleScrollButton,
      );
      roomName && storeDispatch(deleteAllMemberByDB({ roomName }));
      window.visualViewport?.removeEventListener(
        'resize',
        handleViewportResize,
      );
      window.visualViewport?.removeEventListener(
        'scroll',
        handleViewportResize,
      );
    };
  }, []);

  const isSameTime = (before: string, after: string) =>
    dayjs(before).isSame(after, 'minute');

  const isSameDay = (before: string, after: string) =>
    dayjs(before).isSame(after, 'day');

  return (
    <>
      <RoomContent $leftMenuVisible={status.leftMenuVisible}>
        <ContentContainer>
          <ChatContainer>
            <ChatList id={'chat-list'} ref={chatListElement}>
              <div id="chat-loading-trigger" ref={chatLoadingTriggerElement} />
              {messageList.map(
                ({ message, userKey, date, username }, index) => {
                  const prevMessage = messageList[index - 1];
                  const currentMessage = messageList[index];
                  const nextMessage = messageList[index + 1];

                  const isSameUserPrev =
                    prevMessage?.userKey === currentMessage.userKey;
                  const isSameUser =
                    nextMessage?.userKey === currentMessage.userKey;

                  const isSameUserAndSameTimeForTime =
                    isSameUser &&
                    isSameTime(currentMessage?.date, nextMessage?.date);
                  const isSameUserAndSameTimeForUsername =
                    isSameTime(prevMessage?.date, currentMessage?.date) &&
                    isSameUserPrev;
                  return (
                    <React.Fragment key={nanoid()}>
                      {isSameDay(
                        prevMessage?.date,
                        currentMessage?.date,
                      ) ? null : (
                        <Divider className="chat-date" plain>
                          {dayjs(currentMessage.date).format(
                            'YYYY년 MM월 DD일',
                          )}
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
                        username={
                          isSameUserAndSameTimeForUsername
                            ? undefined
                            : username
                        }
                        isMyChat={userKey === storage.getItem('userKey')}
                      />
                    </React.Fragment>
                  );
                },
              )}
            </ChatList>
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
            <ChatForm />
          </ChatContainer>
        </ContentContainer>
        <UsernameModal
          open={state.usernameModalVisible}
          onSubmit={handleUsernameSubmit}
        />
      </RoomContent>
    </>
  );
};

const RoomContent = styled.div<{ $leftMenuVisible: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

const ChatContainer = styled.div`
  width: 100%;
  min-width: 30%;
  padding: 8px;

  position: relative;

  .scroll-down-button {
    position: absolute;
    left: calc(50% - 16px);
    bottom: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ChatList = styled.div`
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
`;
export default Room;

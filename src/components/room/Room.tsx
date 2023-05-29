import { Button } from 'antd';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { debounce } from 'throttle-debounce';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AppServiceImpl } from '../../service/app/AppServiceImpl';
import { storage } from '../../service/storage/StorageService';
import { utils } from '../../service/utils/Utils';
import { chatActions } from '../../store/features/chatSlice';
import { roomActions } from '../../store/features/roomSlice';
import { statusActions } from '../../store/features/statusSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addChatByDB, getChatListPageByDB } from '../../store/thunk/chatThunk';
import { deleteAllMemberByDB, getRoomByDB } from '../../store/thunk/roomThunk';
import { addUserByDB, getUserByDB } from '../../store/thunk/userThunk';
import { PAGE_OFFSET } from '../../style/constants';
import ChatBubble from '../chat/ChatBubble';
import SvgArrowDown from '../icons/ArrowDown';
import SvgCloseButton from '../icons/CloseButton';
import SvgCloseFullScreen from '../icons/CloseFullScreen';
import SvgFullScreen from '../icons/FullScreen';
import SvgSend from '../icons/Send';
import UsernameModal from './UsernameModal';

const Room = () => {
  const app = useRef(AppServiceImpl.getInstance()).current;
  const chatListElement = useRef<HTMLDivElement>(null);
  const chatLoadingTriggerElement = useRef<HTMLDivElement>(null);
  const focusInput = useRef<HTMLInputElement>(null);
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [page, setPage] = useState(0);
  const { roomName } = useParams<{
    roomName: string;
  }>();
  const {
    username,
    messageList,
    isVisiblePlayView,
    isVisibleScrollButton,
    status,
  } = useAppSelector((state) => ({
    status: state.status,
    messageList: state.chat.messageList,
    username: state.user.username,
    isVisiblePlayView: state.status.isVisiblePlayView,
    isVisibleScrollButton: state.status.isVisibleScrollButton,
  }));
  const dispatch = useAppDispatch();

  const [isIntersecting] = useIntersectionObserver<HTMLDivElement>(
    chatLoadingTriggerElement,
    {
      root: chatListElement.current,
    },
  );

  const [message, setMessage] = useState('');
  const [isShift, setIsShift] = useState<boolean>(false);

  const handleChat = () => {
    if (!message) return;
    const date = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
    app.dispatch.sendChatSendMessage({
      message,
      date,
      username,
      userKey: storage.getItem('userKey'),
      messageType: 'text',
      messageKey: username + '+' + date,
    });
    dispatch(
      chatActions.addChat({
        messageType: 'text',
        messageKey: username + '+' + date,
        message,
        userKey: storage.getItem('userKey'),
        date,
        username,
      }),
    );

    dispatch(
      addChatByDB({
        messageType: 'text',
        messageKey: username + '+' + date,
        message,
        userKey: storage.getItem('userKey'),
        date,
        username,
        roomName: storage.getItem('roomName'),
      }),
    );
    setMessage('');
  };

  const onScrollIsVisibleScrollButton = () => {
    if (utils.isBottomScrollElement(chatListElement.current!)) {
      dispatch(statusActions.changeIsVisibleScrollButton(false));
    } else {
      dispatch(statusActions.changeIsVisibleScrollButton(true));
    }
  };
  const handleViewportResize = debounce(
    50,
    (e: any) => {
      window.scrollTo(0, document.body.scrollHeight - e.target.height);
    },
    {},
  );
  const moveToChatScrollBottom = () => {
    if (chatListElement.current)
      chatListElement.current.scrollTop =
        chatListElement?.current?.scrollHeight;
  };

  useEffect(() => {
    if (isIntersecting && !status.isMaxPageMessageList) {
      setPage((page) => page + 1);
    }
  }, [isIntersecting, status.isMaxPageMessageList]);

  useEffect(() => {
    if (page) {
      dispatch(
        getChatListPageByDB({ roomName: roomName!, page, offset: PAGE_OFFSET }),
      );
    }
  }, [page, roomName]);

  useEffect(() => {
    if (username && roomName) {
      storage.setItem('roomName', roomName);
      setUsernameModalVisible(false);
      app.dispatch.sendConnectionConnectMessage({}); // socket join
      app.dispatch.sendConnectionJoinRoomMessage({ roomName }); // join
      dispatch(roomActions.setRoomName(roomName));
      dispatch(getRoomByDB(roomName));
    } else {
      setUsernameModalVisible(true);
    }
    return () => {
      app.disconnect();
      dispatch(chatActions.resetChatList());
      dispatch(statusActions.resetAllStatusState());
      setPage(0);
    };
  }, [username, roomName]);

  useEffect(() => {
    if (page === 1) {
      moveToChatScrollBottom();
    }
    if (utils.isBottomScrollElement(chatListElement.current!)) {
      moveToChatScrollBottom();
    }
  }, [messageList.length, page]);

  useEffect(() => {
    dispatch(getUserByDB());
    chatListElement?.current?.addEventListener(
      'scroll',
      onScrollIsVisibleScrollButton,
    );
    window.addEventListener('beforeunload', async () => {
      roomName && dispatch(deleteAllMemberByDB({ roomName }));
    });

    window.visualViewport?.addEventListener('resize', handleViewportResize);
    window.visualViewport?.addEventListener('scroll', handleViewportResize);

    return () => {
      chatListElement.current?.removeEventListener(
        'scroll',
        onScrollIsVisibleScrollButton,
      );
      roomName && dispatch(deleteAllMemberByDB({ roomName }));
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

  return (
    <>
      <RoomContent $leftMenuVisible={status.leftMenuVisible}>
        <ContentContainer className="content-container">
          <VideoContainer
            id={'video-container'}
            isVisible={isVisiblePlayView}
            isFullScreen={isFullScreen}
          >
            <div
              onClick={() => setIsFullScreen((value) => !value)}
              className="full-screen"
            >
              {isFullScreen ? <SvgCloseFullScreen /> : <SvgFullScreen />}
            </div>
            <div
              onClick={() => {
                dispatch(statusActions.changeIsVisiblePlayView(false));
                setIsFullScreen(false);
              }}
              className="close-video"
            >
              <SvgCloseButton />
            </div>
          </VideoContainer>
          <ChatContainer leftSideView={isVisiblePlayView}>
            <ChatList id={'chat-list'} ref={chatListElement}>
              <div id="chat-loading-trigger" ref={chatLoadingTriggerElement} />
              {messageList.map(
                ({ message, userKey, date, username }, index) => (
                  <ChatBubble
                    key={nanoid()}
                    message={message}
                    date={dayjs(date).format('YYYY-MM-DD HH:mm')}
                    username={username}
                    isMyChat={userKey === storage.getItem('userKey')}
                  />
                ),
              )}
            </ChatList>
            {isVisibleScrollButton && (
              <Button
                style={{ marginBottom: 8 }}
                onClick={() => {
                  moveToChatScrollBottom();
                }}
                shape="circle"
              >
                <SvgArrowDown />
              </Button>
            )}
            <ChatForm
              autoComplete="off"
              onSubmit={(e: any) => {
                e.preventDefault();
                handleChat();
                focusInput?.current?.focus();
                e.target.message.focus();
              }}
            >
              <div className="form-header">
                <textarea
                  value={message}
                  onKeyDown={(e: any) => {
                    switch (e.key) {
                      case 'Enter':
                        e.preventDefault();
                        if (isShift) {
                          setMessage((message) => message + '\n');
                          return;
                        }
                        if (e.nativeEvent.isComposing) return;
                        handleChat();
                        e.target.value = '';
                        focusInput?.current?.focus();
                        e.target.focus();
                        break;
                      case 'Shift':
                        setIsShift(true);
                        break;
                    }
                  }}
                  onKeyUp={(e) => {
                    switch (e.key) {
                      case 'Shift':
                        setIsShift(false);
                        break;
                    }
                  }}
                  onChange={(e) => setMessage(e.target.value)}
                  name="message"
                  style={{ height: 40 }}
                  placeholder={roomName?.split('+')[0] + ' 에 메시지 보내기'}
                />
                <input
                  type="text"
                  ref={focusInput}
                  style={{
                    position: 'fixed',
                    left: -10000,
                    width: 10,
                    height: 10,
                  }}
                />
              </div>

              <div className="form-footer">
                <button type="submit">
                  <SvgSend />
                </button>
              </div>
            </ChatForm>
          </ChatContainer>
        </ContentContainer>
        <UsernameModal
          open={usernameModalVisible}
          onSubmit={(username) => {
            const key = nanoid();
            dispatch(addUserByDB({ username, key }));
            dispatch(getUserByDB());
            storage.setItem('userKey', key);
            storage.setItem('username', username);
            setUsernameModalVisible(false);
          }}
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

const VideoContainer = styled.div<{
  isVisible: boolean;
  isFullScreen: boolean;
}>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  ${({ theme, isVisible }) =>
    isVisible
      ? `
        padding: 8px;
        width: 70%;
      `
      : `
        padding: 0;
        width: 0px;
        border: 0;
  `};
  ${({ theme, isVisible }) => theme.media.tablet`
    ${isVisible ? 'width: 100%' : 'width: 0px'}
  `};
  height: 100%;
  transition: 0.3s;
  background-color: ${({ theme }) => theme.color.white};

  ${({ isFullScreen }) =>
    isFullScreen
      ? `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
  `
      : ''}

  video {
    ${({ isVisible, theme }) =>
      isVisible &&
      `
          box-shadow: ${theme.boxShadow};
          border-radius: 8px;
      `};
    width: 100%;
    height: 100%;
  }

  &:hover > .full-screen {
    opacity: 1;
    cursor: pointer;
  }
  .full-screen:hover {
    transform: scale(1.1);
  }
  .full-screen {
    z-index: 100;
    opacity: 0;
    position: absolute;
    right: 20px;
    top: 20px;
    background: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      width: 20px;
      height: 20px;
    }
    ${({ isVisible }) => (isVisible ? '' : 'width: 0px; height: 0px;')}
  }
  &:hover > .close-video {
    opacity: 1;
    cursor: pointer;
  }
  .close-video:hover {
    transform: scale(1.1);
  }
  .close-video {
    z-index: 100;
    opacity: 0;
    position: absolute;
    left: 20px;
    top: 20px;
    background: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      width: 30px;
      height: 30px;
    }
    ${({ isVisible }) => (isVisible ? '' : 'width: 0px; height: 0px;')}
  }
`;

const ChatContainer = styled.div<{ leftSideView: boolean }>`
  width: 100%;
  min-width: 30%;
  padding: 8px;

  position: relative;
  ${({ theme, leftSideView }) => theme.media.tablet`
      ${leftSideView ? 'display: none' : ''}
  `};
  .ant-btn {
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
  }
  .peer-chat {
    margin-bottom: 8px;
    align-self: flex-start;
    .chat-date {
      display: flex;
      justify-content: flex-start;
    }
  }
  .my-chat {
    margin-bottom: 8px;

    align-self: flex-end;
    .chat-date {
      display: flex;
      justify-content: flex-end;
    }
  }
  .chat-name,
  .chat-date {
    span {
      color: ${({ theme }) => theme.color.primary200};
      font-size: 12px;
    }
  }
`;

const ChatForm = styled.form`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 8px;

  height: 80px;

  border: 1px solid ${({ theme }) => theme.color.primary400};
  border-radius: 8px;

  box-shadow: ${({ theme }) => theme.boxShadow};

  textarea {
    width: 100%;
    height: 100%;

    border: 0;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;

    padding: 8px;

    resize: none;
    box-sizing: border-box;
    border-bottom: 1px solid ${({ theme }) => theme.color.primary400};
  }
  textarea::placeholder {
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 0;
    svg {
      width: 24px;
      height: 24px;
    }
  }
  button:disabled {
    cursor: default;
    svg {
      path {
        stroke: ${({ theme }) => theme.color.primary400};
      }
    }
  }

  .form-header {
    height: 40px;
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    background-color: ${({ theme }) => theme.color.grey800};
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    button {
      background-color: ${({ theme }) => theme.color.grey800};
    }
  }
`;

export default Room;

import { Button } from 'antd';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppServiceImpl } from '../../service/app/AppServiceImpl';
import { storage } from '../../service/storage/StorageService';
import { utils } from '../../service/utils/Utils';
import { chatActions } from '../../store/features/chatSlice';
import { roomActions } from '../../store/features/roomSlice';
import { userActions } from '../../store/features/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addChatByDB, getChatListByDB } from '../../store/thunk/chatThunk';
import { deleteAllMemberByDB, getRoomByDB } from '../../store/thunk/roomThunk';
import { addUserByDB, getUserByDB } from '../../store/thunk/userThunk';
import ChatBubble from '../chat/ChatBubble';
import SvgArrowDown from '../icons/ArrowDown';
import SvgCloseButton from '../icons/CloseButton';
import SvgCloseFullScreen from '../icons/CloseFullScreen';
import SvgFullScreen from '../icons/FullScreen';
import SvgSend from '../icons/Send';
import {
  ChatContainer,
  ChatForm,
  ChatList,
  ContentContainer,
  RoomContent,
  VideoContainer,
} from './Room.styled';
import UsernameModal from './UsernameModal';

const Room = () => {
  const chatScrollViewElement = useRef<HTMLDivElement>(null);
  const chatListElement = useRef<HTMLDivElement>(null);
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [selectedUserKey, setSelectedUserKey] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const app = useRef(AppServiceImpl.getInstance()).current;
  const { roomName } = useParams<{
    roomName: string;
  }>();
  const { username, messageList, leftSideView, isReadAllChat, room, ui } =
    useAppSelector((state) => ({
      ui: state.ui,
      messageList: state.chat.messageList,
      room: state.room.room,
      username: state.user.username,
      leftSideView: state.user.leftSideView,
      isReadAllChat: state.user.isScrollButtonView,
    }));
  const dispatch = useAppDispatch();

  const [message, setMessage] = useState('');
  const [isShift, setIsShift] = useState<boolean>(false);

  const handleChat = () => {
    if (!message) return;
    const date = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
    app.dispatch.sendChatMessage({
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

  const handleScrollChatList = () => {
    if (utils.isBottomScrollElement(chatListElement.current!)) {
      dispatch(userActions.changeIsScrollBottomView(false));
    }
  };

  const moveToChatScrollBottom = () =>
    chatScrollViewElement?.current?.scrollIntoView({
      block: 'end',
      inline: 'end',
      behavior: 'smooth',
    });

  useEffect(() => {
    dispatch(getUserByDB()); // get user info [userkey, username
    window.addEventListener('beforeunload', async () => {
      roomName && dispatch(deleteAllMemberByDB({ roomName }));
    });
  }, []);

  useEffect(() => {
    if (username && roomName) {
      setUsernameModalVisible(false);
      app.dispatch.sendConnectMessage({}); // socket join
      app.dispatch.sendJoinRoomMessage({ roomName }); // join
      dispatch(roomActions.setRoomName(roomName));
      storage.setItem('roomName', roomName);
      dispatch(getRoomByDB(roomName));
      dispatch(getChatListByDB({ roomName }));
    } else {
      setUsernameModalVisible(true);
    }
    return () => {
      app.disconnect();
      dispatch(chatActions.resetChatList());
    };
  }, [username, roomName]);

  useEffect(() => {
    if (!room.member[selectedUserKey])
      dispatch(userActions.changeLeftSideView(false));
  }, [room.member]);

  useEffect(() => {
    if (utils.isBottomScrollElement(chatListElement.current!)) {
      moveToChatScrollBottom();
    } else {
      dispatch(userActions.changeIsScrollBottomView(true));
    }
  }, [messageList.length]);

  useEffect(() => {
    if (!chatListElement.current) return;
    chatListElement.current.addEventListener('scroll', handleScrollChatList);

    return () => {
      chatListElement.current?.removeEventListener(
        'scroll',
        handleScrollChatList,
      );
      roomName && dispatch(deleteAllMemberByDB({ roomName }));
    };
  }, []);

  return (
    <>
      <RoomContent>
        <ContentContainer>
          <VideoContainer
            id={'video-container'}
            isVisible={leftSideView}
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
                dispatch(userActions.changeLeftSideView(false));
                setIsFullScreen(false);
              }}
              className="close-video"
            >
              <SvgCloseButton />
            </div>
          </VideoContainer>
          <ChatContainer leftSideView={leftSideView}>
            <ChatList ref={chatListElement}>
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
              <div
                style={{ background: 'red', width: '100%' }}
                ref={chatScrollViewElement}
              ></div>
            </ChatList>
            {isReadAllChat && (
              <Button
                onClick={() => {
                  moveToChatScrollBottom();
                }}
                shape="circle"
                danger
              >
                <SvgArrowDown />
              </Button>
            )}
            <ChatForm
              onSubmit={(e: any) => {
                e.preventDefault();
                handleChat();
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

export default Room;

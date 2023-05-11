import { Button } from 'antd';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppServiceImpl } from '../../service/app/AppServiceImpl';
import { videoManager } from '../../service/media/VideoManager';
import { StorageService } from '../../service/storage/StorageService';
import { utils } from '../../service/utils/Utils';
import { chatActions } from '../../store/features/chatSlice';
import { roomActions } from '../../store/features/roomSlice';
import { userActions } from '../../store/features/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addUser, getUser } from '../../store/thunk/userThunk';
import ChatBubble from '../chat/ChatBubble';
import TopMenuContainer from '../container/TopMenuContainer';
import SvgArrowDown from '../icons/ArrowDown';
import SvgCloseFullScreen from '../icons/CloseFullScreen';
import SvgFullScreen from '../icons/FullScreen';
import SvgSend from '../icons/Send';
import MemberListContainer from './MemberListContainer';
import {
  ChatContainer,
  ChatForm,
  ChatList,
  ContentContainer,
  RoomContent,
  VideoContainer,
} from './Room.styled';
import UsernameModal from './UsernameModal';

const storage = StorageService.getInstance();

const Room = () => {
  const chatScrollViewElement = useRef<HTMLDivElement>(null);
  const chatListElement = useRef<HTMLDivElement>(null);
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const app = useRef(AppServiceImpl.getInstance()).current;
  const { roomName } = useParams<{
    roomName: string;
  }>();
  const {
    username,
    messageList,
    member,
    leftSideView,
    isReadAllChat,
    loading,
  } = useAppSelector((state) => ({
    member: state.room.member,
    messageList: state.chat.messageList,
    username: state.user.username,
    leftSideView: state.user.leftSideView,
    isReadAllChat: state.user.isScrollButtonView,
    loading: state.loading,
  }));
  const dispatch = useAppDispatch();

  const [message, setMessage] = useState('');
  const [isShift, setIsShift] = useState<boolean>(false);

  const handleChat = () => {
    if (!message) return;
    dispatch(
      chatActions.sendChat({
        message,
        clientId: storage.getItem('clientId'),
        date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        username: username,
      }),
    );
    setMessage('');
  };

  const handleScrollChatList = () => {
    if (utils.isBottomScrollElement(chatListElement.current!)) {
      dispatch(userActions.changeIsScrollBottomView(false));
    }
  };
  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    if (username && roomName) {
      setUsernameModalVisible(false);
      app.dispatch.sendConnectMessage({});
      app.dispatch.sendJoinRoomMessage({ roomName });
      dispatch(roomActions.setRoomName(roomName));
      storage.setItem('roomName', roomName);
    } else {
      setUsernameModalVisible(true);
    }
  }, [username, roomName]);

  useEffect(() => {
    if (!member[selectedClientId])
      dispatch(userActions.changeLeftSideView(false));
  }, [member]);

  useEffect(() => {
    if (utils.isBottomScrollElement(chatListElement.current!)) {
      chatScrollViewElement?.current?.scrollIntoView({
        block: 'end',
        inline: 'end',
        behavior: 'smooth',
      });
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
      app.disconnect();
      dispatch(chatActions.resetChatList());
    };
  }, []);

  return (
    <>
      <TopMenuContainer />
      <RoomContent>
        <MemberListContainer
          onClickMemberScreenShare={(id: string) => {
            if (id === selectedClientId) {
              dispatch(userActions.changeLeftSideView(false));
              setSelectedClientId('');
            } else {
              dispatch(userActions.changeLeftSideView(true));
              setSelectedClientId(id);
              videoManager.appendVideoNode(id);
            }
          }}
        />
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
          </VideoContainer>
          <ChatContainer leftSideView={leftSideView}>
            <ChatList ref={chatListElement}>
              {messageList.map(({ message, clientId, date, username }) => (
                <ChatBubble
                  key={nanoid()}
                  message={message}
                  date={date}
                  username={username}
                  isMyChat={clientId === storage.getItem('clientId')}
                />
              ))}
              <div
                style={{ background: 'red', width: '100%' }}
                ref={chatScrollViewElement}
              ></div>
            </ChatList>
            {isReadAllChat && (
              <Button
                onClick={() => {
                  chatScrollViewElement?.current?.scrollIntoView({
                    block: 'end',
                    inline: 'end',
                    behavior: 'smooth',
                  });
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
                  placeholder={roomName?.split('_')[0] + ' 에 메시지 보내기'}
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
            dispatch(addUser({ username, key }));
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

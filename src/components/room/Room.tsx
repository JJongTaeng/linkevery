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
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import ChatBubble from '../chat/ChatBubble';
import TopMenuContainer from '../container/TopMenuContainer';
import SvgArrowDown from '../icons/ArrowDown';
import SvgScreenShareOn from '../icons/ScreenShareOn';
import SvgSend from '../icons/Send';
import SvgSpeakerOn from '../icons/SpeakerOn';
import {
  ChatContainer,
  ChatForm,
  ChatList,
  ContentContainer,
  MemberList,
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
  const app = useRef(AppServiceImpl.getInstance()).current;
  const { roomName } = useParams<{
    roomName: string;
  }>();
  const { myName, messageList, member, leftSideView, isReadAllChat } =
    useAppSelector((state) => ({
      leftSideView: state.room.leftSideView,
      myName: state.room.username,
      member: state.room.member,
      messageList: state.chat.messageList,
      isReadAllChat: state.room.isScrollButtonView,
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
        username: myName,
      }),
    );
    setMessage('');
  };

  const handleScrollChatList = () => {
    if (utils.isBottomScrollElement(chatListElement.current!)) {
      dispatch(roomActions.changeIsScrollBottomView(false));
    }
  };

  useEffect(() => {
    if (myName && roomName) {
      app.dispatch.sendConnectMessage({});
      app.dispatch.sendJoinRoomMessage({ roomName });
      dispatch(roomActions.setRoomName(roomName));
      storage.setItem('roomName', roomName);
    } else {
      setUsernameModalVisible(true);
    }
  }, [myName, roomName]);

  useEffect(() => {
    if (!member[selectedClientId])
      dispatch(roomActions.changeLeftSideView(false));
  }, [member]);

  useEffect(() => {
    if (utils.isBottomScrollElement(chatListElement.current!)) {
      chatScrollViewElement?.current?.scrollIntoView({
        block: 'end',
        inline: 'end',
        behavior: 'smooth',
      });
    } else {
      dispatch(roomActions.changeIsScrollBottomView(true));
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
        <MemberList>
          <div className="member-item">{myName} - me</div>
          {Object.keys(member).map((clientId) => (
            <div key={clientId} className="member-item">
              <span>{member[clientId].username}</span>
              {member[clientId].voiceStatus && (
                <Button size="small" shape="circle" icon={<SvgSpeakerOn />} />
              )}
              {member[clientId].screenShareStatus && (
                <Button
                  className={'screen-share-button'}
                  size="small"
                  shape="circle"
                  onClick={() => {
                    if (clientId === selectedClientId) {
                      dispatch(roomActions.changeLeftSideView(false));
                      setSelectedClientId('');
                    } else {
                      dispatch(roomActions.changeLeftSideView(true));
                      setSelectedClientId(clientId);
                      videoManager.appendVideoNode(clientId);
                    }
                  }}
                  icon={<SvgScreenShareOn />}
                />
              )}
            </div>
          ))}
        </MemberList>
        <ContentContainer>
          <VideoContainer
            id={'video-container'}
            isVisible={leftSideView}
          ></VideoContainer>
          <ChatContainer>
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
            dispatch(roomActions.setUsername({ username }));
            storage.setItem('username', username);
            setUsernameModalVisible(false);
          }}
        />
      </RoomContent>
    </>
  );
};

export default Room;

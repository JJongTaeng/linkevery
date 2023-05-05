import { Button } from 'antd';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AppServiceImpl } from '../../service/app/AppServiceImpl';
import { videoManager } from '../../service/media/VideoManager';
import { StorageService } from '../../service/storage/StorageService';
import { utils } from '../../service/utils/Utils';
import { chatActions } from '../../store/features/chatSlice';
import { roomActions } from '../../store/features/roomSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { highlight } from '../../style';
import { TOP_MENU_HEIGHT } from '../../style/constants';
import ChatBubble from '../chat/ChatBubble';
import TopMenuContainer from '../container/TopMenuContainer';
import SvgArrowDown from '../icons/ArrowDown';
import SvgScreenShareOn from '../icons/ScreenShareOn';
import SvgSend from '../icons/Send';
import SvgSpeakerOn from '../icons/SpeakerOn';
import UsernameModal from './UsernameModal';

const storage = StorageService.getInstance();

const Room = () => {
  const chatScrollViewElement = useRef<HTMLDivElement>(null);
  const chatListElement = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [scrollBottomButtonView, setScrollBottomButtonView] = useState(false);
  const app = useRef(AppServiceImpl.getInstance()).current;
  const { roomName } = useParams<{
    roomName: string;
  }>();
  const { myName, messageList, member, leftSideView } = useAppSelector(
    (state) => ({
      leftSideView: state.room.leftSideView,
      myName: state.room.username,
      member: state.room.member,
      messageList: state.chat.messageList,
    }),
  );
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
      setScrollBottomButtonView(false);
    }
  };

  useEffect(() => {
    if (myName && roomName) {
      app.dispatch.sendConnectMessage({});
      app.dispatch.sendJoinRoomMessage({ roomName });
      dispatch(roomActions.setRoomName(roomName));
      storage.setItem('roomName', roomName);
    } else {
      setOpen(true);
    }

    return () => {
      app.disconnect();
      dispatch(chatActions.resetChatList());
    };
  }, [myName, roomName]);

  useEffect(() => {
    if (utils.isBottomScrollElement(chatListElement.current!)) {
      chatScrollViewElement?.current?.scrollIntoView({
        block: 'end',
        inline: 'end',
        behavior: 'smooth',
      });
    } else {
      setScrollBottomButtonView(true);
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
            {scrollBottomButtonView && (
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
                  placeholder={roomName?.split('_')[0] + '에 메시지 보내기'}
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
          open={open}
          onSubmit={(username) => {
            dispatch(roomActions.setUsername({ username }));
            storage.setItem('username', username);
            setOpen(false);
          }}
        />
      </RoomContent>
    </>
  );
};

const RoomContent = styled.div`
  width: 100%;
  height: calc(100% - ${TOP_MENU_HEIGHT}px);
  display: flex;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  padding: 16px;

  background-color: ${({ theme }) => theme.color.primary800};

  .member-item:nth-child(1) {
    color: ${({ theme }) => theme.color.primary100};
    font-weight: bold;
  }
  .member-item {
    color: ${({ theme }) => theme.color.grey100};
    margin-bottom: 16px;
    path {
      stroke: #000;
    }
    .ant-btn {
      margin-left: 4px;
    }
    .screen-share-button {
      animation: ${highlight} 2s 1s infinite linear alternate;
    }
  }
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

const VideoContainer = styled.div<{ isVisible: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: ${({ isVisible }) => (isVisible ? '70%' : '0px')};
  height: 100%;
  transition: 0.3s;
  background-color: ${({ theme }) => theme.color.primary400};

  video {
    width: 100%;
    height: 100%;
  }
`;

const ChatContainer = styled.div`
  width: 100%;
  min-width: 30%;
  position: relative;
  .ant-btn-dangerous {
    position: absolute;
    left: calc(50% - 16px);
    bottom: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
    path {
      stroke: #ff7875;
      fill: #ff7875;
    }
    animation: ${highlight} 2s 1s infinite linear alternate;
  }
`;

const ChatList = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 100px);
  overflow: overlay;
  padding: 20px 40px 0 40px;
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
  left: 20px;
  right: 20px;
  bottom: 20px;

  height: 80px;

  border: 1px solid ${({ theme }) => theme.color.primary400};
  border-radius: 8px;

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

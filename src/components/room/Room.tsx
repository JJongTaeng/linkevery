import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useChat } from '../../hooks/useChat';
import { useRoom } from '../../hooks/useRoom';
import { AppServiceImpl } from '../../service/app/AppServiceImpl';
import { StorageService } from '../../service/storage/StorageService';
import { useAppSelector } from '../../store/hooks';
import { TOP_MENU_HEIGHT } from '../../style/constants';
import ChatBubble from '../chat/ChatBubble';
import TopMenuContainer from '../container/TopMenuContainer';
import SvgSend from '../icons/Send';

const storage = StorageService.getInstance();

const Room = () => {
  const navigate = useNavigate();
  const app = useRef(AppServiceImpl.getInstance()).current;
  const { chatList, sendChat } = useChat();
  const { member } = useRoom();
  const { roomName } = useParams<{
    roomName: string;
  }>();
  const myName = useAppSelector((state) => state.room.username);
  const [message, setMessage] = useState('');
  const [isShift, setIsShift] = useState<boolean>(false);

  useEffect(() => {
    if (!myName || !roomName) navigate('/');
    app.dispatch.sendConnectMessage({});
    app.dispatch.sendJoinRoomMessage({ roomName });
    storage.setItem('roomName', roomName || '');
    return () => {
      app.disconnect();
    };
  }, []);

  const handleChat = () => {
    if (!message) return;
    sendChat({
      message,
      clientId: storage.getItem('clientId'),
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      username: myName,
    });
    setMessage('');
  };

  return (
    <>
      <TopMenuContainer />
      <RoomContent>
        <MemberList>
          <div className="member-item">{myName} - me</div>
          {Object.keys(member).map((clientId) => (
            <div key={clientId} className="member-item">
              {member[clientId]}
            </div>
          ))}
        </MemberList>
        <ChatContainer>
          <ChatList>
            {chatList.map(({ message, clientId, date, username }) => (
              <ChatBubble
                key={nanoid()}
                message={message}
                date={date}
                username={username}
                isMyChat={clientId === storage.getItem('clientId')}
              />
            ))}
          </ChatList>
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
                placeholder={roomName + '에 메시지 보내기'}
              />
            </div>
            <div className="form-footer">
              <button type="submit">
                <SvgSend />
              </button>
            </div>
          </ChatForm>
        </ChatContainer>
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

  border-top: 1px solid ${({ theme }) => theme.color.grey400};
  background-color: ${({ theme }) => theme.color.grey200};

  .member-item:nth-child(1) {
    color: ${({ theme }) => theme.color.blue800};
    font-weight: bold;
  }
  .member-item {
    color: ${({ theme }) => theme.color.white};
    margin-bottom: 16px;
  }
`;

const ChatContainer = styled.div`
  width: 100%;
  position: relative;
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 100px);
  overflow: auto;
  padding: 20px 16px 0 16px;
  .peer-chat {
    align-self: flex-start;
  }
  .my-chat {
    align-self: flex-end;
  }
  .chat-name,
  .chat-date {
    color: ${({ theme }) => theme.color.grey200};
    font-size: 12px;
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

  border: 1px solid ${({ theme }) => theme.color.grey400};
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
    border-bottom: 1px solid ${({ theme }) => theme.color.grey400};
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
        stroke: ${({ theme }) => theme.color.grey400};
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
    background-color: ${({ theme }) => theme.color.grey400};
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    button {
      background-color: ${({ theme }) => theme.color.grey400};
    }
  }
`;

export default Room;

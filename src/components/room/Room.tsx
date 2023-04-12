import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useChat } from '../../hooks/useChat';
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
  const { roomName } = useParams<{
    roomName: string;
  }>();
  const myName = useAppSelector((state) => state.room.username);

  useEffect(() => {
    if (!myName || !roomName) navigate('/');
    app.dispatch.connectMessage({});
    app.dispatch.joinRoomMessage({ roomName });
    storage.setItem('roomName', roomName || '');
    return () => {
      app.disconnect();
    };
  }, []);

  return (
    <>
      <TopMenuContainer />
      <RoomContent>
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
            if (!e.target?.message?.value) return;
            sendChat({
              message: e.target?.message?.value,
              clientId: storage.getItem('clientId'),
              date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              username: myName,
            });
            e.target.message.value = '';
          }}
        >
          <div className="form-header">
            <textarea
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
      </RoomContent>
    </>
  );
};

const RoomContent = styled.div`
  width: 100%;
  height: calc(100% - ${TOP_MENU_HEIGHT}px);
  padding: 20px;
  position: relative;
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 80px);
  overflow: auto;
  padding: 0 16px;
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
    height: 40px;
  }
`;

export default Room;

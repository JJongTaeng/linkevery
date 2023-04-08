import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AppServiceImpl } from '../../service/app/AppServiceImpl';
import { TOP_MENU_HEIGHT } from '../../style/constants';
import TopMenuContainer from '../container/TopMenuContainer';
import SvgSend from '../icons/Send';
import { useChat } from '../../hooks/useChat';
import { StorageService } from '../../service/storage/StorageService';
import dayjs from 'dayjs';
import { Card } from 'antd';
import { nanoid } from 'nanoid';

const storage = StorageService.getInstance();

const Room = () => {
  const { dispatch, ee } = useRef(AppServiceImpl.getInstance()).current;
  const { chatList, sendChat } = useChat();
  const { roomName } = useParams<{
    roomName: string;
  }>();

  useEffect(() => {
    dispatch.connectMessage({});
    dispatch.joinRoomMessage({ roomName });
  }, []);

  console.log(chatList);

  return (
    <>
      <TopMenuContainer />
      <RoomContent>
        <ChatList>
          {chatList.map(({ message, clientId, date }) => (
            <div
              className={
                storage.getItem('clientId') === clientId
                  ? 'my-chat'
                  : 'peer-chat'
              }
              key={nanoid()}
            >
              <div className={'chat-name'}>{clientId}</div>
              <Card size="small" key={nanoid()}>
                {message}
              </Card>
              <div className={'chat-date'}>{date}</div>
            </div>
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

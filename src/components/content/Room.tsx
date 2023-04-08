import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AppServiceImpl } from '../../service/app/AppServiceImpl';
import { TOP_MENU_HEIGHT } from '../../style/constants';
import TopMenuContainer from '../container/TopMenuContainer';
import SvgSend from '../icons/Send';

const Room = () => {
  const { dispatch } = useRef(AppServiceImpl.getInstance()).current;
  const [message, setMessage] = useState('');
  const params = useParams<{
    roomName: string;
  }>();

  useEffect(() => {
    dispatch.connectMessage({});
  }, []);

  return (
    <>
      <TopMenuContainer />
      <RoomContent>
        <ChatForm
          onSubmit={(e: any) => {
            e.preventDefault();
            dispatch.chatMessage({ message: e.target?.message?.value });
          }}
        >
          <div className="form-header">
            <textarea
              name="message"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              style={{ height: 40 }}
              placeholder={params.roomName + '에 메시지 보내기'}
            />
          </div>
          <div className="form-footer">
            <button type="submit" disabled={!message.length}>
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

  position: relative;
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

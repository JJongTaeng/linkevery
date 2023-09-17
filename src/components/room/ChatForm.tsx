import React, { useRef, useState } from 'react';
import FileUpload from 'components/chat/FileUpload';
import { Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import dayjs from 'dayjs';
import { storage } from '../../service/storage/StorageService';
import { chatActions } from '../../store/features/chatSlice';
import { addChatByDB } from '../../store/thunk/chatThunk';
import { useApp } from '../../hooks/useApp';

const ChatForm = () => {
  const { app, chatDispatch } = useApp();
  const focusInput = useRef<HTMLInputElement>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isShiftKeyDowned, setIsShiftKeydowned] = useState(false);
  const { username } = useAppSelector((state) => ({
    username: state.user.username,
  }));
  const dispatch = useAppDispatch();

  const sendChatMessage = (type = 'text', image?: string) => {
    if (type === 'text' && !chatMessage) return;
    const date = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
    const message: any = {
      image: image,
      text: chatMessage,
    };
    const messageProtocol = {
      messageType: type,
      messageKey: storage.getItem('userKey') + username + date,
      message: message[type],
      userKey: storage.getItem('userKey'),
      date,
      username,
    };

    chatDispatch.sendChatSendMessage(messageProtocol); // send
    dispatch(chatActions.addChat(messageProtocol)); // store add

    // db add
    dispatch(
      addChatByDB({
        ...messageProtocol,
        roomName: storage.getItem('roomName'),
      }),
    );
    setChatMessage('');
  };
  const handleChatKeydown = (e: any) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (isShiftKeyDowned) {
          setChatMessage(chatMessage + '\n');
          return;
        }
        if (e.nativeEvent.isComposing) return;
        sendChatMessage();
        e.target.value = '';
        focusInput?.current?.focus();
        e.target.focus();
        break;
      case 'Shift':
        setIsShiftKeydowned(true);
        break;
    }
  };

  const handleChatKeyup = (e: any) => {
    switch (e.key) {
      case 'Shift':
        setIsShiftKeydowned(false);
        break;
    }
  };

  const handleChatSubmit = (e?: any, type = 'text') => {
    e?.preventDefault();
    sendChatMessage(type);

    focusInput?.current?.focus();
    e && e.target.message.focus();
  };

  return (
    <StyledChatForm autoComplete="off" onSubmit={(e) => handleChatSubmit(e)}>
      <div className="form-header">
        <textarea
          value={chatMessage}
          onKeyDown={handleChatKeydown}
          onKeyUp={handleChatKeyup}
          onChange={(e) => {
            setChatMessage(e.target.value);
          }}
          name="message"
          style={{ height: 40 }}
          placeholder={'이곳에 보낼 채팅을 적어주세요'}
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
        <FormControllerWrapper>
          <FileUpload
            onFileChange={(file) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                sendChatMessage('image', reader.result as string);
              };
              reader.readAsDataURL(file as any);
            }}
          />
        </FormControllerWrapper>
        <div>
          <Button
            shape="circle"
            icon={<SendOutlined rev={undefined} />}
            htmlType="submit"
          ></Button>
        </div>
      </div>
    </StyledChatForm>
  );
};

const FormControllerWrapper = styled.div`
  display: flex;
`;

const StyledChatForm = styled.form`
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

  .form-header {
    height: 40px;
  }

  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: ${({ theme }) => theme.color.grey800};
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    padding: 0 8px;
  }
`;

export default ChatForm;

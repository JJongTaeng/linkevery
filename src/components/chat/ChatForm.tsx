import React, { useRef, useState } from 'react';
import UploadButton from 'components/chat/UploadButton';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import dayjs from 'dayjs';
import { storage } from 'service/storage/StorageService';
import { chatActions } from 'store/features/chatSlice';
import { addChatByDB } from 'store/thunk/chatThunk';
import { useApp } from 'hooks/useApp';
import SvgSend from 'components/icons/Send';
import Button from 'components/elements/Button';
import { utils } from 'service/utils/Utils';
import PreFileFormat from 'components/chat/PreFileFormat';
import SvgImageUploadIcon from 'components/icons/ImageUploadIcon';
import SvgFileUploadIcon from 'components/icons/FileUploadIcon';
import { EVENT_NAME } from 'constants/gtm';

const ChatForm = () => {
  const { app, chatEmitter } = useApp();
  const focusInput = useRef<HTMLInputElement>(null);
  const focusTextArea = useRef<HTMLTextAreaElement>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [dataUrlFilenameList, setDataUrlFilenameList] = useState<
    { dataUrl: string; filename: string }[]
  >([]);
  const [isShiftKeyDowned, setIsShiftKeydowned] = useState(false);
  const { username } = useAppSelector((state) => ({
    username: state.user.username,
  }));
  const dispatch = useAppDispatch();

  const sendChatMessage = (type = 'text') => {
    if (type === 'text' && !chatMessage) return;
    if (type === 'file' && !dataUrlFilenameList.length) return;
    const date = dayjs().format('YYYYMMDDHHmmssSSS');
    const message: any = {
      file: dataUrlFilenameList,
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

    chatEmitter.sendChatSendMessage(messageProtocol); // send
    dispatch(chatActions.addChat(messageProtocol)); // store add

    // db add
    dispatch(
      addChatByDB({
        ...messageProtocol,
        roomName: storage.getItem('roomName'),
      }),
    );
    window.dataLayer.push({
      event: EVENT_NAME.chatSend,
      roomName: storage.getItem('roomName'),
      username,
    });
    setChatMessage('');
    setDataUrlFilenameList([]);
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
        if (dataUrlFilenameList.length) sendChatMessage('file');
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

  const handleFileChange = async (files: File[]) => {
    const dataUrlList = await utils.convertFilesToDataUrls(files);
    const dataUrlFilenameList = dataUrlList.map((dataUrl, index) => ({
      dataUrl,
      filename: files[index].name,
    }));
    setDataUrlFilenameList([...dataUrlFilenameList]);
    focusTextArea.current?.focus();
  };

  const handleChatSubmit = (e?: any, type = 'text') => {
    e?.preventDefault();
    if (chatMessage) {
      sendChatMessage('text');
    }
    if (dataUrlFilenameList) {
      sendChatMessage('file');
    }

    focusInput?.current?.focus();
    e && e.target.message.focus();
  };

  return (
    <StyledChatForm autoComplete="off" onSubmit={(e) => handleChatSubmit(e)}>
      {dataUrlFilenameList.length ? (
        <PreFileFormat
          dataUrlFilenameList={dataUrlFilenameList}
          onRemove={(index: number) => {
            const newArr = dataUrlFilenameList.filter((_, i) => i !== index);
            setDataUrlFilenameList([...newArr]);
          }}
        />
      ) : null}
      <div className="form-header">
        <textarea
          ref={focusTextArea}
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
          <UploadButton
            multiple={true}
            accept="image/png, image/jpeg"
            icon={<SvgImageUploadIcon />}
            onFileChange={handleFileChange}
          />
          <UploadButton
            accept={'application/pdf'}
            icon={<SvgFileUploadIcon />}
            onFileChange={handleFileChange}
          />
        </FormControllerWrapper>
        <div>
          <Button style={{ background: 'white' }} type={'submit'}>
            <SvgSend />
          </Button>
        </div>
      </div>
    </StyledChatForm>
  );
};

const FormControllerWrapper = styled.div`
  display: flex;
  gap: 4px;
`;

const StyledChatForm = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
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

  .form-header {
    height: 40px;
  }

  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: ${({ theme }) => theme.color.primary200};
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    padding: 0 8px;
  }
`;

export default ChatForm;

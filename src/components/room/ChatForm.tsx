import React from 'react';
import FileUpload from 'components/chat/FileUpload';
import { Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useChat } from '../../hooks/room/useChat';

const ChatForm = () => {
  const {
    state,
    setChatMessage,
    sendChatMessage,
    handleChatKeydown,
    handleChatSubmit,
    handleChatKeyup,
    elements: { focusInput },
  } = useChat();

  return (
    <StyledChatForm autoComplete="off" onSubmit={(e) => handleChatSubmit(e)}>
      <div className="form-header">
        <textarea
          value={state.chatMessage}
          onKeyDown={handleChatKeydown}
          onKeyUp={handleChatKeyup}
          onChange={(e) => setChatMessage(e.target.value)}
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

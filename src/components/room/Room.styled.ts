import styled from 'styled-components';
import { highlight } from '../../style';

export const RoomContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

export const VideoContainer = styled.div<{
  isVisible: boolean;
  isFullScreen: boolean;
}>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  ${({ theme, isVisible }) =>
    isVisible
      ? `
        padding: 10px;
        width: 70%;
        border-left: 1px solid ${theme.color.primary400};
        border-right: 1px solid ${theme.color.primary400};
      `
      : `
        padding: 0;
        width: 0px;
        border: 0;
  `};
  ${({ theme, isVisible }) => theme.media.tablet`
    ${isVisible ? 'width: 100%' : 'width: 0px'}
  `};
  height: 100%;
  transition: 0.3s;
  background-color: ${({ theme }) => theme.color.primary800};

  ${({ isFullScreen }) =>
    isFullScreen
      ? `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
  `
      : ''}

  video {
    width: 100%;
    height: 100%;
  }

  &:hover > .full-screen {
    opacity: 1;
    cursor: pointer;
  }
  .full-screen:hover {
    transform: scale(1.1);
  }
  .full-screen {
    z-index: 100;
    opacity: 0;
    position: absolute;
    right: 20px;
    top: 20px;
    background: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      width: 20px;
      height: 20px;
    }
    ${({ isVisible }) => (isVisible ? '' : 'width: 0px; height: 0px;')}
  }
  &:hover > .close-video {
    opacity: 1;
    cursor: pointer;
  }
  .close-video:hover {
    transform: scale(1.1);
  }
  .close-video {
    z-index: 100;
    opacity: 0;
    position: absolute;
    left: 20px;
    top: 20px;
    background: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      width: 30px;
      height: 30px;
    }
    ${({ isVisible }) => (isVisible ? '' : 'width: 0px; height: 0px;')}
  }
`;

export const ChatContainer = styled.div<{ leftSideView: boolean }>`
  width: 100%;
  min-width: 30%;
  position: relative;
  ${({ theme, leftSideView }) => theme.media.tablet`
      ${leftSideView ? 'display: none' : ''}
  `};
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

export const ChatList = styled.div`
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

export const ChatForm = styled.form`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;

  height: 80px;

  border: 1px solid ${({ theme }) => theme.color.primary400};
  border-radius: 8px;

  box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.2);

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

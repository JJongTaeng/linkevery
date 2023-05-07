import styled from 'styled-components';
import { highlight } from '../../style';
import { TOP_MENU_HEIGHT } from '../../style/constants';

export const RoomContent = styled.div`
  width: 100%;
  height: calc(100% - ${TOP_MENU_HEIGHT}px);
  display: flex;
  ${({ theme }) => theme.media.mobile`
    flex-direction: column;
  `}
`;

export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  ${({ theme }) => theme.media.mobile`
    width: 100%;
    height: 66px;
    overflow: overlay;
    border-bottom: 1px solid ${theme.color.primary400};
    padding: 8px;
  `}
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

export const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  ${({ theme }) => theme.media.mobile`
      height: calc(100% - 66px);
  `}
`;

export const VideoContainer = styled.div<{ isVisible: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: ${({ isVisible }) => (isVisible ? '70%' : '0px')};
  height: 100%;
  transition: 0.3s;
  background-color: ${({ theme }) => theme.color.primary400};

  ${({ theme, isVisible }) => theme.media.mobile`
    width: 0px;
  `}
  video {
    width: 100%;
    height: 100%;
  }
`;

export const ChatContainer = styled.div`
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

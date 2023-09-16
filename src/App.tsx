import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ContentContainer from './components/container/ContentContainer';
import LeftMenuContainer from './components/container/LeftMenuContainer';
import TopMenuContainer from './components/container/TopMenuContainer';
import { TOP_MENU_HEIGHT } from './style/constants';

function App() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const broadChannel = new BroadcastChannel('connection');
    broadChannel.onmessage = (e) => {
      if (e.data) {
        navigate('/');
        setOpen(true);
      }
    };
    broadChannel.postMessage(true);
  }, []);
  return (
    <Container>
      <TopMenuContainer />
      <div className={'main-content-container'}>
        <LeftMenuContainer />
        <ContentSection>
          <ContentContainer />
        </ContentSection>
      </div>

      <Modal
        closable={false}
        footer={
          <Button type="primary" onClick={() => window.location.reload()}>
            확인
          </Button>
        }
        title={'알림'}
        open={open}
      >
        <p>
          다른 브라우저 탭에서 이용 중입니다. "확인"을 누르면 해당 탭에서
          서비스를 이용합니다.
        </p>
      </Modal>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.color.white};
  .main-content-container {
    width: 100%;
    height: calc(100% - ${TOP_MENU_HEIGHT}px);
    display: flex;
  }
`;

const ContentSection = styled.section`
  width: 100%;
  height: 100%;

  overflow: auto;
`;

export default App;

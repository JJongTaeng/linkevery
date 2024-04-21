import React from 'react';
import styled from 'styled-components';
import SvgHashtag from 'components/icons/Hashtag.tsx';
import SpeakerOn from 'components/icons/SpeakerOn.tsx';
import Divider from 'components/elements/Divider.tsx';
import { Member } from 'service/db/LinkeveryDB.ts';

interface MemberListProps {
  member: Member;
}

const MemberListVer2 = ({ member }) => {
  return (
    <Container>
      <RoomNameTitle>MY ROOM</RoomNameTitle>
      <Divider style={{ margin: '12px 0' }} />
      <Menu>
        <SvgHashtag /> <MenuTitle>참가자</MenuTitle>
      </Menu>
      <MemberList>
        <div>
          <span>인태</span>
        </div>
      </MemberList>
      <Divider style={{ margin: '12px 0' }} />
      <Menu>
        <SpeakerOn /> <MenuTitle>음성 참가자</MenuTitle>
      </Menu>
      <MemberList>
        <div>
          <span>혜린</span>
        </div>
      </MemberList>
    </Container>
  );
};

const Container = styled.nav`
  box-sizing: border-box;
  width: 240px;
  height: 100%;
  padding: 12px 4px;
  background-color: ${({ theme }) => theme.color.primary400};
`;

const Menu = styled.div`
  padding-left: 4px;
  display: flex;
  align-items: center;
  margin: 0 0 4px 4px;
  font-size: 14px;
  width: 220px;
  cursor: pointer;
  height: 24px;
  border-radius: 4px;
  &:hover {
    background-color: ${({ theme }) => theme.color.primary100};
  }
`;

const MenuTitle = styled.span`
  color: ${({ theme }) => theme.color.dark200};
  margin-left: 4px;
  font-weight: bold;
`;

const MemberList = styled.div`
  font-size: 14px;
  margin-left: 26px;
`;

const RoomNameTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-left: 8px;

  color: ${({ theme }) => theme.color.dark200};
`;

export default MemberListVer2;

import React, { useMemo } from 'react';
import styled from 'styled-components';
import SvgHashtag from 'components/icons/Hashtag.tsx';
import SpeakerOn from 'components/icons/SpeakerOn.tsx';
import Divider from 'components/elements/Divider.tsx';
import { Member } from 'service/db/LinkeveryDB.ts';

interface MemberListProps {
  member: Member;
}

const MemberListVer2 = ({ member = {} }: MemberListProps) => {
  const voiceOffMemberKeys = useMemo(
    () =>
      Object.keys(member)
        .filter((userKey) => !member[userKey].voiceStatus)
        .sort((a, b) => Number(member[b].on) - Number(member[a].on)),
    [member],
  );
  const voiceOnMemberKeys = useMemo(
    () => Object.keys(member).filter((userKey) => member[userKey].voiceStatus),
    [member],
  );

  return (
    <Container>
      <section>
        <RoomNameTitle>MY ROOM</RoomNameTitle>
        <Divider style={{ margin: '12px 0' }} />
        <Menu>
          <SvgHashtag /> <MenuTitle>참가자</MenuTitle>
        </Menu>
        <MemberList>
          {voiceOffMemberKeys.map((key) => (
            <MemberItem key={key} $on={member[key].on}>
              {member[key].username}
            </MemberItem>
          ))}
        </MemberList>
        <Divider style={{ margin: '12px 0' }} />
        <Menu>
          <SpeakerOn /> <MenuTitle>음성 참가자</MenuTitle>
        </Menu>
        <MemberList>
          {voiceOnMemberKeys.map((key) => (
            <MemberItem key={key} type="voice" $on={member[key].on}>
              {member[key].username}
            </MemberItem>
          ))}
        </MemberList>
      </section>
      <MyInfo></MyInfo>
    </Container>
  );
};

const Container = styled.nav`
  box-sizing: border-box;
  width: 240px;
  height: 100%;
  padding-top: 12px;
  background-color: ${({ theme }) => theme.color.primary400};

  display: flex;
  flex-direction: column;
  section {
    flex: 1 1 auto;
  }
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

const MemberList = styled.div``;

const MemberItem = styled.div<{ $on: boolean; type?: string }>`
  font-size: 14px;
  width: 198px;
  height: 20px;
  padding-left: 4px;
  margin-left: 22px;
  margin-bottom: 4px;
  border-radius: 4px;

  &:hover {
    ${({ type, theme }) =>
      type === 'voice' ? `background-color: ${theme.color.primary100};` : ''}
  }
  ${({ type, theme }) => (type === 'voice' ? `cursor: pointer;` : '')}
  color: ${({ $on, theme }) =>
    $on ? theme.color.dark100 : theme.color.grey400};
`;

const RoomNameTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-left: 8px;

  color: ${({ theme }) => theme.color.dark200};
`;

const MyInfo = styled.div`
  height: 144px;
  background-color: ${({ theme }) => theme.color.primary300};
`;

export default MemberListVer2;

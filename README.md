# linkevery

RTC를 이용한 웹 채팅 어플리케이션

## 기능명세

### 방

- 모든 방은 게스트 형태로 구현(id, pwd같은 인증 없음)
- 좌측에 사이드바에서 방 생성 및 참가
- 방에 참가 시 닉네임을 입력해야함
- 방은 시크릿모드랑 일반모드 2개
- 시크릿모드의 경우 비밀번호를 입력해야 방 입장 가능
- 방은 아무도 없는 상태에서 1분이 지나면 자동 소멸
- 최대 방의 개수는 20개

### 채팅

- 방을 들어가면 바로 방 인원들과 채팅 가능
- 보이스 채팅은 좌측 하단에 보이스 참여 toggle on하면 toggle on 된 사람들끼리 사용가능
- 보이스는 껏다킬수있음
- 화상 채팅은 후순위 개발

### 화면공유

- 보이스 on이 된상태에서 화면 공유 버튼을 누르면 rtc로 화면공유 연결

## 프로토콜 정의

```typescript
interface Protocol {
  messageType: MESSAGE_TYPE;
  category: CATEGORY;
  messageId: MessageId;
  data: ProtocolData;
}
```

CATEGORY
CONNECTION - socket connection
SIGNALING - rtc signaling
CHAT - chat

## 저장 데이터 구조

- UserKey: primary key // 저장 데이터 조회용 키값 (통신 키 값과는 별개)

- RoomList: string[]
  - id: string
  - messageList: ChatType[]

### 특이사항

1. peerConnection의 생성시점
   - CONNECT 카테고리에서 room에 입장 시 rtcManager에 peerConnection은 생성된 상태
   - offer는 시그널링 단계에서 시작 (아마 보이스 채팅 시작 시)

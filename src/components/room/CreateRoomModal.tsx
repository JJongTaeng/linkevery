import { Form, Input, Modal } from 'antd';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { roomActions } from 'store/features/roomSlice';
import { useAppDispatch } from 'store/hooks';
import { addRoomByDB } from 'store/thunk/roomThunk';

interface CreateRoomModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateRoomModal = ({ open, setOpen }: CreateRoomModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Modal
      title={'방 생성'}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => setOpen(false)}
      open={open}
    >
      <Form
        form={form}
        name="basic"
        style={{ maxWidth: 600 }}
        onFinish={(values) => {
          const roomName = values.roomName + '+' + nanoid();
          dispatch(roomActions.setRoomName(roomName));
          dispatch(addRoomByDB({ roomName, member: {} }));

          form.resetFields();
          navigate(`/${roomName}`);
          setOpen(false);
        }}
        autoComplete="off"
      >
        <Form.Item
          label="이름"
          name="roomName"
          rules={[{ required: true, message: '방 이름을 입력해주세요~!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRoomModal;

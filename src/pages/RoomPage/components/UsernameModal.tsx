import { Button, Form, Input, Modal } from 'antd';
import { EVENT_NAME } from '../../../constants/gtm';

interface UsernameModalProps {
  open: boolean;
  onSubmit: (username: string) => void;
}

const UsernameModal = ({ open, onSubmit }: UsernameModalProps) => {
  const [form] = Form.useForm();
  return (
    <Modal
      closable={false}
      footer={
        <>
          <Button type="primary" onClick={() => form.submit()}>
            등록
          </Button>
        </>
      }
      title={'사용자 이름 등록'}
      open={open}
    >
      <p>안녕하세요! 사용할 이름을 등록해주세요.</p>
      <p>변경이 힘드니 신중하게 정해주세요.</p>
      <Form
        form={form}
        onFinish={({ username }) => {
          window.dataLayer.push({
            event: EVENT_NAME.userCreate,
            username,
          });
          onSubmit(username);
        }}
      >
        <Form.Item
          name="username"
          label="사용자명"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UsernameModal;

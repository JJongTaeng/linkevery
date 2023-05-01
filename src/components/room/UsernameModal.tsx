import { Button, Form, Input, Modal } from 'antd';

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
      <Form
        form={form}
        onFinish={({ username }) => {
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

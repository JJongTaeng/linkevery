import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, UploadFile, UploadProps } from 'antd';

interface FileUploadProps {
  onFileChange: (file: File) => void;
  onRemove?: (file: UploadFile<any>) => void;
}

const FileUpload = ({ onFileChange, onRemove }: FileUploadProps) => {
  const props: UploadProps = {
    beforeUpload: (file) => {
      if(file.type.includes('image')) onFileChange(file);
      return false;
    },
    onRemove: (file) => {
      onRemove && onRemove(file);
    },
    maxCount: 1,
  };
  return (
    <>
      <Upload accept="image/png, image/jpeg" fileList={[]} {...props}>
        <Button
          shape="circle"
          icon={<UploadOutlined rev={undefined} />}
        ></Button>
      </Upload>
    </>
  );
};

export default FileUpload;

import { UploadFile } from 'antd';
import { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { nanoid } from 'nanoid';

interface UploadButtonProp extends HTMLAttributes<HTMLInputElement> {
  onFileChange: (file: File[]) => void;
  onRemove?: (file: UploadFile<any>) => void;
  icon: React.ReactNode;
  multiple?: boolean;
  accept: string;
}

const UploadButton = ({
  onFileChange,
  onRemove,
  icon,
  accept,
  multiple,
  ...props
}: UploadButtonProp) => {
  const id = nanoid();
  return (
    <FileUploadButtonContainer>
      <label htmlFor={id}>
        <div>{icon}</div>
      </label>
      <input
        id={id}
        onChange={(e) => {
          const files: File[] = [];
          for (let i = 0; i < e.target.files!.length; i++) {
            files.push(e.target.files![i]);
          }
          const isSendableFile = !files.filter(
            (file) =>
              !file.type.includes('image') && !file.type.includes('pdf'),
          ).length;
          if (isSendableFile) {
            onFileChange(files);
          }
        }}
        type={'file'}
        accept={accept}
        multiple={multiple}
        {...props}
      ></input>
    </FileUploadButtonContainer>
  );
};

const FileUploadButtonContainer = styled.div`
  input {
    display: none;
  }

  label {
    width: 32px;
    height: 32px;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-content: center;
    background: white;
    border: 1px solid #eee;

    cursor: pointer;

    div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  label:hover {
    svg {
      transform: scale(1.1);
    }
  }
`;

export default UploadButton;

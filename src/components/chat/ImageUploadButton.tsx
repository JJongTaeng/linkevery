import { UploadFile } from 'antd';
import { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import SvgImageUploadIcon from '../icons/ImageUploadIcon';

interface FileUploadProps extends HTMLAttributes<HTMLInputElement> {
  onFileChange: (file: File[]) => void;
  onRemove?: (file: UploadFile<any>) => void;
}

const ImageUploadButton = ({
  onFileChange,
  onRemove,
  ...props
}: FileUploadProps) => {
  const id = nanoid();
  return (
    <FileUploadButtonContainer>
      <label htmlFor={id}>
        <div>
          <SvgImageUploadIcon />
        </div>
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
        multiple={true}
        accept="image/png, image/jpeg, application/pdf"
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

export default ImageUploadButton;

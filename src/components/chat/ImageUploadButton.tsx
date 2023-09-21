import { UploadFile } from 'antd';
import { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import SvgImageUploadIcon from '../icons/ImageUploadIcon';
import Button from '../elements/Button';

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
        <Button>
          <SvgImageUploadIcon />
        </Button>
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
            console.log(files);
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
  }
`;

export default ImageUploadButton;

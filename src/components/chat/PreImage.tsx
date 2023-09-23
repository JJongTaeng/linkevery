import React from 'react';
import styled from 'styled-components';
import SvgCloseButton from '../icons/CloseButton';
import Button from '../elements/Button';
import { nanoid } from 'nanoid';

interface PreImageProps {
  dataUrlList: any[];
  onRemove: (index: number) => void;
}

const PreImage = ({ dataUrlList, onRemove }: PreImageProps) => {
  return (
    <PreImageContainer>
      {dataUrlList.map((dataUrl, index) => (
        <ImageItem key={nanoid()}>
          <CloseButton onClick={() => onRemove(index)}>
            <SvgCloseButton />
          </CloseButton>
          <img src={dataUrl} />
        </ImageItem>
      ))}
    </PreImageContainer>
  );
};

const PreImageContainer = styled.div`
  position: absolute;
  top: -200px;
  width: 100%;
  display: flex;
  height: 200px;
  padding: 8px;
  gap: 24px;

  align-items: center;

  background: rgba(0, 0, 0, 0.5);
`;

const ImageItem = styled.div`
  position: relative;
  background: white;
  img {
    width: 150px;
    height: 150px;
    object-fit: contain;
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  width: 24px;
  height: 24px;
  right: -12px;
  top: -12px;
  cursor: pointer;
  background: white;

  z-index: 100;
  &:hover {
    svg {
      transform: scale(1.1);
    }
  }
  svg {
    width: 24px;
    height: 24px;
  }
`;

export default PreImage;

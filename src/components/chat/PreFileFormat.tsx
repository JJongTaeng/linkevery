import React from 'react';
import styled from 'styled-components';
import SvgCloseButton from '../icons/CloseButton';
import Button from '../elements/Button';
import { nanoid } from 'nanoid';
import SvgPdfIcon from '../icons/PdfIcon';
import { utils } from '../../service/utils/Utils';

interface PreImageProps {
  dataUrlFilenameList: { dataUrl: string; filename: string }[];
  onRemove: (index: number) => void;
}

const PreFileFormat = ({ dataUrlFilenameList, onRemove }: PreImageProps) => {
  return (
    <PreImageContainer>
      {dataUrlFilenameList.map((dataUrlFilename, index) => {
        const { dataUrl, filename } = dataUrlFilename;
        const type = utils.getFileTypeFromDataUrl(dataUrl);
        return (
          <ImageItem key={nanoid()}>
            <CloseButton onClick={() => onRemove(index)}>
              <SvgCloseButton />
            </CloseButton>
            {
              {
                image: <img src={dataUrl} />,
                pdf: (
                  <PrePdfContainer>
                    <SvgPdfIcon />
                    <span>{filename}</span>
                  </PrePdfContainer>
                ),
                ppt: <></>,
                unknown: <></>,
              }[type]
            }
          </ImageItem>
        );
      })}
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
  img {
    width: 150px;
    height: 150px;
    object-fit: contain;
  }
  svg {
    width: 150px;
    height: 150px;
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

const PrePdfContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;

export default PreFileFormat;

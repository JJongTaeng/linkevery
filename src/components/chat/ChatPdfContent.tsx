import React from 'react';
import { nanoid } from 'nanoid';
import { utils } from '../../service/utils/Utils';
import styled from 'styled-components';
import SvgPdfIcon from '../icons/PdfIcon';
import SvgDownload from '../icons/Download';

interface ChatPdfContentProps {
  dataUrlFilenameList: { dataUrl: string; filename: string }[];
}
const ChatPdfContent = ({ dataUrlFilenameList }: ChatPdfContentProps) => {
  return (
    <>
      {dataUrlFilenameList.map((dataUrlFilename) => {
        const { dataUrl, filename } = dataUrlFilename;
        return (
          <PdfIconContainer key={nanoid()}>
            <Download
              onClick={() => utils.downloadDataUrl(`${filename}`, dataUrl)}
            >
              <SvgDownload />
            </Download>
            <StyledPdfIcon />
            <span>{filename}</span>
          </PdfIconContainer>
        );
      })}
    </>
  );
};

const StyledPdfIcon = styled(SvgPdfIcon)`
  width: 150px;
  height: 150px;
`;

const PdfIconContainer = styled.div`
  position: relative;
  cursor: pointer;

  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Download = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  transition: 0.3s;
  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.7);
  }

  svg {
    width: 50px;
    height: 50px;
    path {
      stroke: white;
    }
  }
`;

export default ChatPdfContent;

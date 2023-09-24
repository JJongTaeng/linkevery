import React from 'react';
import { Image } from 'antd';
import { nanoid } from 'nanoid';

interface ChatImageContentsProps {
  dataUrlFilenameList: { dataUrl: string; filename: string }[];
}
const ChatImageContents = ({ dataUrlFilenameList }: ChatImageContentsProps) => {
  return (
    <div>
      <Image.PreviewGroup>
        {dataUrlFilenameList.map((dataUrlFilename) => {
          const { dataUrl } = dataUrlFilename;
          return <Image key={nanoid()} width={180} src={dataUrl} />;
        })}
      </Image.PreviewGroup>
    </div>
  );
};

export default ChatImageContents;

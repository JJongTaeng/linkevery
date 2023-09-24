import React from 'react';
import { Image } from 'antd';
import { nanoid } from 'nanoid';

interface ChatImageContentsProps {
  dataUrlList: string[];
}
const ChatImageContents = ({ dataUrlList }: ChatImageContentsProps) => {
  return (
    <div>
      <Image.PreviewGroup>
        {dataUrlList.map((dataUrl) => (
          <Image key={nanoid()} width={180} src={dataUrl} />
        ))}
      </Image.PreviewGroup>
    </div>
  );
};

export default ChatImageContents;

import type { Meta, StoryObj } from '@storybook/react';
import MemberListVer2 from 'pages/RoomPage/components/MemberListVer2.tsx';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/MemberListVer2',
  component: MemberListVer2,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: [],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof MemberListVer2>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    member: {
      asd: {
        username: '인태',
        clientId: 'asdasdfsdf',
        speaking: false,
        voiceStatus: false,
        on: true,
      },
      assssd: {
        username: '현규',
        clientId: 'asdasdfsdf',
        speaking: false,
        voiceStatus: false,
        on: false,
      },
      asdsss11: {
        username: '인태22',
        clientId: 'asdasdfsdf',
        speaking: false,
        voiceStatus: false,
        on: true,
      },
      assasaassd: {
        username: '혜린',
        clientId: 'asdasdfsdf',
        speaking: false,
        voiceStatus: true,
        on: true,
      },
    },
  },
};

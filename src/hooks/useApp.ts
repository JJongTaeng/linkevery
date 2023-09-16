import { useRef } from 'react';
import { container } from 'tsyringe';
import { App } from 'service/app/App';

export const useApp = () => {
  const app = useRef(container.resolve(App)).current;
  return [app];
};

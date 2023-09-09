import { container } from 'tsyringe';
import { App } from './service/app/App';

export const initContainer = () => {
  container.resolve(App);
};

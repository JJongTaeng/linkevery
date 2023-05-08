import { nanoid } from 'nanoid';
import { LinkeveryDB } from './LinkeveryDB';

class Query {
  db = new LinkeveryDB();

  constructor() {
    const userKey = this.db.userKey.where('id').equals(1).first();
    userKey.then((value) => {
      if (!value) {
        this.db.userKey.add({
          userKey: nanoid(),
        });
      }
    });
  }
}

export const query = new Query();

import { isString, typeguard } from 'remote-shortcuts-common/src/utils';

import { CurrentUser } from '../types';

export const currentUserTypeguard = typeguard<{ user: CurrentUser }>([
  'user',
  typeguard(['_id', isString], ['email', isString]),
]);

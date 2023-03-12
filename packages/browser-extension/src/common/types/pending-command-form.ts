import { SupportedAction } from './actions';

export type PendingCommandForm = Readonly<{
  actions: Array<Partial<SupportedAction>>;
  name?: string;
  hostname?: string;
}>;

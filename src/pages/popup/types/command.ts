import { TabAction } from '../../../common';

export type Command = Readonly<{
  id: string;
  hostname: string;
  name: string;
  actions: ReadonlyArray<TabAction>;
}>;

export type PendingCommandForm = Readonly<{
  hostname: string;
  name: string;
  actions: Array<Partial<TabAction>>;
}>;

export type Commands = ReadonlyArray<Command>;

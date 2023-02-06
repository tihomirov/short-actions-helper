import { TabAction } from '../../../common';

export type Command = Readonly<{
  name: string;
  actions: ReadonlyArray<TabAction>;
}>;

export type PendingCommandForm = Readonly<{
  name: string;
  actions: ReadonlyArray<Partial<TabAction>>;
}>;

export type Commands = ReadonlyArray<Command>;

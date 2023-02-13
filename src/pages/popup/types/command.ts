import { TabAction } from '../../../common';

export enum CommandsType {
  General,
  Hostname,
}

export type Command = Readonly<{
  id: string;
  hostname?: string;
  name: string;
  actions: ReadonlyArray<TabAction>;
}>;

export type PendingCommandForm = Readonly<{
  name: string;
  actions: Array<Partial<TabAction>>;
  hostname?: string;
}>;

export type Commands = ReadonlyArray<Command>;

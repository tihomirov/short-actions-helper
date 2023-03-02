import { SupportedAction } from '../../../common';

export enum CommandsType {
  All,
  Hostname,
}

export type Command = Readonly<{
  _id: string;
  hostname?: string;
  name: string;
  actions: ReadonlyArray<SupportedAction>;
}>;

export type PendingCommandForm = Readonly<{
  name: string;
  actions: Array<Partial<SupportedAction>>;
  hostname?: string;
}>;

export type Commands = ReadonlyArray<Command>;

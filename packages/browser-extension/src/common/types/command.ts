import { SupportedAction } from './actions';

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

export type Commands = ReadonlyArray<Command>;

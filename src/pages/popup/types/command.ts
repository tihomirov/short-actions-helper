import { DocumentContentAction } from '../../../common';

export enum CommandsType {
  General,
  Hostname,
}

export type Command = Readonly<{
  id: string;
  hostname?: string;
  name: string;
  actions: ReadonlyArray<DocumentContentAction>;
}>;

export type PendingCommandForm = Readonly<{
  name: string;
  actions: Array<Partial<DocumentContentAction>>;
  hostname?: string;
}>;

export type Commands = ReadonlyArray<Command>;

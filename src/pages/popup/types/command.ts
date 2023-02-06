import { Action, ElementEvent, ElementData } from '../../../common';

export type Command = Readonly<{
  name: string;
  actions: ReadonlyArray<Action>;
}>;

export type PendingCommand = Readonly<{
  name: string;
  actions: ReadonlyArray<{
    event?: ElementEvent;
    element?: Partial<ElementData>;
  }>;
}>;

export type Commands = ReadonlyArray<Command>;

import { Action } from "../../../common";

export type Command = Readonly<{
  name: string;
  actions: ReadonlyArray<Action>;
}>;

export type Commands = ReadonlyArray<Command>;

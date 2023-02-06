import { TabAction } from './tab-action';

export enum TabEvent {
  Debbug = 'SAH_Debbug',
  RunAction = 'SAH_RunAction',
  InterceptElement = 'SAH_InterceptElement',
}

type RunActionTabMessage = Readonly<{
  event: TabEvent.RunAction;
  action: TabAction;
}>;

type InterceptElementTabMessage = Readonly<{
  event: TabEvent.InterceptElement;
}>;

type DebbugTabMessage = Readonly<{
  event: TabEvent.Debbug;
}>;

export type TabMessage = RunActionTabMessage | InterceptElementTabMessage | DebbugTabMessage;

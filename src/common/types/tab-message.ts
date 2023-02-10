import { TabAction } from './tab-action';

export enum TabEvent {
  Debbug = 'SAH_Debbug',
  RunAction = 'SAH_RunAction',
  InterceptElement = 'SAH_InterceptElement',
}

export type RunActionTabMessage = Readonly<{
  event: TabEvent.RunAction;
  action: TabAction;
}>;

export type InterceptElementTabMessage = Readonly<{
  event: TabEvent.InterceptElement;
}>;

export type DebbugTabMessage = Readonly<{
  event: TabEvent.Debbug;
}>;

export type TabMessage = RunActionTabMessage | InterceptElementTabMessage | DebbugTabMessage;

export type TabMessageResponse = {
  [TabEvent.Debbug]: undefined;
  [TabEvent.RunAction]: undefined;
  [TabEvent.InterceptElement]: undefined;
};

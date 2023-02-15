import { DocumentContentAction } from './actions';

export enum TabMessageEvent {
  Debbug = 'SAH_Debbug',
  RunAction = 'SAH_RunAction',
  InterceptElement = 'SAH_InterceptElement',
}

export type RunDocumentContentActionMessage = Readonly<{
  event: TabMessageEvent.RunAction;
  action: DocumentContentAction;
}>;

export type InterceptDocumentElementMessage = Readonly<{
  event: TabMessageEvent.InterceptElement;
}>;

export type DebbugMessage = Readonly<{
  event: TabMessageEvent.Debbug;
}>;

export type TabMessage = RunDocumentContentActionMessage | InterceptDocumentElementMessage | DebbugMessage;

export type TabMessageResponse = {
  [TabMessageEvent.Debbug]: undefined;
  [TabMessageEvent.RunAction]: undefined;
  [TabMessageEvent.InterceptElement]: undefined;
};

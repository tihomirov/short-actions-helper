import { DocumentContentAction } from './actions';

export enum TabMessageEvent {
  Debbug = 'RS_Debbug',
  RunAction = 'RS_RunAction',
  InterceptElement = 'RS_InterceptElement',
}

export type RunDocumentContentActionMessage = Readonly<{
  event: TabMessageEvent.RunAction;
  action: DocumentContentAction;
}>;

export type InterceptDocumentElementMessage = Readonly<{
  event: TabMessageEvent.InterceptElement;
  actionIndex: number;
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

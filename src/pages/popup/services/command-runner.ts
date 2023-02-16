import {
  TabMessageEvent,
  SupportedAction,
  ResponseFactory,
  Response,
  TabMessageResponse,
  ActionType,
  assertUnreachable,
  DocumentContentAction,
  TabAction,
  TabEventType,
} from '../../../common';
import { Command } from '../types';
import { tabsService } from './tabs';

type RunActionMessageResponse = Response<TabMessageResponse[TabMessageEvent.RunAction]>;

class CommandRunnerService {
  async runCommand(command: Command): Promise<void> {
    const { actions } = command;
    const responses: Array<Response<unknown>> = [];

    for (const action of actions) {
      const response = await this.runAction(action);
      responses.push(response);
    }

    const failResponse = responses.find(ResponseFactory.isFail);

    if (failResponse) {
      throw new Error(`Message Error: ${failResponse.data}`);
    }
  }

  private async runAction(action: SupportedAction): Promise<Response<unknown>> {
    const type = action.type;

    switch (type) {
      case ActionType.DocumentContentAction: {
        return await this.runDocumentContentAction(action);
      }
      case ActionType.TabAction: {
        return await this.runTabAction(action);
      }
      default:
        assertUnreachable(type);
    }
  }

  private async runDocumentContentAction(action: DocumentContentAction): Promise<RunActionMessageResponse> {
    return await tabsService.sendMessageToCurrentTab<TabMessageEvent.RunAction>({
      event: TabMessageEvent.RunAction,
      action,
    });
  }

  private async runTabAction(action: TabAction): Promise<Response> {
    try {
      const { tabEvent } = action;

      switch (tabEvent) {
        case TabEventType.Close: {
          await tabsService.closeCurrentTab();
          return ResponseFactory.success(undefined);
        }
        case TabEventType.Reload: {
          await tabsService.reloadCurrentTab();
          return ResponseFactory.success(undefined);
        }
        case TabEventType.ToggleMute: {
          await tabsService.toggleMuteCurrentTab();
          return ResponseFactory.success(undefined);
        }
        default: {
          assertUnreachable(tabEvent);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return ResponseFactory.fail(error.message);
      }

      return ResponseFactory.fail('Unexpected Error; runTabAction');
    }
  }
}

export const commandRunnerService = new CommandRunnerService();

import { ActionType, assertUnreachable, SupportedAction, truncate } from '../../../../common';

export function getPredefinedName(
  name?: string,
  actions?: ReadonlyArray<SupportedAction | Partial<SupportedAction>>,
): string | undefined {
  if (name || !actions || actions.length !== 1) {
    return undefined;
  }

  const [action] = actions;

  if (action.type === undefined) {
    return undefined;
  }

  switch (action.type) {
    case ActionType.DocumentContentAction: {
      const { tagName, innerText, elementEvent } = action;
      return elementEvent && tagName ? `${elementEvent}: <${tagName}> ${truncate(innerText ?? '')}` : undefined;
    }
    case ActionType.TabAction: {
      const { tabEvent } = action;
      return tabEvent !== undefined ? `${tabEvent} Tab` : undefined;
    }
    default:
      assertUnreachable(action.type);
  }
}

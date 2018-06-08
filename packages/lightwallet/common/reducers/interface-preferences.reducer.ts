import { Action } from '@ngrx/store';

const DEFAULT_STATE = {
  isShareDialogDisplayed: false,
};

export interface IInterfaceState {
  isShareDialogDisplayed: boolean;
}

export function InterfaceReducer(state: IInterfaceState = DEFAULT_STATE, action: InterfaceAction) {
  switch (action.type) {
    case InterfaceAction.InterfaceState:
      return {
        ...state,
        isShareDialogDisplayed: action.isShareDialogDisplayed,
      };

    default:
      return state;
  }
}

export namespace InterfaceAction {
  export const InterfaceState = 'InterfaceState';
}

export interface SetShareDialogAction extends Action {
  isShareDialogDisplayed: boolean;
}

export class SetShareDialogAction implements Action {
  readonly type = InterfaceAction.InterfaceState;

  constructor(public isShareDialogDisplayed: boolean) {}
}

export type InterfaceAction = SetShareDialogAction;

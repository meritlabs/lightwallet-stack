import { Action } from '@ngrx/store';

const DEFAULT_STATE = {
  isShareDialogDisplayed: false,
  primaryWallet: '',
};

export interface IInterfaceState {
  isShareDialogDisplayed: boolean;
  primaryWallet: string;
}

export function InterfaceReducer(state: IInterfaceState = DEFAULT_STATE, action: InterfaceAction) {
  switch (action.type) {
    case InterfaceAction.InterfaceState:
      return {
        ...state,
        isShareDialogDisplayed: action.isShareDialogDisplayed,
      };
    case InterfaceAction.primaryWallet:
      return {
        ...state,
        primaryWallet: action.primaryWallet,
      };
    default:
      return state;
  }
}

export namespace InterfaceAction {
  export const InterfaceState = 'InterfaceState';
  export const primaryWallet = 'primaryWallet';
}

export interface SetShareDialogAction extends Action {
  isShareDialogDisplayed: boolean;
}

export class SetShareDialogAction implements Action {
  readonly type = InterfaceAction.InterfaceState;

  constructor(public isShareDialogDisplayed: boolean) {}
}

export interface setPrimaryWallet extends Action {
  primaryWallet: string;
}

export class setPrimaryWallet implements Action {
  readonly type = InterfaceAction.primaryWallet;

  constructor(public primaryWallet: string) {}
}

export type InterfaceAction = SetShareDialogAction & setPrimaryWallet;

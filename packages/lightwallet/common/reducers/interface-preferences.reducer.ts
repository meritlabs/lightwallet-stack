import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

const DEFAULT_STATE = {
  isShareDialogDisplayed: false,
  primaryWallet: '',
};

export interface IInterfaceState {
  isShareDialogDisplayed: boolean;
  primaryWallet: string;
}

export function interfaceReducer(state: IInterfaceState = DEFAULT_STATE, action: InterfaceAction) {
  switch (action.type) {
    case InterfaceActionType.SetShareDialog:
      return {
        ...state,
        isShareDialogDisplayed: action.isShareDialogDisplayed,
      };
    case InterfaceActionType.SetPrimaryWallet:
      return {
        ...state,
        primaryWallet: action.primaryWallet,
      };
    default:
      return state;
  }
}

export enum InterfaceActionType {
  SetShareDialog = '[Interface] Set share dialog',
  SetPrimaryWallet = '[Interface] Set primary wallet',
  RefreshPrimaryWallet = '[Interface] Refresh primary wallet',
}

export interface SetShareDialogAction extends Action {
  isShareDialogDisplayed: boolean;
}

export class SetShareDialogAction implements Action {
  readonly type = InterfaceActionType.SetShareDialog;

  constructor(public isShareDialogDisplayed: boolean) {}
}

export class SetPrimaryWalletAction implements Action {
  readonly type = InterfaceActionType.SetPrimaryWallet;

  constructor(public primaryWallet: string) {}
}

export type InterfaceAction = SetShareDialogAction & SetPrimaryWalletAction;

export const selectInterfacePreferences = createFeatureSelector<IInterfaceState>('interface');
export const selectPrimaryWallet = createSelector(selectInterfacePreferences, state => state.primaryWallet);
export const selectShareDialogState = createSelector(selectInterfacePreferences, state => state.isShareDialogDisplayed);

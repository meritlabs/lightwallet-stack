import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { DisplayWallet } from '@merit/common/models/display-wallet';

const DEFAULT_STATE = {
  isShareDialogDisplayed: false,
  primaryWallet: null,
};

export interface IInterfaceState {
  isShareDialogDisplayed: boolean;
  primaryWallet: DisplayWallet;
}

export class SetShareDialogAction implements Action {
  readonly type: InterfaceActionType = InterfaceActionType.SetShareDialog;

  constructor(public isShareDialogDisplayed: boolean) {}
}

export class SetPrimaryWalletAction implements Action {
  readonly type: InterfaceActionType = InterfaceActionType.SetPrimaryWallet;

  constructor(public primaryWallet: DisplayWallet) {}
}

export type InterfaceAction = SetShareDialogAction & SetPrimaryWalletAction;
export enum InterfaceActionType {
  SetShareDialog = '[Interface] Set share dialog',
  SetPrimaryWallet = '[Interface] Set primary wallet',
  RefreshPrimaryWallet = '[Interface] Refresh primary wallet',
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

export const selectInterfacePreferences = createFeatureSelector<IInterfaceState>('interface');
export const selectPrimaryWallet = createSelector(selectInterfacePreferences, state => state.primaryWallet);
export const selectShareDialogState = createSelector(selectInterfacePreferences, state => state.isShareDialogDisplayed);

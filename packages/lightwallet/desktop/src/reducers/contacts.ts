import { MeritContact } from '../../../lightwallet/src/models/merit-contact';
import { Action } from '@ngrx/store';

export interface ContactsState {
  contacts: MeritContact[];
}

export enum ContactsActionType {
  DELETE = 'delete',
  UPDATE = 'update'
}

export interface ContactsAction extends Action {
  type: ContactsActionType;
  contacts: MeritContact[];
}

const DEFAULT_STATE: ContactsState = {
  contacts: []
};

export function contactsReducer(state: ContactsState = DEFAULT_STATE, action: ContactsAction) {
  switch (action.type) {
    case ContactsActionType.UPDATE:
      state.contacts = action.contacts;
      break;
  }

  return state;
}

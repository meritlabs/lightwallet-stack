import { Injectable } from '@angular/core';

@Injectable()
export abstract class LoadingControllerService {
  abstract show(message?: string, hideOnPageChange?: boolean);
  abstract hide();
}

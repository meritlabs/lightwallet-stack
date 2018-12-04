import { MWCService } from '@merit/common/services/mwc.service';

export function getSendableInvites(mwcService: MWCService) {
  return mwcService.getClient().invitesBalance.availableAmount - 1;
}

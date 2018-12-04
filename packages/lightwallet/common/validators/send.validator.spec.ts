import { DisplayWallet } from '@merit/common/models/display-wallet';
import { SendValidator } from '@merit/common/validators/send.validator';

const mockObj: any = {};

describe('Validators.Send', () => {
  describe('validateWallet', () => {
    it('should detect a valid wallet', () => {
      const result = SendValidator.validateWallet(<any>{
        value: new DisplayWallet(
          {
            getRootAddress: () => 0,
          } as any,
          mockObj,
          mockObj,
        ),
      });

      expect(result).toBe(null);
    });

    it('should detect an invalid wallet', () => {
      const result = SendValidator.validateWallet(<any>{
        value: {},
      });

      expect(result.InvalidWallet).toBeTruthy();
    });
  });
});

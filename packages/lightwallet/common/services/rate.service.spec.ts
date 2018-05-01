import { RateService } from './rate.service';

describe('RateService', () => {
  let rateService: RateService;

  beforeAll(() => {
    rateService = new RateService();
  });

  it('should get rates', async () => {
    const rates = await rateService.loadRates();
    expect(rates).toBeDefined();
    expect(rates.length).toBeGreaterThan(0);
    expect(rates[0]).toHaveProperty('name');
    expect(rates[0]).toHaveProperty('code');
    expect(rates[0]).toHaveProperty('rate');
  });

  it('should return back rate for USD', async () => {
    const rate = await rateService.getRate('USD');
    expect(typeof rate).toBe('number');
    expect(rate).toBe(1);
  });

  it('should convert micros to fiat', async () => {
    expect(await rateService.microsToFiat(1e8, 'USD')).toBe(1);
  });

  it('should convert fiat to micros', async () => {
    expect(await rateService.fiatToMicros(1, 'USD')).toBe(1e8);
  });
});

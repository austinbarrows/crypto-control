import { TemperaturePipe } from './temperature.pipe';

describe('TemperaturePipe', () => {
  it('create an instance', () => {
    const pipe = new TemperaturePipePipe();
    expect(pipe).toBeTruthy();
  });
});

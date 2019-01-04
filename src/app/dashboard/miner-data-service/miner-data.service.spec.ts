import { TestBed } from '@angular/core/testing';

import { MinerDataService } from './miner-data.service';

describe('MinerDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MinerDataService = TestBed.get(MinerDataService);
    expect(service).toBeTruthy();
  });
});

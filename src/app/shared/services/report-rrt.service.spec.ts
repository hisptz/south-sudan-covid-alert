import { TestBed } from '@angular/core/testing';

import { ReportRrtService } from './report-rrt.service';

describe('ReportRrtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportRrtService = TestBed.get(ReportRrtService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { MedicalPersonnelService } from './medical-personnel.service';

describe('MedicalPersonnelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MedicalPersonnelService = TestBed.get(MedicalPersonnelService);
    expect(service).toBeTruthy();
  });
});

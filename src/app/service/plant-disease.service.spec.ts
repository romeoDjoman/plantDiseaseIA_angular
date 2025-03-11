import { TestBed } from '@angular/core/testing';

import { PlantDiseaseService } from './plant-disease.service';

describe('PlantDiseaseService', () => {
  let service: PlantDiseaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantDiseaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

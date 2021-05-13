import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { PageStateEffects } from './page-state.effects';

describe('PageStateEffects', () => {
  let actions$: Observable<any>;
  let effects: PageStateEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PageStateEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<PageStateEffects>(PageStateEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});

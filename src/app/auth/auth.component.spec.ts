import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from '../app.module';
import { MockBuilder } from 'ng-mocks';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  beforeEach(() => {
    return MockBuilder(AuthComponent, AppModule)
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should call get Hi from test()', () => {
  //   component.ngOnInit()
  //   expect(component.test()).toBe('Hi')
  // });

  // it('should call test()', () => {
  //   const testSpy = jest.spyOn(component, 'test')
  //   component.ngOnInit()
  //   expect(testSpy).toHaveBeenCalled()
  // });
});

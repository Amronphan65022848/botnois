import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MockBuilder } from 'ng-mocks';
import { AppModule } from './app.module';
import { ImageService } from './shared/services/image.service';
import { ScreenSizeService } from './shared/services/screen-size.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let imgServiceMock: Partial<ImageService>;
  let screenServiceMock: Partial<ScreenSizeService>;

  const stateSelectors = [
    ['true', true],
    ['false', false],
    [undefined, false] // Default case when hide_warning is not present
  ]
  beforeEach(() => {
    imgServiceMock = {
      generateSVG: jest.fn(),
    };

    screenServiceMock = {
      getScreenSize: jest.fn()
    }


    return MockBuilder(AppComponent, AppModule)
      .keep(RouterTestingModule, { export: true })
      .mock(ImageService, imgServiceMock)
      .mock(ScreenSizeService, screenServiceMock)
  })

  beforeEach(() => {

    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance

  })

  afterEach(() => {
    // Clear sessionStorage after each test
    sessionStorage.clear();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });


  // For loop to testing 3 cases
  it.each(stateSelectors)('should set warning_status to %s when hide_warning is %s', (hideWarningValue: string | boolean, expectedStatus) => {
    // Only boolean string can setItem
    if (typeof hideWarningValue === 'string') {
      sessionStorage.setItem('hide_warning', hideWarningValue);
    }

    component.getWarning();
    expect(component.warning_status).toBe(expectedStatus);
  });

  it('should call generateSVG() method of _img service on initialization', () => {
    component.generateSVG();
    expect(imgServiceMock.generateSVG).toHaveBeenCalled();
  })

  it('should call getScreenSize() method when window is resized', () => {
    const getScreenSizeSpy = jest.spyOn(screenServiceMock, 'getScreenSize'); // Spy on the getScreenSize method

    // Simulate window resize event
    window.dispatchEvent(new Event('resize'));
    // component.onWindowResize()
    expect(screenServiceMock.getScreenSize).toHaveBeenCalled(); // Verify that getScreenSize method has been called
  });

});



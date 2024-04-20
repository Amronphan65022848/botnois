import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from '../app.module';
import { MockBuilder, MockInstance, MockProvider, MockRender, MockService, ngMocks } from 'ng-mocks';
import { HomeModule } from './home.module';
import { ComponentQueueService } from './services/component-queue.service';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NgxLoadingComponent } from 'ngx-loading';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let element: HTMLElement
  const componentSelectors = [
    ['app-compare-content'],
    ['app-create-sound'],
    ['app-steps'],
    ['app-features-update'],
    ['app-card-list'],
    ['app-bottom-banner'],
    ['app-review'],
    ['app-footer-v2'],
  ]

  beforeEach(() => {
    return MockBuilder(HomeComponent, HomeModule)
      .mock(ComponentQueueService, {
        $componentsLoaded: MockService(BehaviorSubject, of(null))
      })
  });

  beforeEach(() => {
    fixture = MockRender(HomeComponent)
    component = fixture.componentInstance
    element = fixture.nativeElement
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it.each(componentSelectors)('should render %s ', (appName) => {

    // Assume component finished loaded
    component.componentLoaded = 6

    fixture.detectChanges()

    const app = element.querySelector(appName)
    expect(app).not.toBeNull()
  })

  it('should render ngx-loading when isLoading is true', () => {
    // Set isLoading to true
    component.isLoading = true;

    // Trigger change detection
    fixture.detectChanges();

    // Expect ngx-loading component to be present
    const ngxLoadingElement = fixture.debugElement.query(By.directive(NgxLoadingComponent));
    expect(ngxLoadingElement).toBeTruthy();

    // Access the show property directly
    const isShow = ngxLoadingElement.componentInstance.show;

    // Expect show property to be true
    expect(isShow).toBe(true);
  });
});

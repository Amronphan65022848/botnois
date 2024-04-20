import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';
import { ConverModeComponent } from './conver-mode.component';
import { AppModule } from 'src/app/app.module';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: ConverModeComponent;
  let fixture: ComponentFixture<ConverModeComponent>;
  // let fixture: MockedComponentFixture<ConverModeComponent>;
  beforeEach(() => {
    return MockBuilder(ConverModeComponent, AppModule)
    // .keep(RouterTestingModule, { export: true })
  })

  beforeEach(() => {
    // fixture = TestBed.createComponent(ConverModeComponent)
    fixture = MockRender(ConverModeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('Shoud click on select-speaker class then run triggerSelectSpeaker()', () => {

    // fixture.detectChanges()
    // const div = fixture.debugElement.query(By.css('.select-speaker'))
    // console.log(`🚀 ~ div:`, div.nativeElement)

    // div.nativeElement.click()
    // expect(component.triggerSelectSpeaker).toHaveBeenCalled()
  })
});



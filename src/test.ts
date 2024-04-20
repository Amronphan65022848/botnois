// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(), {
  teardown: { destroyAfterEach: false }
}
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);

import { MockService, ngMocks } from 'ng-mocks'; // eslint-disable-line import/order
import { BehaviorSubject, EMPTY, Subject, of } from 'rxjs';
import { ComponentQueueService } from './app/home/services/component-queue.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from './app/auth/services/auth.service';

// auto spy
ngMocks.autoSpy('jest');

// In case, if you use @angular/router and Angular 14+.
// You might want to set a mock of DefaultTitleStrategy as TitleStrategy.
// A14 fix: making DefaultTitleStrategy to be a default mock for TitleStrategy
import { DefaultTitleStrategy, TitleStrategy } from '@angular/router'; // eslint-disable-line import/order
ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy));

// Usually, *ngIf and other declarations from CommonModule aren't expected to be mocked.
// The code below keeps them.
import { CommonModule } from '@angular/common'; // eslint-disable-line import/order
import { ApplicationModule } from '@angular/core'; // eslint-disable-line import/order
import { BrowserModule } from '@angular/platform-browser'; // eslint-disable-line import/order
ngMocks.globalKeep(ApplicationModule, true);
ngMocks.globalKeep(CommonModule, true);
ngMocks.globalKeep(BrowserModule, true);

// ngMocks.defaultMock(ComponentQueueService, () => ({
//   $componentsLoaded: MockService(BehaviorSubject, of(null)),
// }));

// ngMocks.defaultMock(BreakpointObserver, () => ({
//   observe: jasmine.createSpy().and.returnValue(EMPTY),
// }));



// auto restore for jasmine and jest <27
declare const jest: any;
import { MockInstance } from 'ng-mocks'; // eslint-disable-line import/order
jest.getEnv().addReporter({
  specDone: MockInstance.restore,
  specStarted: MockInstance.remember,
  suiteDone: MockInstance.restore,
  suiteStarted: MockInstance.remember,
});

// // If you use jest v27+, please add to its config testRunner=jest-jasmine2 for now.
// // If you don't want to rely on jasmine at all, then, please,
// // upvote the issue on github: https://github.com/facebook/jest/issues/11483.
// // Once it has been merged you can use the code below.
// // Also, please consider usage of MockInstance.scope instead.
// import { addEventHandler } from 'jest-circus';
// addEventHandler((event: { name: string }) => {
//   switch (event.name) {
//     case 'run_describe_start':
//     case 'test_start':
//       MockInstance.remember();
//       break;
//     case 'run_describe_finish':
//     case 'run_finish':
//       MockInstance.restore();
//       break;
//     default:
//   }
// });

// // in case of mocha
// mocha.setup({
//   rootHooks: {
//     afterAll: MockInstance.restore,
//     afterEach: MockInstance.restore,
//     beforeAll: MockInstance.remember,
//     beforeEach: MockInstance.remember,
//   },
// });

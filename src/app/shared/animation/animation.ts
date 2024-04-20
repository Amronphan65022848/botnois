import {
  trigger,
  state,
  style,
  animate,
  transition,
  AUTO_STYLE,
} from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  state(
    'void',
    style({
      opacity: 0,
    })
  ),
  transition('void <=> *', animate('300ms')),
]);

export const loopUpDown = trigger('move', [
  state('in', style({ transform: ' translateY(0)' })),
  state('out', style({ transform: 'translateY(10px)' })),
  transition('in => out', animate('1.5s ease-out')),
  transition('out => in', animate('1.5s ease-in')),
]);

export const collapse = trigger('collapse', [
  state('false', style({ height: AUTO_STYLE, opacity: 100 })),
  state('true', style({ height: '0', opacity: 0 })),
  transition('false => true', animate('300ms ease-in')),
  transition('true => false', animate('300ms ease-out')),
]);

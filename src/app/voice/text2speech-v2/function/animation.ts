import { trigger, style, animate, transition } from '@angular/animations';

export function FadeInOut(
  timingIn: number,
  timingOut: number,
  height: boolean = false
) {
  return trigger('fadeInOut', [
    transition(':enter', [
      style(height ? { opacity: 0, height: 0 } : { opacity: 0 }),
      animate(
        timingIn,
        style(height ? { opacity: 1, height: 'fit-content' } : { opacity: 1 })
      ),
    ]),
    transition(':leave', [animate(timingOut, style({ opacity: 0 }))]),
  ]);
}

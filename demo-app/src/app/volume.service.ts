import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscriber, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VolumeService {

  private volumeLimit$;
  private wrappedVolume$;
  private updateStream$: Observable<{ symbol: string, volume: number }>;

  constructor() {
    this.volumeLimit$ = new BehaviorSubject<number>(50_000);
    this.wrappedVolume$ = this.subscriberCount(this.volumeLimit$, 'Volume Stream');
    this.updateStream$ = this.getUpdateStream();
  }

  setLimit(number: number) {
    this.volumeLimit$.next(number);
  }

  getUpdates() {
    return this.updateStream$
  }

  getVolumeStream() {
    this.wait(500) // Demo slow subscription performance
    return this.wrappedVolume$;
  }
  wait(ms: number) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }

  subscriberCount<T>(sourceObservable: Observable<T>, description: string) {
    let counter = 0;
    return new Observable((subscriber: Subscriber<T>) => {
      const subscription = sourceObservable.subscribe(subscriber);
      counter++;
      console.count(`New subscription to ${description}`);

      return () => {
        subscription.unsubscribe();
        counter--;
        console.count(`Unsubscribe to ${description}`);
      }
    });
  }

  getUpdateStream() {
    const symbols = ['A', 'AAL', 'AAP', 'AAPL'];
    return timer(1, 1000).pipe(map(i => {
      return { symbol: symbols[i % (symbols.length - 1)], volume: (Math.random() * 100_000) }
    }));
  }
}

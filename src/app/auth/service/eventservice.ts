import { EventEmitter, Injectable } from "@angular/core";

export interface MyServiceEvent {
  message: string;
  eventId: number;
}
@Injectable({
  providedIn: 'root',
})
export class MyService {
  public onChange: EventEmitter<MyServiceEvent> = new EventEmitter<MyServiceEvent>();

  public doSomething(message: string) {
      // do something, then...
      this.onChange.emit({message: message, eventId: 42});
  }
}
import {EventEmitter, Injectable, Output} from '@angular/core'


@Injectable()
export class SharedService {
  public onChange: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  public fire(value: boolean) {
    this.onChange.emit(value);
  }
}

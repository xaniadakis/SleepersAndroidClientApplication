import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[disallowSpaces]',
})
export class DisallowSpacesDirective {

  constructor(private eleRef: ElementRef) {
    this.eleRef.nativeElement.value = this.functionCall(eleRef.nativeElement.value);
  }

  functionCall(value: string) {
    console.log("inside directive: "+value);
    if(value==undefined)
      return value;
    return value.replace(/^\s/g, '');
  }
}


import { Pipe, PipeTransform } from '@angular/core';

export type ButtonType = 'number' | 'operator' | 'function';

@Pipe({
  name: 'buttonType'
})
export class ButtonTypePipe implements PipeTransform {

	transform(value: string | number): ButtonType {
		let buttonType: ButtonType;
		if (value === 'C') {
			buttonType = 'function';
		} else if (typeof value === 'number' || value === ',') {
			buttonType = 'number';
		} else {
			buttonType = 'operator';
		}
		return buttonType;
	}

}

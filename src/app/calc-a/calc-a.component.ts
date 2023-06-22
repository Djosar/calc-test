import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-calc-a',
	templateUrl: './calc-a.component.html',
	styleUrls: ['./calc-a.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalcAComponent {
	display: string = '';
	mathString: string = '';
	evaluated: boolean = false;

	onNumberButtonClick(value: string): void {
		// If an equation has recently been evaluated reset the display upon new input.
		if (this.evaluated) {
			this.display = `${value}`;
			this.evaluated = false;
		} else {
			this.display = `${this.display}${value}`
		}
	}

	onOperatorButtonClick(value: string): void {
		const currentValue: number = parseFloat(this.display);

		// Only if the current display value is a number is it allowed to use an operator.
		if (!isNaN(currentValue)) {
			// Only add to the math string if the operator ist not '='.
			if (value !== '=') {
				this.mathString = `${this.mathString}${currentValue}${value}`;
				this.display = ''
			// '=' executes the evaluation. After that the result needs to be displayed and the math string needs to be reset.
			} else {
				this.mathString = `${this.mathString}${currentValue}`;
				try {
					const result = eval(this.mathString);
					// For beauty reasons the decimal places were limited to 4.
					this.display = result;
					this.mathString = '';
					this.evaluated = true;
				} catch(e) {
					this.display = 'ERROR: ' + e;
					this.mathString = '';
					this.evaluated = true;
				}
			}
		}
	}

	onClear(): void {
		// Reset everything
		this.display = '';
		this.mathString = '';
		this.evaluated = false;
	}

	isOperator(value: string): boolean {
		return /[\+-\/\*=]/.test(value);
	}
}

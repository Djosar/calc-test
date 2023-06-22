import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
	display: string = '';
	mathString: string = '';
	evaluated: boolean = false;

	onNumberButtonClick(value: string): void {
		if (this.evaluated) {
			this.display = `${value}`;
			this.evaluated = false;
		} else {
			this.display = `${this.display}${value}`
		}
	}

	onOperatorButtonClick(value: string): void {
		const currentValue: number = parseFloat(this.display);
		if (value !== '=') {
			this.mathString = `${this.mathString}${currentValue}${value}`;
			this.display = ''
		} else {
			this.mathString = `${this.mathString}${currentValue}`;
			const result = eval(this.mathString);
			this.display = result;
			this.mathString = '';
			this.evaluated = true;
		}
	}

	onClear(): void {
		this.display = '';
		this.mathString = '';
	}

	isOperator(value: string): boolean {
		return /[\+-\/\*=]/.test(value);
	}
}

import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
	selector: 'app-calc-b',
	templateUrl: './calc-b.component.html',
	styleUrls: ['./calc-b.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalcBComponent {
	#display$: BehaviorSubject<string> = new BehaviorSubject('');
	display$: Observable<string> = this.#display$.asObservable();
	#equation$: BehaviorSubject<string> = new BehaviorSubject('');
	equation$: Observable<string> = this.#equation$.asObservable();
	#currentOperator$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
	currentOperator$: Observable<string | null> = this.#currentOperator$.asObservable();
	#history$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
	history$: Observable<string[]> = this.#history$.asObservable();

	@HostListener('document:keyup', [ '$event.key' ])
	keyListener(key: string): void {
		if (this.isOperator(key)) {
			this.onOperatorButtonClick(key);
		} else if (key === 'Enter') {
			this.onOperatorButtonClick('=');
		} else if (this.isNumber(key) || key === ',' || key === '.') {
			this.onNumberButtonClick(key);
		}
	}

	onNumberButtonClick(value: string): void {
		let displayValue: string = '';
		if (this.isNumber(value)) {
			displayValue = !!this.#currentOperator$.value ? value : `${this.#display$.value}${value}`;
			this.#currentOperator$.next(null);
			this.#display$.next(displayValue);
		} else if ((value === '.' || value === ',') && !this.#display$.value.includes('.') && !this.#currentOperator$.value) {
			displayValue = `${this.#display$.value}.`;
			this.#display$.next(displayValue);
		}
	}

	onOperatorButtonClick(value: string): void {
		if (this.isOperator(value) && !!this.#display$.value.length) {
			this.#currentOperator$.next(value);
			let equation: string;
			if (value !== '=') {
				equation = `${this.#equation$.value}${this.#display$.value}${value}`;
				this.#equation$.next(equation);
				this.#history$.next([ ...this.#history$.value, equation ]);
			} else {
				equation = `${this.#equation$.value}${this.#display$.value}`;
				this.#history$.next([ ...this.#history$.value, equation ]);

				try {
					const result = eval(equation);
					this.#display$.next(`${result}`);
					this.#equation$.next('');
				} catch(e) {
					this.#display$.next(`ERROR: ${e}`);
					this.#equation$.next('');
				}
			}
		}
	}

	onClear(): void {
		this.#display$.next('');
		this.#equation$.next('');
	}

	isOperator(value: string): boolean {
		return /[\+\-\/\*=]/.test(value);
	}

	isNumber(value: string): boolean {
		return /[0-9]/.test(value);
	}
}

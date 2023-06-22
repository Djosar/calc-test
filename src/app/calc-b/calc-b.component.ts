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
			// If an operator was used rececntly start over with a new number.
			displayValue = !!this.#currentOperator$.value ? value : `${this.#display$.value}${value}`;
			// When starting over with a new number reset the current operator.
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
			} else {
				equation = `${this.#equation$.value}${this.#display$.value}`;
				try {
					const result = this.evaluate(equation);
					this.#history$.next([ ...this.#history$.value, equation ]);
					this.#display$.next(result);
					this.#equation$.next('');
				} catch(e) {
					this.#display$.next(`ERROR: ${e}`);
					this.#equation$.next('');
				}
			}
		}
	}

	onHistoryEntryClick(entry: string): void {
		try {
			const result = this.evaluate(entry);
			this.#history$.next([ ...this.#history$.value, entry ]);
			this.#display$.next(result);
			this.#equation$.next('');
		} catch(e) {
			this.#display$.next(`ERROR: ${e}`);
			this.#equation$.next('');
		}
	}

	onClear(): void {
		// Reset everything
		this.#display$.next('');
		this.#equation$.next('');
		this.#history$.next([]);
	}

	private isOperator(value: string): boolean {
		return /[\+\-\/\*=]/.test(value);
	}

	private isNumber(value: string): boolean {
		return /[0-9]/.test(value);
	}

	private evaluate(equation: string): string {
		let value: string;
		const prn = this.convertToPRN(equation);
		const result = this.evaluateRPN(prn);
		value = !!result || result === 0 ? `${Math.round(result * 10000) / 10000}` : 'ERROR';
		return value;
	}

	private evaluateRPN(rpn: string[]) {
		const stack: number[] = [];
		for (let i = 0; i < rpn.length; i++) {
			const token = rpn[i];
			if (this.isOperator(token)) {
				stack.push(this.evaluateOperation(token, stack));
			} else {
				stack.push(parseFloat(token));
			}
		}

		return stack.pop();
	}

	private evaluateOperation(operator: string, stack: any[]): number {
		const operandA: number = parseFloat(stack.pop());
		const operandB: number = parseFloat(stack.pop());

		switch(operator) {
			case '+':
				return operandB + operandA;
			case '-':
				return operandB - operandA;
			case '*':
				return operandB * operandA;
			case '/':
				return operandB / operandA;
			default:
				return 0;
		}
	}

	private convertToPRN(equation: string): string[] {
		const tokens = this.tokenizeEquation(equation);
		// The any types here are because of the pop call. Not the most beatifull but easier that way.
		const operatorStack: any[] = [];
		const output: any = [];

		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];

			if (!this.isOperator(token)) {
				// If the token is a number push it into the output.
				output.push(token);
			} else {
				// The token is an operator
				while(
					operatorStack.length > 0 &&
					this.isOperator(operatorStack[operatorStack.length - 1]) &&
					this.getOperatorPrecedence(operatorStack[operatorStack.length - 1]) >= this.getOperatorPrecedence(token)
				) {
					// As long as there are operators in the operator stack place them in the output.
					// The correct order is enforced by comparing the operator precedences here.
					output.push(operatorStack.pop());
				}

				// Push the current operator into the operator stack
				operatorStack.push(token);
			}
		}

		// Push the rest of the operators
		while(operatorStack.length > 0) {
			output.push(operatorStack.pop());
		}

		// Create the rpn string.
		return output;
	}

	private tokenizeEquation(equation: string): string[] {
		// match either float values with a possible decimal point or the operators +-*/
		return equation.match(/\d+(\.\d+)?|[\+\-\*\/]/g) ?? [];
	}

	// "Punkt vor Strich"
	private getOperatorPrecedence(operator: string): number {
		let precedence: number = 0;
		switch(operator) {
			case '+':
				precedence = 1;
				break;
			case '-':
				precedence = 1;
				break;
			case '*':
				precedence = 2;
				break;
			case '/':
				precedence = 2;
				break;
			default:
				precedence = 0;
				break;
		}
		return precedence;
	}
}

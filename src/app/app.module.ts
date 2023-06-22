import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ButtonTypePipe } from './button-type.pipe';
import { CalcAComponent } from './calc-a/calc-a.component';
import { RouterModule } from '@angular/router';
import { CalcBComponent } from './calc-b/calc-b.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonTypePipe,
    CalcAComponent,
    CalcBComponent
  ],
  imports: [
    BrowserModule,
	RouterModule.forRoot([
		{
			path: '',
			pathMatch: 'full',
			component: CalcAComponent
		},
		{
			path: 'calcb',
			component: CalcBComponent
		}
	])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

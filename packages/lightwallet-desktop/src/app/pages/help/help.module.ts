import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpComponent } from './help/help.component';
import { QuestionComponent } from './question/question.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HelpComponent, QuestionComponent]
})
export class HelpModule { }

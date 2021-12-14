import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel/panel.component';
import { MatCardModule } from '@angular/material';



@NgModule({
  declarations: [PanelComponent],
  imports: [
    CommonModule,
    MatCardModule
  ],
  exports:[PanelComponent]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel/panel.component';
import { MatCardModule } from '@angular/material';
import { LogoutComponent } from '../private/containers/logout/logout.component';



@NgModule({
  declarations: [PanelComponent,LogoutComponent],
  imports: [
    CommonModule,
    MatCardModule,
    
  ],
  exports:[PanelComponent,LogoutComponent]
})
export class SharedModule { }

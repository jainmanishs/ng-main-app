import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel/panel.component';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { LogoutComponent } from '../private/containers/logout/logout.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from './material.module';



@NgModule({
  declarations: [PanelComponent,LogoutComponent, HeaderComponent],
  imports: [
    CommonModule,
    MaterialModule
    
  ],
  exports:[
    PanelComponent,
    LogoutComponent,
    HeaderComponent,
    MaterialModule 
  ]
})
export class SharedModule { }

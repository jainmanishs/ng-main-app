import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel/panel.component';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { LogoutComponent } from '../private/containers/logout/logout.component';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [PanelComponent,LogoutComponent, HeaderComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatGridListModule,
    MatRadioModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatDialogModule,
    MatNativeDateModule,
    MatRippleModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule
    
  ],
  exports:[PanelComponent,LogoutComponent,HeaderComponent,  MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatGridListModule,
    MatRadioModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatDialogModule,
    MatNativeDateModule,
    MatRippleModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule]
})
export class SharedModule { }

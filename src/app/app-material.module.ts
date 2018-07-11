import { NgModule } from '@angular/core';
import { MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule,
  MatIconModule, MatMenuModule, MatDialogModule  } from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule
  ],
})
export class AppMaterialModule { }

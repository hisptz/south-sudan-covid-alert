import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { sharedComponents } from './components';
import { services } from './services';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { materialModules } from './material-modules';
import { modules } from './modules';
import { ConfirmReportToRrtDialogComponent } from './dialogs/confirm-report-to-rrt-dialog/confirm-report-to-rrt-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgxPaginationModule,
    NgPipesModule,
    ...materialModules,
    ...modules
  ],
  declarations: [
    ...sharedComponents,
    ConfirmReportToRrtDialogComponent
  ],
  exports: [...sharedComponents, ...materialModules, ConfirmReportToRrtDialogComponent, NgPipesModule, NgxPaginationModule, ...modules],
  providers: [...services]
})
export class SharedModule { }

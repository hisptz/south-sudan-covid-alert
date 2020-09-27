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
    ...sharedComponents
  ],
  exports: [...sharedComponents, ...materialModules, NgPipesModule, NgxPaginationModule, ...modules],
  providers: [...services]
})
export class SharedModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { effects } from './store/effects';
import { SharedModule } from './shared/shared.module';
import { pagesComponent } from './pages';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { RouteSerializer } from './utils';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDhis2MenuModule } from '@iapps/ngx-dhis2-menu';
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';
import { services } from './shared/services';
import { ViewEventComponent } from './pages/home/view-event/view-event.component';

@NgModule({
  declarations: [
    AppComponent,
    ...pagesComponent,
    ViewEventComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    
    SharedModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    StoreRouterConnectingModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot(effects),
    NgxDhis2HttpClientModule.forRoot({
      version: 1,
      namespace: 'covid19-alert',
      models: {
        organisationUnits: 'id,name,level',
        organisationUnitLevels: 'id,level',
        organisationUnitGroups: 'id',
      },
    }),
    NgxDhis2MenuModule,
  ],
  providers: [{ provide: RouterStateSerializer, useClass: RouteSerializer }],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from "@angular/fire";
import { AngularFireFunctionsModule } from "@angular/fire/functions";
import { AngularFireStorageModule } from '@angular/fire/storage';
import 'hammerjs';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr'; // For auth after login toast
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';

import { coreConfig } from 'app/app-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { environment } from 'environments/environment';


import { DatatablesModule } from './modules/datatables.module';
import { CurrencyPipe, NumberToWordsPipe } from './auth/helpers/currency.pipe';
import { ApartmentComponent } from './main/InventoryManagement/createapartment/apartment/apartment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './main/settings/settings.component';
import { NgSelectModule } from '@ng-select/ng-select';


const appRoutes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({
  declarations: [AppComponent,ApartmentComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
 
    Ng2FlatpickrModule,
    AngularFireModule.initializeApp(environment.firebase),
  
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy'
    }),
    TranslateModule.forRoot(),

    //NgBootstrap
    NgbModule,
    ToastrModule.forRoot(),

    SweetAlert2Module.forRoot(),    // Core modules
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,
    FormsModule,
    ReactiveFormsModule,
    // App modules
    LayoutModule,
    SampleModule,
    DatatablesModule,

  ],
  providers: [
    
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'PKR'
    }    
   ],
  bootstrap: [AppComponent]
})
export class AppModule {}

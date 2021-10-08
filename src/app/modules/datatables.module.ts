import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { InventoryManagementComponent } from '../main/InventoryManagement/InventoryManagement.component';
import { DatatablesService } from './datatables.service';
import { CurrencyPipe } from '../auth/helpers/currency.pipe';
import { StatusPipe } from '../auth/helpers/status.pipe';
import { SettingsComponent } from '../main/settings/settings.component';
import { PlanGeneratorComponent } from '../main/InventoryManagement/plan-generator/plan-generator.component';
import { ViewPlanComponent } from '../main/InventoryManagement/view-plan/view-plan.component';
import { NgSelectModule } from '@ng-select/ng-select';


const routes: Routes = [
  {
    path: 'inventory',
    component: InventoryManagementComponent,
    
    data: { animation: 'datatables' }
  },
  {
    path: 'settings',
    component: SettingsComponent,
    
    data: { animation: 'datatables' }
  },
  {
    path: ':id/plan',
    component: PlanGeneratorComponent,
    
    data: { animation: 'datatables' }
  },
  {
    path: 'generateplan',
    component: PlanGeneratorComponent,
    
    data: { animation: 'datatables' }
  },
  {
    path: 'plan',
    component: ViewPlanComponent,
    
    data: { animation: 'datatables' }
  }

];

@NgModule({
  declarations: [PlanGeneratorComponent, ViewPlanComponent, InventoryManagementComponent,SettingsComponent, CurrencyPipe,StatusPipe],
  imports: [
    RouterModule.forChild(routes),
    NgbModule,
    TranslateModule,
    CoreCommonModule,
    ContentHeaderModule,
    CardSnippetModule,
    NgxDatatableModule,
    CsvModule,
    NgSelectModule
  ],
  providers: [DatatablesService]
})
export class DatatablesModule {}

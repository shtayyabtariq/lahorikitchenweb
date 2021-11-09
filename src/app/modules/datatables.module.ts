import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CsvModule } from "@ctrl/ngx-csv";
import { TranslateModule } from "@ngx-translate/core";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FormsModule } from '@angular/forms';
import { CoreCommonModule } from "@core/common.module";
import { CardSnippetModule } from "@core/components/card-snippet/card-snippet.module";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";
import { InventoryManagementComponent } from "../main/InventoryManagement/InventoryManagement.component";
import { DatatablesService } from "./datatables.service";
import { CurrencyPipe, NumberToWordsPipe } from "../auth/helpers/currency.pipe";
import { StatusPipe } from "../auth/helpers/status.pipe";
import { SettingsComponent } from "../main/settings/settings.component";
import { PlanGeneratorComponent } from "../main/InventoryManagement/plan-generator/plan-generator.component";
import { ViewPlanComponent } from "../main/InventoryManagement/view-plan/view-plan.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { SalesplanComponent } from "../main/InventoryManagement/salesplan/salesplan.component";
import { Ng2FlatpickrModule } from "ng2-flatpickr";
import { ViewsalesComponent } from "../main/InventoryManagement/viewsales/viewsales.component";
import { SaledetailComponent } from "app/main/InventoryManagement/saledetail/saledetail.component";
import { CorePipesModule } from "../../@core/pipes/pipes.module";
import { CoreSidebarModule } from "@core/components";
import { InvoicedetailComponent } from '../main/InventoryManagement/invoicedetail/invoicedetail.component';
import { TransactiongeneratorComponent } from "../main/InventoryManagement/transactiongenerator/transactiongenerator.component";
import { SendInvoiceSidebarComponent } from "app/main/InventoryManagement/invoicedetail/send-invoice-sidebar/send-invoice-sidebar.component";
import { InvoicepreviewComponent } from '../main/InventoryManagement/invoicedetail/invoicepreview/invoicepreview.component';
import { ViewtransactionsComponent } from '../main/InventoryManagement/viewtransactions/viewtransactions.component';
import { CreditadjustmentsComponent } from '../main/InventoryManagement/creditadjustments/creditadjustments.component';

const routes: Routes = [
  {
    path: "inventory",
    component: InventoryManagementComponent,

    data: { animation: "datatables" },
  },
  {
    path: "settings",
    component: SettingsComponent,

    data: { animation: "datatables" },
  },
  {
    path: ":id/plan",
    component: PlanGeneratorComponent,

    data: { animation: "datatables" },
  },
  {
    path: "generateplan",
    component: PlanGeneratorComponent,

    data: { animation: "datatables" },
  },
  {
    path: "plan",
    component: ViewPlanComponent,

    data: { animation: "datatables" },
  },
  {
    path: "sale/:id",
    component: SalesplanComponent,

    data: { animation: "datatables" },
  },
  {
    path: "sales",
    component: ViewsalesComponent,

    data: { animation: "datatables" },
  },
  {
    path: "sales/:id",
    component: SaledetailComponent,

    data: { animation: "datatables" },
  },
  {
    path: "sales/:id/invoice/:invoiceid",
    component: InvoicepreviewComponent,

    data: { animation: "datatables" },
  },
  {
    path: "sales/:id/invoicepreview/:invoiceid",
    component: InvoicedetailComponent,

    data: { animation: "datatables" },
  },
  {
    path: "transactions",
    component: ViewtransactionsComponent,

    data: { animation: "datatables" },
  },
  {
    path: "credits",
    component: CreditadjustmentsComponent,

    data: { animation: "datatables" },
  },
];

@NgModule({
  declarations: [
    SendInvoiceSidebarComponent,
    InvoicepreviewComponent,
    CreditadjustmentsComponent,
    InvoicedetailComponent,
    TransactiongeneratorComponent,
    ViewsalesComponent,
    SaledetailComponent,
    ViewtransactionsComponent,
    SalesplanComponent,
    PlanGeneratorComponent,
    ViewPlanComponent,
    InventoryManagementComponent,
    SettingsComponent,
    CurrencyPipe,
    StatusPipe,
    NumberToWordsPipe
  ],
  imports: [
    RouterModule.forChild(routes),
    NgbModule,
    TranslateModule,
    CoreCommonModule,
    ContentHeaderModule,
    CardSnippetModule,
    NgxDatatableModule,
    CsvModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    CorePipesModule,
    CoreSidebarModule,
    FormsModule
  ],
  providers: [DatatablesService],
})
export class DatatablesModule {}

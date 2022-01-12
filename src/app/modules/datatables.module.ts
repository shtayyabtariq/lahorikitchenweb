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
import { InvoicereportComponent } from '../main/reports/invoicereport/invoicereport.component';
import { BankbalancereportComponent } from '../main/reports/bankbalancereport/bankbalancereport.component';
import { FilteroptionselectComponent } from '../main/filteroptionselect/filteroptionselect.component';
import { ViewinventorymodalComponent } from '../main/InventoryManagement/viewinventorymodal/viewinventorymodal.component';
import { ChoosereportsComponent } from '../main/reports/choosereports/choosereports.component';
import { CustomersComponent } from '../main/customers/customers.component';
import { CustomerreportsComponent } from "app/main/reports/customerreports/customerreports.component";
import { InventoryreportComponent } from '../main/reports/inventoryreport/inventoryreport.component';
import { TrialbalancereportComponent } from '../main/reports/trialbalancereport/trialbalancereport.component';
import { ViewusersComponent } from '../main/usermanagement/viewusers/viewusers.component';
import { CreateuserComponent } from '../main/usermanagement/createuser/createuser.component';
import { ManagerEmployeeRouteAuthGuard } from "app/auth/roleguards/manageremployeeguard";
import { ManagerRouteAuthGuard } from '../auth/roleguards/managerguard';
import { AdminRouteAuthGuard } from '../auth/roleguards/adminguard';
import FileSaver from "file-saver";
import { AdvanceInventorySearch } from '../auth/models/apartmentdto';
import { AdvanceinventorysearchComponent } from '../main/InventoryManagement/advanceinventorysearch/advanceinventorysearch.component';
import { ChangepasswordComponent } from '../main/usermanagement/changepassword/changepassword.component';
import { AuthGuard } from '../auth/helpers/auth.guards';
import { ViewInvoicesComponent } from '../main/InventoryManagement/ViewInvoices/ViewInvoices.component';
import { EmployeeRouteAuthGuard } from '../auth/roleguards/employeeguard';
import { HomeComponent } from "app/main/sample/home.component";
import { HomeRouteAuthGuard } from "app/auth/helpers/homerouteguard";

const routes: Routes = [
  {
    path: "inventory",
    component: InventoryManagementComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
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
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "generateplan",
    component: PlanGeneratorComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "plan",
    component: ViewPlanComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "sale/:id",
    component: SalesplanComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "sales",
    component: ViewsalesComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "sales/:id",
    component: SaledetailComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "sales/:id/invoice/:invoiceid",
    component: InvoicepreviewComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "sales/:id/invoicepreview/:invoiceid",
    component: InvoicedetailComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "transactions",
    component: ViewtransactionsComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "credits",
    component: CreditadjustmentsComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "reports/invoices",
    component: InvoicereportComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "reports/trialbalance",
    component: TrialbalancereportComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "reports/balance/:iban",
    component: BankbalancereportComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "reports",
    component: ChoosereportsComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "reports/customers",
    component: CustomerreportsComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "reports/inventory",
    component: InventoryreportComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "customers",
    component: CustomersComponent,
    canActivate:[ManagerEmployeeRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "users",
    component: ViewusersComponent,
    canActivate:[AdminRouteAuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "changepassword",
    component: ChangepasswordComponent,
    canActivate:[AuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: "invoices",
    component: ViewInvoicesComponent,
    canActivate:[AuthGuard],
    data: { animation: "datatables" },
  },
  {
    path: '',
    component:HomeComponent,
    pathMatch: 'full',
    canActivate:[AuthGuard,HomeRouteAuthGuard]
    
    
  },
  {
    path: 'home',
    canActivate:[AuthGuard,HomeRouteAuthGuard],
    component: HomeComponent,
  
    data: { animation: 'home' }
  },
  
];

@NgModule({
  declarations: [
    
    ViewInvoicesComponent,
    ChangepasswordComponent,
    AdvanceinventorysearchComponent,
    CreateuserComponent,
    ViewusersComponent,
    TrialbalancereportComponent,
    InventoryreportComponent,
    ChoosereportsComponent,
    ViewinventorymodalComponent,
    InvoicereportComponent,
    FilteroptionselectComponent,
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
    NumberToWordsPipe,
    InvoicereportComponent,
    BankbalancereportComponent,
    CustomersComponent,
    CustomerreportsComponent,
    HomeComponent
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
    FormsModule,
   
  ],
  providers: [DatatablesService],
})
export class DatatablesModule {}

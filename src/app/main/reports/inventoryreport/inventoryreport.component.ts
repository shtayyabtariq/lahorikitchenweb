import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApputilsService } from 'app/auth/helpers/apputils.service';
import { Apartmentdto, groupApartments } from 'app/auth/models/apartmentdto';
import { daterangepickerdto } from 'app/auth/models/daterangepickerdto';
import { Transaction, PlanScheduleDto } from 'app/auth/models/plandto';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { FilteroptionselectComponent } from 'app/main/filteroptionselect/filteroptionselect.component';
import { ViewinventorymodalComponent } from 'app/main/InventoryManagement/viewinventorymodal/viewinventorymodal.component';
import { InvoicereportComponent } from '../invoicereport/invoicereport.component';

@Component({
  selector: 'app-inventoryreport',
  templateUrl: './inventoryreport.component.html',
  styleUrls: ['./inventoryreport.component.scss']
})
export class InventoryreportComponent implements OnInit {

  totaldueinvoices:number = 0;
  totalupcominginvoices:number = 0;
  totalsoldapartments:number = 0;
  totalavailableapartments:number = 0;
  totalownerapartments:number=0;
  apartments:Apartmentdto[] =[];
  soldapartments:Apartmentdto[]=[];
  ownerapartments:Apartmentdto[]=[];
  unsoldapartments:Apartmentdto[]=[];
  transactions:Transaction[]=[];
  dueinvoices:PlanScheduleDto[]=[];
  upcominginvoices:PlanScheduleDto[]=[];
  totalAmountReceived=0;
  drp:daterangepickerdto;
  
  floorwiseapartments:groupApartments[]=[];
  typewiseapartments:groupApartments[]=[];
  apartmenttypes:groupApartments[]=[];

  constructor(    public modalservice: NgbModal,public fs:firebaseStoreService,public appUtil:ApputilsService) {}

  public contentHeader: object

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  async ngOnInit() {
    this.totalAmountReceived = 0;
    this.contentHeader = {
      headerTitle: 'Home',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Sample',
            isLink: false
          }
        ]
      }
    }

    this.drp = this.appUtil.getMonthRange();
    this.fs.getapartments(false).valueChanges().subscribe(e=>{
      this.apartments = e as Apartmentdto[];
      this.totalavailableapartments = this.apartments.filter(e=>e.status==this.appUtil.OpenStatus).length;
      this.unsoldapartments = this.apartments.filter(e=>e.status==this.appUtil.OpenStatus);
      this.soldapartments = this.apartments.filter(e=>e.status == this.appUtil.HoldStatus)
      this.generateApartmentDistributions(this.apartments);
    });
    this.fs.getapartments(true).valueChanges().subscribe(e=>{
      this.totalownerapartments = e.length;
      this.ownerapartments = e as Apartmentdto[];
    });
    this.generatestats(this.drp);
    
  }

  async generateApartmentDistributions(ap:Apartmentdto[])
  {
    debugger;
    this.floorwiseapartments = [];
    var result = this.appUtil.groupBy(ap, (Apartmentdto)=>Apartmentdto.floorno);
    console.log(result);
    result.forEach(e=>{
      var soldapartments = e.filter(e=>e.status==this.appUtil.BookedStatus);
      var openapartments = e.filter(e=>e.status == this.appUtil.OpenStatus);
      let flw:groupApartments={
        type: e[0].floorno,
        availablecount: openapartments.length,
        soldcount:soldapartments.length,
        soldaparments:soldapartments,
        availableapartments:openapartments
      };
      this.floorwiseapartments.push(flw)
    });


    this.apartmenttypes = [];


    result = this.appUtil.groupBy(ap, (Apartmentdto)=>Apartmentdto.type);
    console.log(result);
    result.forEach(e=>{
      var soldapartments = e.filter(e=>e.status==this.appUtil.BookedStatus);
      var openapartments = e.filter(e=>e.status == this.appUtil.OpenStatus);
      let flw:groupApartments={
        type: e[0].type,
        availablecount: openapartments.length,
        soldcount:soldapartments.length,
        soldaparments:soldapartments,
        availableapartments:openapartments
      };
      this.apartmenttypes.push(flw)
    });
    this.apartmenttypes.sort((a,b)=> Number.parseInt(a.type) > Number.parseInt(b.type) ? 1:-1)
 
    this.typewiseapartments = [];

    result = this.appUtil.groupBy(ap, (Apartmentdto)=>Apartmentdto.apartmenttype);
    console.log(result);
    result.forEach(e=>{
      var soldapartments = e.filter(e=>e.status==this.appUtil.BookedStatus);
      var openapartments = e.filter(e=>e.status == this.appUtil.OpenStatus);
      let flw:groupApartments={
        type: e[0].apartmenttype,
        availablecount: openapartments.length,
        soldcount:soldapartments.length,
        soldaparments:soldapartments,
        availableapartments:openapartments
      };
      this.typewiseapartments.push(flw)
    });
    
  }
  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}
async generatestats(drp:daterangepickerdto)
{
  
   var resp = await this.fs.GetUpComingInvoices(new Date(),drp.enddate);
   console.log(resp); 
   this.upcominginvoices = resp;
   this.totalupcominginvoices = resp.length;


   var dueinvoices = await this.fs.GetDueInvoices(new Date());
   this.dueinvoices = dueinvoices;
   this.totaldueinvoices = dueinvoices.length;
   console.log(dueinvoices);
  //  var customerinvoice = await this.fs.GetCustomerUpComingInvoices("fqHbVfHDgvQz0GmNfJGD",new Date(),newdate);
  //  console.log(customerinvoice);

 
  (await this.fs.getTotalAmountReceivedThisMonth(drp.startdate,drp.enddate)).valueChanges().subscribe(e=>{
    this.transactions = e;
    this.generateStatsByTransactions();
  });
  //  this.totalsoldapartments = await this.fs.getTotalSoldApartment(); 
  this.totalsoldapartments = 10;

}
  generateStatsByTransactions()
  {
    this.totalAmountReceived =0;
    this.transactions.forEach(e=>{
      this.totalAmountReceived += e.amount;
    });
  }

  viewinvoicedetail(id:number)
  {
    if(id == 0)
    {
      var modal = this.modalservice.open(InvoicereportComponent,{
        centered: true,
        size: 'xl',
        backdrop:false
      });
      modal.componentInstance.invoices = this.upcominginvoices;
    }
    else{
      var modal = this.modalservice.open(InvoicereportComponent,{
        centered: true,
        size: 'xl',
        backdrop:false
      });
      modal.componentInstance.invoices = this.dueinvoices;
    }
    
  }
  filter()
  {
    
    this.modalservice.open(FilteroptionselectComponent).closed.subscribe(e=>{
      var drp = e as daterangepickerdto;
      console.log(drp);
      this.drp = drp;
      this.generatestats(this.drp);
    });
  }
  viewapartment(apt:Apartmentdto[])
  {
    var modal =  this.modalservice.open(ViewinventorymodalComponent,{
      centered: true,
        size: 'xl',
        backdrop:false,
        
    });
    modal.componentInstance.ap = apt;
  }

}

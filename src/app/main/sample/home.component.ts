import { Component, OnInit } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firebaseStoreService } from 'app/auth/service/firebasestoreservice';
import { ApputilsService } from '../../auth/helpers/apputils.service';
import { Transaction, PlanScheduleDto } from '../../auth/models/plandto';
import { FilteroptionselectComponent } from '../filteroptionselect/filteroptionselect.component';
import { daterangepickerdto } from '../../auth/models/daterangepickerdto';
import { InvoicereportComponent } from '../reports/invoicereport/invoicereport.component';
import { Apartmentdto, groupApartments } from '../../auth/models/apartmentdto';
import { ViewinventorymodalComponent } from '../InventoryManagement/viewinventorymodal/viewinventorymodal.component';
import { apartmenttypes } from '../../auth/models/apartmenttypesdto';
import { abort } from 'process';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { firefunctionsservice } from '../../auth/service/firefunctionsservice';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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

  constructor(public afs:firefunctionsservice,    public modalservice: NgbModal,public fs:firebaseStoreService,public appUtil:ApputilsService) {
    debugger;
    
  }

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
      this.soldapartments = this.apartments.filter(e=>e.status == this.appUtil.BookedStatus);
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
  debugger;



   var dueinvoices = await this.fs.GetDueInvoices(new Date());
   this.dueinvoices = dueinvoices;
   this.totaldueinvoices = dueinvoices.length;
   console.log(dueinvoices);
   if(drp.option != "All")
   {
    var resp = await this.fs.GetUpComingInvoices(new Date(),drp.enddate);
    console.log(resp); 
    this.upcominginvoices = resp;
    this.totalupcominginvoices = resp.length;

     this.dueinvoices = this.dueinvoices.filter(e=> new Date(e.invoicedueon.seconds * 1000) >= drp.startdate);
     this.totaldueinvoices = this.dueinvoices.length;
     
    (await this.fs.getTotalAmountReceivedThisMonth(drp.startdate,drp.enddate)).valueChanges().subscribe(e=>{
      this.transactions = e;
      this.generateStatsByTransactions();
    });
   }
   else{
    var resp = await this.fs.GetAllUpComingInvoices(new Date());
    console.log(resp); 
    this.upcominginvoices = resp;
    this.totalupcominginvoices = resp.length;

    (await this.fs.getAllTotalAmountReceivedThisMonth()).valueChanges().subscribe(e=>{
     debugger;
      this.transactions = e;
      this.generateStatsByTransactions();
    });
   }
  //  var customerinvoice = await this.fs.GetCustomerUpComingInvoices("fqHbVfHDgvQz0GmNfJGD",new Date(),newdate);
  //  console.log(customerinvoice);

 
 
  
   this.totalsoldapartments = this.soldapartments.length;
  

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

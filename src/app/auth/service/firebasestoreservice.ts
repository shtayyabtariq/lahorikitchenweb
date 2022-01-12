import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentSnapshot,
} from "@angular/fire/firestore";
import { arch } from "os";

import { Apartmentdto, Invoicedto } from '../models/apartmentdto';
import { apartmenttypes } from "../models/apartmenttypesdto";
import {
  PlanDto,
  PlanScheduleDto,
  SalesDto,
  Transaction,
} from "../models/plandto";
import { ApputilsService } from "../helpers/apputils.service";
import { CustomerDto, creditamounts } from '../models/customerinfo';
import { query } from "@angular/animations";
import { metadata } from "../models/metadata";
import { User } from "../models";



@Injectable({
  providedIn: "root",
})
export class firebaseStoreService {
  getransactionbytransactionid(val: string) {
    return this.fs.collection(this.transactionsCollection,res=>res.where("transactionid","==",val));
  }
  updateSaleStatus(id:string, Completed: string) {
    return this.fs.collection(this.salesCollection).doc(id).update({"status":Completed});
  }
  changeApartmentStatus(apartmentid: string, HoldStatus: string) {
    return this.fs
      .collection(this.apartments)
      .doc(apartmentid)
      .update({ status: HoldStatus });
  }
  constructor(public fs: AngularFirestore, public appUtils: ApputilsService) {}
  apartments = "apartments";
  apartmenttypesCollection = "apartmenttypes";
  planCollection = "plans";
  salesCollection = "sales";
  customersCollection = "customers";
  planinvoicesCollection = "planinvoices";
  metadataCollection = "metadata";
  transactionsCollection = "transactions";
  creditCollection = "credits";
  usersCollection="users";

  async addCustomer(customer: CustomerDto) {
    var doc = this.fs.collection(this.customersCollection).doc();
    customer.id = doc.ref.id;
    await doc.set(customer).then();
    return customer.id;
  }

  getUserById(id:string)
  {
    return this.fs.collection<User>(this.usersCollection).doc(id);
  }
  getusers()
  {
    return this.fs.collection<User>(this.usersCollection);
  }
  updateuser(usr:User)
  {
    return this.fs.collection<User>(this.usersCollection).doc(usr.uid).update(usr);
  }

  async getTotalAmountReceivedThisMonth(startdate:any,enddate:any)
  {
    return this.fs.collection<Transaction>(this.transactionsCollection,(res)=>res.where("transactiondate",">=",startdate).where("transactiondate","<=",enddate).where("status","==","Successfull"));
  }
  async getAllTotalAmountReceivedThisMonth()
  {
    return this.fs.collection<Transaction>(this.transactionsCollection,(res)=>res.where("status","==","Successfull"));
  }
  // async getTotalSoldApartment()
  // {
  //   return  (await this.fs.collection<SalesDto>(this).get().toPromise()).docs.length;
  // }
  async GetUpComingInvoices(currentdate: Date, lastdate: Date) {
    debugger;
    var invoices = await this.fs
      .collection<PlanScheduleDto>(this.planinvoicesCollection, (res) =>
        res
          .where("invoicepaid", "==", false)
          .where("invoicedueon", ">=", currentdate)
          .where("invoicedueon", "<=", lastdate)
      )
      .get()
      .toPromise();
    let invoicelist: PlanScheduleDto[] = [];
    invoices.forEach((e) => {
      invoicelist.push(e.data());
    });
    return invoicelist;
  }
  async GetAllUpComingInvoices(currentdate: Date, ) {
    debugger;
    var invoices = await this.fs
      .collection<PlanScheduleDto>(this.planinvoicesCollection, (res) =>
        res
          .where("invoicepaid", "==", false)
          .where("invoicedueon", ">=", currentdate)
         
      )
      .get()
      .toPromise();
    let invoicelist: PlanScheduleDto[] = [];
    invoices.forEach((e) => {
      invoicelist.push(e.data());
    });
    return invoicelist;
  }
  async gettransactionsbybank(bank:string)
  {
   return this.fs.collection<Transaction>(this.transactionsCollection,res=>res.where("iban","==",bank).orderBy("transactiondate")).get().toPromise();
  }
  getallinvoices()
  {
    return this.fs.collection<PlanScheduleDto>(this.planinvoicesCollection);
  }
  async gettrialbalance()
  {
    this.fs.collectionGroup<creditamounts>("credits").get().forEach(e=>{

      e.forEach(d=>{
        console.log(d.data());
      })
    });
   return  await this.fs.collection<Transaction>(this.transactionsCollection,res=>res.where("status","==",this.appUtils.TransactionSuccessfull).orderBy("transactiondate")).get().toPromise();
  }
  async GetCustomerUpComingInvoices(
    id: string,
    currentdate: Date,
    lastdate: Date
  ) {
    var invoices = await this.GetUpComingInvoices(currentdate, lastdate);
    var customerplans = await this.getCustomerSales(id).get().toPromise();
    invoices = invoices.filter(
      (i) =>
        customerplans.docs.filter((e) => e.data().id == i.planid).length > 0
    );
    return invoices;
  }
  async GetDueInvoices(currentdate: Date) {
    let due: PlanScheduleDto[] = [];
    var dueinvoices = await this.fs
      .collection<PlanScheduleDto>(this.planinvoicesCollection, (res) =>
        res
          .where("invoicepaid", "==", false)
          .where("invoicedueon", "<=", currentdate)
      )
      .get()
      .toPromise();
    dueinvoices.docs.forEach((e) => {
      due.push(e.data());
    });
    return due;
  }
  async GetPaidInvoice() {
    this.fs.collection(this.planinvoicesCollection, (res) =>
      res.where("invoicepaid", "==", true)
    );
  }

  getinvoicebyid(id: string) {
    return this.fs
      .collection<PlanScheduleDto>(this.planinvoicesCollection)
      .doc(id);
  }
  getmetadata() {
    return this.fs.collection<metadata>(this.metadataCollection).doc("values");
  }
  getCustomer() {
    return this.fs.collection<CustomerDto>(this.customersCollection);
  }
  getCustomerCredits(id: string, tid: string) {
    return this.fs
      .collection(this.customersCollection)
      .doc(id)
      .collection<creditamounts>(this.creditCollection)
      .doc(tid);
  }
  deleteCustomerCredit(id: string, tid: string) {
    return this.fs
      .collection(this.customersCollection)
      .doc(id)
      .collection<creditamounts>(this.creditCollection)
      .doc(tid)
      .delete();
  }
  async addSales(sale: SalesDto) {
    var doc = this.fs.collection(this.salesCollection).doc();
    sale.id = doc.ref.id;

    debugger;
    var batch = this.fs.firestore.batch();
    sale.planscehdule.forEach((pl) => {
      var doc = this.fs.collection("planinvoices").doc();
      pl.id = doc.ref.id;
      pl.planid = sale.id;
      batch.set(doc.ref, pl);
    });

    await batch.commit();
    sale.planscehdule = null;

    return doc.set(sale);
  }
  getSales() {
    return this.fs.collection<SalesDto>(this.salesCollection);
  }
  async addtransaction(tr: Transaction, invoiceid: string) {
    var doc = this.fs.collection(this.transactionsCollection).doc();
    tr.id = doc.ref.id;
    var invoice = (
      await this.getinvoicebyid(invoiceid).get().toPromise()
    ).data();
    await doc.set(tr).then();

    await this.runTransaction(tr);
  }
  async toggletransactionupdate(tid: string, status: boolean) {
    return this.fs
      .collection(this.transactionsCollection)
      .doc(tid)
      .update({ editable: status });
  }
  gettransactionbyid(id: string) {
    return this.fs.collection<Transaction>(this.transactionsCollection).doc(id);
  }
  async updatetransaction(tr: Transaction) {
    var updateTr = await this.fs
      .collection(this.transactionsCollection)
      .doc(tr.id)
      .update(tr);
    await this.runTransaction(tr);
  }
  async creditAmountToCustomer(id: string, creditamounts: creditamounts) {
    return this.fs
      .collection(this.customersCollection)
      .doc(id)
      .collection(this.creditCollection)
      .doc(creditamounts.id)
      .set(creditamounts);
  }
  async runTransaction(tr: Transaction) {
    await this.fs.firestore
      .runTransaction(async (t) => {
        var transc = await this.getvalidtransactions(tr.invoiceid)
          .get()
          .toPromise();
        var totalSum = 0;
        transc.docs.forEach((e) => {
          totalSum += e.data().amount;
        });
        var invoice = (
          await this.getinvoicebyid(tr.invoiceid).get().toPromise()
        ).data();
        await this.updateInvoiceTransaction(totalSum, invoice);
      })
      .then();
  }
  async updateInvoiceTransaction(
    amount: number,
    invoicedetail: PlanScheduleDto
  ) {
    var amountLeft = invoicedetail.amount - amount;
    invoicedetail.amountpaid = amount;
    invoicedetail.amountleft = amountLeft;

    invoicedetail.invoicepaid =
      invoicedetail.amount == invoicedetail.amountpaid;
    invoicedetail.invoicepaidon = null;

    if (invoicedetail.invoicepaid) {
      invoicedetail.invoicepaidon = this.appUtils.getServerTimestamp();
    }

    await this.updateinvoice(invoicedetail).then();
  }

  getalltransactions() {
    return this.fs.collection<Transaction>(this.transactionsCollection, (res) =>
      res.orderBy("transactiondate", "desc")
    );
  }

  gettransactions(invoiceid: string) {
    return this.fs.collection<Transaction>(this.transactionsCollection, (res) =>
      res.where("invoiceid", "==", invoiceid).orderBy("transactiondate", "desc")
    );
  }

  getvalidtransactions(invoiceid: string) {
    return this.fs.collection<Transaction>(this.transactionsCollection, (res) =>
      res
        .where("invoiceid", "==", invoiceid)
        .where("status", "==", this.appUtils.TransactionSuccessfull)
        .orderBy("transactiondate", "desc")
    );
  }
  async toggletransaction(invoiceid: string, tid: string, status: string) {
    await this.fs
      .collection(this.transactionsCollection)
      .doc(tid)

      .update({
        status: status,
      })
      .then();
    var tr = (
      await this.fs
        .collection<Transaction>(this.transactionsCollection)
        .doc(tid)
        .get()
        .toPromise()
    ).data();
    return this.runTransaction(tr);
  }
  updateinvoice(invoice: PlanScheduleDto) {
    return this.fs
      .collection(this.planinvoicesCollection)
      .doc(invoice.id)
      .update(invoice);
  }
  getSalebyId(id: string) {
    console.log(id);
    return this.fs.collection<SalesDto>(this.salesCollection).doc(id);
  }
  getCustomerbyId(id: string) {
    return this.fs.collection<CustomerDto>(this.customersCollection).doc(id);
  }
  getSaleInvoices(id: string, fetchtype: number = 0) {
    if (fetchtype == 0) {
      return this.fs.collection<PlanScheduleDto>(
        this.planinvoicesCollection,
        (res) => res.where("planid", "==", id)
      );
    } else if (fetchtype == 1) {
      return this.fs.collection<PlanScheduleDto>(
        this.planinvoicesCollection,
        (res) => res.where("planid", "==", id).where("invoicepaid", "==", true)
      );
    } else {
      return this.fs.collection<PlanScheduleDto>(
        this.planinvoicesCollection,
        (res) => res.where("planid", "==", id).where("invoicepaid", "==", false)
      );
    }
  }
  getCustomerSales(id: string) {
    return this.fs.collection<SalesDto>(this.salesCollection, (res) =>
      res.where("customerid", "==", id)
    );
  }
  addapartmenttypes(apartmenttypes: apartmenttypes) {
    var doc = this.fs.collection(this.apartmenttypesCollection).doc();
    apartmenttypes.id = doc.ref.id;
    return doc.set(apartmenttypes);
  }
  getapartmentbyid(id: string) {
    return this.fs.collection<Apartmentdto>(this.apartments).doc(id);
  }
  getapartmenttypes() {
    return this.fs.collection<apartmenttypes>(
      this.apartmenttypesCollection,
      (res) => res.orderBy("orderno")
    );
  }
  savePlan(PlanDto: PlanDto) {
    var doc = this.fs.collection<PlanDto>(this.planCollection).doc();
    PlanDto.id = doc.ref.id;
    PlanDto.updatedat = this.appUtils.getServerTimestamp();
    return doc.set(PlanDto);
  }
  getPlans() {
    return this.fs.collection<PlanDto>(this.planCollection);
  }
  getPlanById(id: string) {
    return this.fs.collection<PlanDto>(this.planCollection).doc(id);
  }
  deletePlanById(id: string) {
    return this.fs.collection<PlanDto>(this.planCollection).doc(id).delete();
  }
  updatePlanById(PlanDto: PlanDto) {
    PlanDto.updatedat = this.appUtils.getServerTimestamp();
    return this.fs
      .collection<PlanDto>(this.planCollection)
      .doc(PlanDto.id)
      .update(PlanDto);
  }
  deleteapartmenttype(id: string) {
    return this.fs.collection(this.apartmenttypesCollection).doc(id).delete();
  }
  addapartments(Apartmentdto: Apartmentdto) {
    var doc = this.fs.collection(this.apartments).doc();
    Apartmentdto.docid = doc.ref.id;
    return doc.set(Apartmentdto);
  }
  updateapartments(Apartmentdto: Apartmentdto) {
    return this.fs
      .collection(this.apartments)
      .doc(Apartmentdto.docid)
      .update(Apartmentdto);
  }
  getapartments(isarchive: boolean) {
    return this.fs.collection(this.apartments, (res) =>
      res.where("isarchive", "==", isarchive)
    );
  }
  getSALEapartments() {
    return this.fs.collection(this.apartments, (res) =>
      res.where("isarchive", "==", false).where("status", "==", "Open")
    );
  }
  getSalebyApartment(id:string)
  {
    return this.fs.collection(this.salesCollection,(res)=>res.where("apartmentname","==",id));
  }
  async getApartments(arr: String[], isarchive: boolean = false) {
    var apartment = await this.fs
      .collection<Apartmentdto>(this.apartments, (res) =>
        res.where("isarchive", "==", isarchive)
      )
      .get()
      .pipe()
      .toPromise();
    var apt: Apartmentdto[] = [];
    apartment.docs.forEach((e) => {
      apt.push(e.data());
    });

    return arr.length > 0 ? apt.filter((e) => arr.includes(e.status)) : apt;
  }
  archiveapartment(opt: boolean, id: string) {
    return this.fs
      .collection(this.apartments)
      .doc(id)
      .update({ isarchive: opt });
  }
  delete(Apartmentdto: Apartmentdto) {
    return this.fs.collection(this.apartments).doc(Apartmentdto.docid).delete();
  }
}

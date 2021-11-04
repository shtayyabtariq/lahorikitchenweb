import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentSnapshot,
} from "@angular/fire/firestore";
import { arch } from "os";

import { Apartmentdto, Invoicedto } from "../models/apartmentdto";
import { apartmenttypes } from "../models/apartmenttypesdto";
import {
  PlanDto,
  PlanScheduleDto,
  SalesDto,
  Transaction,
} from "../models/plandto";
import { ApputilsService } from "../helpers/apputils.service";
import { CustomerDto } from "../models/customerinfo";
import { query } from "@angular/animations";
import { metadata } from "../models/metadata";
import { stat } from "fs";

@Injectable({
  providedIn: "root",
})
export class firebaseStoreService {
  constructor(public fs: AngularFirestore, public appUtils: ApputilsService) {}
  apartments = "apartments";
  apartmenttypesCollection = "apartmenttypes";
  planCollection = "plans";
  salesCollection = "sales";
  customersCollection = "customers";
  planinvoicesCollection = "planinvoices";
  metadataCollection = "metadata";

  async addCustomer(customer: CustomerDto) {
    var doc = this.fs.collection(this.customersCollection).doc();
    customer.id = doc.ref.id;
    await doc.set(customer).then();
    return customer.id;
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
  addtransaction(tr: Transaction, invoiceid: string) {
    var doc = this.fs
      .collection(this.planinvoicesCollection)
      .doc(invoiceid)
      .collection("transactions")
      .doc();
    tr.id = doc.ref.id;
    return doc.set(tr);
  }
  gettransactions(invoiceid: string) {
    return this.fs
      .collection(this.planinvoicesCollection)
      .doc(invoiceid)
      .collection<Transaction>("transactions",res=>res.orderBy("transactiondate","desc"));
  }
  toggletransaction(invoiceid: string, tid: string, status: string) {
    return this.fs
      .collection(this.planinvoicesCollection)
      .doc(invoiceid)
      .collection("transactions")
      .doc(tid)
      .update({
        status: status,
      });
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
  getSaleInvoices(id: string) {
    return this.fs.collection<PlanScheduleDto>(
      this.planinvoicesCollection,
      (res) => res.where("planid", "==", id)
    );
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

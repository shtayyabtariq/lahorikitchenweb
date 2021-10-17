import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentSnapshot } from "@angular/fire/firestore";
import { arch } from "os";

import { Apartmentdto } from "../models/apartmentdto";
import { apartmenttypes } from "../models/apartmenttypesdto";
import { PlanDto, PlanScheduleDto } from '../models/plandto';
import { ApputilsService } from '../helpers/apputils.service';
@Injectable({
  providedIn: "root",
})
export class firebaseStoreService {
  constructor(public fs: AngularFirestore,public appUtils:ApputilsService) {}
  apartments = "apartments";
  apartmenttypesCollection = "apartmenttypes";
  planCollection = "plans";

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

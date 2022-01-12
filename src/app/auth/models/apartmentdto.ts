export interface Apartmentdto{
  docid ?:string;
  name:string;
  isarchive:boolean;
  id:string;
  type?:string;
  apartmenttype:string;
  netarea:number;
  floorno:string;
  discount:number;
  grossarea:number;
  status:string;
  price:number;
  createdat?:any;
  updatedat?:any;
  createdby?:string;
  updatedby?:string;
  totalprice?:number;
  notes?:string;

}
export interface Invoicedto{
  belongsto:string;
  createdat:any;
  updatedat:any;
  createdby:any;
  updatedby:any;
  agreementdate?:any;
  installmentplan?:number;
}
export interface groupApartments{
  type:string;
  availablecount:number;
  soldcount:number;
  soldaparments:Apartmentdto[];
  availableapartments:Apartmentdto[];
  sort ?:number; 
}
export interface AdvanceInventorySearch{

  type:string;
  apartmenttype:string;
  budget:number;
  floorno:number;

}
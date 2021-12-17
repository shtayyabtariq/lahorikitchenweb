export interface CustomerDto{
    id:string
    name:string;
    fathername:string;
    sex:boolean;
    cnic:string;
    nationality:string;
    mailaddress:string;
    permanentaddress:string;
    emailaddress:string;
    phonenumber:string;
    office:string;
    sourceofincome:string;
    businessname:string;
    status:boolean;
}
export interface creditamounts{
    id:string;
    amount:number;
    tid:string;
}
export interface Nominee{
    id:string;
    name:string;
    cnic:string;
    relationship:string;
    phonenumber:string;
    office:string;
    currentaddress:string;
    permanentaddress:string;
}
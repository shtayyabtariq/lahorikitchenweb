export interface metadata{
banks:banksdto[];
company:companydto[];
}
export interface banksdto{
    Name:string;
    Iban:string;
    Title ?:string;
    AccountNumber?:string;
}
export interface companydto{
    company:string;
    address:string;
    city:string;
    name:string;
    phonenumber:string;
    website:string;
}
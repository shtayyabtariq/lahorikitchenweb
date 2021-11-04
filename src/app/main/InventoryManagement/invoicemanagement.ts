import { PlanScheduleDto } from "../../auth/models/plandto";
import { InvoiceType, ApputilsService } from '../../auth/helpers/apputils.service';
 export class InvoiceManagement {
  static GenerateInvoice(
    invoiceType: string,
    amount: number,
    dueon: any,
    currentime:any,
    
  ): PlanScheduleDto {
    let inv: PlanScheduleDto = {
        installmentno: 0,
        amount: amount,
        amountpaid: 0,
        amountleft: amount,
        invoicedueon: dueon,
        invoicepaid: false,
        invoicepaidon: null,
        approvedby: null,
        approvalpicture: "",
        id: "",
        planid: "",
        type: invoiceType,
        createdat: currentime ,
        updateat: currentime
    };
    return inv;
  }
}

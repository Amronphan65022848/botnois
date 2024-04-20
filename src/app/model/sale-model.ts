/* point transfer */
export interface itemOnTable {
    header : string[],
    item : [itemOnTable],
  }
  
export interface SaleObj {
    Topic : string,
    salesname: string,
    codeName : string,
    Copy : string,
    titleIncome : string,
    bath: string,
    totalIncome : string,
    withdraw : string,
    customerList : string[],
    customerTotal : string[],
    Table : itemOnTable
}


export interface DataOnTable {
    icon : string,
    name : string,
    timestamp : string,
    income : string,
    share : string,
}
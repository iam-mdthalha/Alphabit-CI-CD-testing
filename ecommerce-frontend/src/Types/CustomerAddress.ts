export interface CustomerAddressAPI {
  id: number;
  customerNo: string; //CUSTNO
  customerName: string; //CONTACTNAME
  mobileNumber: string; //MOBILENUMBER
  email: string;
  addr1: string; //ADDR1 - address
  addr2: string; //ADDR2 - city / District / Town
  addr3: string; //ADDR3 - Locality
  addr4?: string; //ADDR4 - Landmark
  state: string; //STATE
  pinCode: string; //ZIP
  country: string;
}

export interface CustomerAddress {
  id: number;
  customerName: string; //CONTACTNAME
  mobileNumber: string; //MOBILENUMBER
  addr1: string; //ADDR1 - address
  addr2: string; //ADDR2 - city / District / Town
  addr3: string; //ADDR3 - Locality
  addr4?: string; //ADDR4 - Landmark
  state: string; //STATE
  pinCode: string; //ZIP
}

export interface Address {
  fullName: string;
  phone: string;
  pincode: string;
  addressLine1: string; // addr1
  addressLine2: string; // addr3
  city: string; // addr2
  state: string;
  country: string;
  landmark: string; // addr4
  email: string;
  isDefault: boolean;
}

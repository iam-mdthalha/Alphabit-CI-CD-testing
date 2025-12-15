export interface EventRegistration {
  id: number;
  eventHdrId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pin: string;
  plant?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventRegistrationDTO {
  id?: number;
  eventHdrId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pin: string;
}

export interface EventRegistrationResponse {
  id: number;
  eventHdrId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pin: string;
  plant: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventRegistrationFormData {
  id?: number;
  eventHdrId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pin: string;
  plant?: string;
}
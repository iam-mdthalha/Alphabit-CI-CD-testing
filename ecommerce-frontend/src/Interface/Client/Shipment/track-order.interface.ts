export interface TrackShipmentRequest {
    waybill: string;
    orderId: string;
}


export interface TrackShipmentDataResponse {
    ShipmentData: ShipmentContainer[];
}

export interface ShipmentContainer {
    Shipment: Shipment;
}

export interface Shipment {
    AWB: string;
    CODAmount: number;
    ChargedWeight: number | null;
    Consignee: Consignee;
    DeliveryDate: string | null;
    DestRecieveDate: string | null;
    Destination: string;
    DispatchCount: number;
    Ewaybill: any[]; // array of unknown type, update if needed
    ExpectedDeliveryDate: string | null;
    Extras: string;
    FirstAttemptDate: string | null;
    InvoiceAmount: number;
    OrderType: string;
    Origin: string;
    OriginRecieveDate: string | null;
    OutDestinationDate: string | null;
    PickUpDate: string;
    PickedupDate: string | null;
    PickupLocation: string;
    PromisedDeliveryDate: string | null;
    Quantity: string;
    RTOStartedDate: string | null;
    ReferenceNo: string;
    ReturnPromisedDeliveryDate: string | null;
    ReturnedDate: string | null;
    ReverseInTransit: boolean;
    Scans: Scan[];
    SenderName: string;
    Status: Status;
}

export interface Consignee {
    Address1: any[];
    Address2: any[];
    Address3: string;
    City: string;
    Country: string;
    Name: string;
    PinCode: number;
    State: string;
    Telephone1: string;
    Telephone2: string;
}

export interface Scan {
    ScanDetail: ScanDetail;
}

export interface ScanDetail {
    Instructions: string;
    Scan: string;
    ScanDateTime: string;
    ScanType: string;
    ScannedLocation: string;
    StatusCode: string;
    StatusDateTime: string;
}

export interface Status {
    Instructions: string;
    RecievedBy: string;
    Status: string;
    StatusCode: string;
    StatusDateTime: string;
    StatusLocation: string;
    StatusType: string;
}

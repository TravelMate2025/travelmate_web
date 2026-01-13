export interface Transfers {
    id: number;
    price: Price;
    status: string;
    content: TransferContent;
    rateKey: string;
    vehicle: Vehicle;
    category: Category;
    factsheetId: number;
    transferType: "PRIVATE" | "SHARED" | string;
    arrivalShipName: string | null;
    // transferDetails: Transfer[];
    arrivalTrainInfo: null;
    departureShipName: null;
    pickupInformation: PickupInformation;
    departureTrainInfo: null;
    arrivalFlightNumber: string | null;
    cancellationPolicies: CancellationPolicy[];
    departureFlightNumber: string | null;
    sourceMarketEmergencyNumber: string;
}
export interface TransfersDetailsResponse {
    holder: Holder;
    remark: string;
    status: "CONFIRMED" | "CANCELLED" | string;
    currency: string;
    supplier: Supplier;
    reference: string;
    transfers: Transfers[];
    totalAmount: number;
    creationDate: string;
    bookingFileId: string | null;
    pendingAmount: number;
    invoiceCompany: InvoiceCompany;
    totalNetAmount: number;
    clientReference: string;
    paymentDataRequired: boolean;
    modificationsPolicies: ModificationsPolicies;
}
export interface Holder {
    name: string;
    surname: string;
    email: string;
    phone: string;
}

export interface Supplier {
    name: string;
    vatNumber: string;
}

export interface InvoiceCompany {
    code: string;
}

export interface ModificationsPolicies {
    cancellation: boolean;
    modification: boolean;
}
export interface Price {
    netAmount: number;
    totalAmount: number;
    currencyId: string;
}
export interface TransferContent {
    images: Image[];
    vehicle: Vehicle;
    category: Category;
    transferRemarks: TransferRemark[];
    transferDetailInfo: TransferDetailInfo[];
    customerTransferTimeInfo: unknown[];
    supplierTransferTimeInfo: unknown[];
}
export interface Image {
    url: string;
    type: "EXTRALARGE" | "LARGE" | "MEDIUM" | "SMALL" | string;
}

export interface Vehicle {
    code: string;
    name: string;
}

export interface Category {
    code: string;
    name: string;
}
export interface TransferRemark {
    type: string;
    mandatory: boolean;
    description: string;
}

export interface TransferDetailInfo {
    id: string;
    name: string;
    type: string;
    value: string;
    description: string;
}
export interface PickupInformation {
    from: LocationPoint;
    to: LocationPoint;
    date: string;
    time: string;
    pickup: PickupDetails;
}

export interface LocationPoint {
    code: string;
    type: string;
    typeEnum: string;
    description: string;
}
export interface CancellationPolicy {
    from: string;
    amount: number;
    currencyId: string;
    isForceMajeure: boolean;
}
export interface PickupDetails {
    zip: string | null;
    town: string | null;
    image: string | null;
    number: string | null;
    address: string | null;
    altitude: number | null;
    latitude: number;
    longitude: number;
    pickupId: string | null;
    stopName: string | null;
    checkPickup: CheckPickup;
    description: string;
}

export interface CheckPickup {
    url: string | null;
    mustCheckPickupTime: boolean;
    hoursBeforeConsulting: number | null;
}

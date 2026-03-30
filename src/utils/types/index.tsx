export interface Industry {
  id: string;
  title: string;
  useCase: string;
  benefits: string;
}

export interface ProductData {
  name: string;
  gtin: string;
  batch: string;
  expiry: string;
  serial: string;
  barcodeType: string;
  multiUrls: string;
}

export interface DemoForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

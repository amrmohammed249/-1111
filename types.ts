
export interface LineItem {
  id: string;
  name: string;
  unit: string;
  capacity: number; // The number of main units in this package (e.g., 40kg in a sack)
  mainPrice: number; // Price per main unit (e.g., Kilo)
  subPrice: number;  // Calculated Total (mainPrice * capacity)
}

export interface InventoryItem {
  id: string;
  name: string;
  subUnitName: string; // e.g., "شوال", "كرتونة"
  conversionFactor: number; // How many main units in sub unit (e.g., 25)
  pricePerMainUnit: number; // Price per Kilo
}

export interface CompanyDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
}

export interface ClientDetails {
  name: string;
  company: string;
  address: string;
  email: string;
}

export interface QuotationData {
  id: string;
  title: string;
  date: string;
  dueDate: string;
  taxRate: number;
  discountRate: number;
  currency: string;
  notes: string;
  headerLayout: 'right' | 'left' | 'center';
}

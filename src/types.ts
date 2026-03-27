export type UserRole = 'customer' | 'processing_unit' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export type ApplicationStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  fields: ServiceField[];
}

export interface ServiceField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'file';
  required: boolean;
  options?: string[];
}

export interface Application {
  id: string;
  userId: string;
  serviceId: string;
  status: ApplicationStatus;
  data: Record<string, any>;
  documents: { name: string; url: string; status?: 'pending' | 'uploaded' | 'verified' }[];
  requiredDocuments?: string[];
  assignedTo?: string;
  remarks?: string;
  outputUrl?: string;
  aiReport?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  applicationId: string;
  userId: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  razorpayOrderId?: string;
  createdAt: string;
}

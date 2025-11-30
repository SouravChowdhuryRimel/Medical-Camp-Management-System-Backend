export interface ICompanyInformation {
  clientName: string;
  role: string;
  email: string;
  phoneNumber: string;
  imageUrl?: string; // Optional field
  password: string;
  isReferred: boolean;
}

export interface IReferrerInformation {
  name: string;
  phoneNumber: string;
  email?: string; // Optional field
  referralSource: string;
  isVisibleToClient: boolean;
}

export interface IUserManagement {
  // Company Information
  companyInfo: ICompanyInformation;
  
  // Referrer Information (conditional - only if referred)
  referrerInfo?: IReferrerInformation;
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'pending';
  verificationStatus: 'verified' | 'unverified' | 'pending';
}

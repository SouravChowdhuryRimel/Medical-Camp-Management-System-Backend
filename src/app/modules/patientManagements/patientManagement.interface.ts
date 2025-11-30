export interface IpatientManagement {
  patientId: string;
  campId: string;
  campName?: string;
  patientName?: string;
  status: 'Wating for Registration' | 'Waiting for Vitals' | 'Waiting for Consultation' | 'Screening Complete';
  waitTime?: string;
  complianceStatus?: 'Complete' | 'Pending';
  createdAt?: Date;
  updatedAt?: Date;
}
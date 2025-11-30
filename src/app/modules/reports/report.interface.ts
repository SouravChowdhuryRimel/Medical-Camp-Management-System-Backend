export interface IReport {
  patientId: string;
  reports: string[]; // Cloudinary URLs
  createdAt?: Date;
}

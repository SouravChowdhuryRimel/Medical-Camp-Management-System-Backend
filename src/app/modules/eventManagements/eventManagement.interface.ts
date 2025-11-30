export interface ILocationCoords {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface ICamp {
  _id?: string;
  campName: string;
  location?: string;
  status?: "Ongoing" | "Upcoming" | "Completed";
  assignAdmin: string;
  startDate?: Date;
  endDate?: Date;
  avgTime: number;
  patientToday?: number;
  completion?: number;
  totalEnrolled?: number;
  totalScreened?: number;
  locationCoords?: ILocationCoords;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICampCreate {
  campName: string;
  location: string;
  status: "Ongoing" | "Upcoming" | "Completed";
  assignAdmin: string;
  avgTime: number;
}

export interface ICampUpdate {
  campName?: string;
  location?: string;
  status: "Ongoing" | "Upcoming" | "Completed";
  assignAdmin?: string;
  avgTime: number;
}

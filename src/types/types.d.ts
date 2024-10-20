import { Timestamp } from "firebase/firestore";

export interface UpdateProfileParams {
  fullName: string;
  phoneNumber: string;
  address: string;
  state: string;
  photoURL: string;
}
export interface UserProfile {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  state?: string;
  photoURL?: string;
  email?: string;
}
interface CNIC {
  back: string;
  front: string;
}

export interface Hostel {
  name: string;
  email?: string;
  location: string;
  contactNumber?: string;
  type?: "Student" | "Staff" | "Visitor";
  description?: string;
  images?: string[];
  rooms?: Room[];
}
export interface Room {
  roomNumber: string;
  type: "Single Room" | "Double Room" | "Shared Room" | "Bunker Room";
  numberOfBeds: number;
  washroom: number;
  seatsAvailable: number;
  price: number;
}
export interface Warden {
  key: ?string;
  id: string;
  wardenId: string;
  email: string;
  cnic: CNIC;
  fullName: string;
  phoneNumber: string;
  hostel: Hostel;
  status: string;
  createdAt: Timestamp;
  photoURL?: string;
  currentAddress?: string;
  currentState?: string;
}

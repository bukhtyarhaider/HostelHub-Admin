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

import { User } from "firebase/auth";

export interface HeaderProps {
  authUser: User | null;
}

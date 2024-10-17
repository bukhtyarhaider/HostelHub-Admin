import { UserProfile } from "../../../types/types";

export interface ProfileInfoProps {
  userData: UserProfile;
  setUserData: React.Dispatch<React.SetStateAction<UserProfile | undefined>>;
}

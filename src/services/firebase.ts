import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Hostel,
  UpdateProfileParams,
  UserProfile,
  Warden,
} from "../types/types";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export const signIn = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred during sign-in.");
    }
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const observeAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const uploadImage = async (file: File, path: string) => {
  try {
    const imageRef = ref(storage, path);
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Failed to upload profile image: " + error.message);
    } else {
      throw new Error(
        "Failed to upload profile image: An unexpected error occurred"
      );
    }
  }
};

export const _updateProfile = async ({
  fullName,
  phoneNumber,
  address,
  state,
  photoURL,
}: UpdateProfileParams): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, { displayName: fullName, photoURL });

      await setDoc(
        doc(db, "admin", user.uid),
        {
          phoneNumber: phoneNumber,
          address: address,
          state: state,
          photoURL: photoURL,
        },
        { merge: true }
      );

      return "User profile updated successfully.";
    } else {
      throw new Error("No user is currently signed in.");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getProfile = async (): Promise<UserProfile> => {
  const user = auth.currentUser;

  if (user) {
    const userDocRef = doc(db, "admin", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        fullName: user.displayName ?? "",
        email: user.email ?? "",
        photoURL: user.photoURL ?? "",
        phoneNumber: userData?.phoneNumber ?? "",
        state: userData?.state ?? "",
        address: userData?.address ?? "",
      };
    } else {
      throw new Error("User data not found.");
    }
  } else {
    throw new Error("No user is currently signed in.");
  }
};

export const _updatePassword = async (newPassword: string) => {
  const user = auth.currentUser;
  if (user) {
    try {
      await updatePassword(user, newPassword);
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        throw new Error("Please re-authenticate to update your password.");
      } else {
        throw new Error(error.message);
      }
    }
  } else {
    throw new Error("No user is currently signed in.");
  }
};

export const getWardens = async (): Promise<Warden[]> => {
  try {
    const wardenCollectionRef = collection(db, "wardens");
    const snapshot = await getDocs(wardenCollectionRef);

    const wardenRecords: Warden[] = [];
    for (const document of snapshot.docs) {
      const data = document.data();
      const hostelRef = doc(db, "hostels", data.hostelId);
      const hostelSnap = await getDoc(hostelRef);

      let hostelData: Hostel | null = null;
      if (hostelSnap.exists()) {
        const hostelInfo = hostelSnap.data(); // Correctly access data from snapshot
        const roomsRef = collection(hostelRef, "rooms");
        const roomsSnap = await getDocs(roomsRef);
        const rooms = roomsSnap.docs.map((roomDoc) => {
          const roomData = roomDoc.data(); // Correctly access data from snapshot
          return {
            roomNumber: roomDoc.id,
            type: roomData.type,
            numberOfBeds: roomData.numberOfBeds,
            washroom: roomData.washroom,
            seatsAvailable: roomData.seatsAvailable,
            price: roomData.price,
          };
        });

        hostelData = {
          name: hostelInfo.name,
          email: hostelInfo.email,
          location: hostelInfo.location,
          contactNumber: hostelInfo.contactNumber,
          type: hostelInfo.type,
          description: hostelInfo.description,
          images: hostelInfo.images,
          rooms: rooms,
        };
      }

      const warden: Warden = {
        key: data.key,
        id: document.id,
        wardenId: data.wardenId,
        email: data.email,
        cnic: data.cnic,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        hostel: hostelData as Hostel,
        status: data.status,
        createdAt: data.createdAt,
        photoURL: data.photoURL,
        currentAddress: data.currentAddress,
        currentState: data.currentState,
      };
      wardenRecords.push(warden);
    }

    return wardenRecords;
  } catch (error) {
    throw new Error(
      "Failed to fetch warden records: " +
        (error instanceof Error
          ? error.message
          : "An unexpected error occurred")
    );
  }
};

export const updateWardenStatus = async (
  docId: string,
  newStatus: string
): Promise<string> => {
  try {
    const wardenDocRef = doc(db, "wardens", docId);
    await updateDoc(wardenDocRef, {
      status: newStatus,
    });

    return "Warden status updated successfully.";
  } catch (error) {
    throw new Error(
      "Failed to update warden status: " +
        (error instanceof Error
          ? error.message
          : "An unexpected error occurred")
    );
  }
};

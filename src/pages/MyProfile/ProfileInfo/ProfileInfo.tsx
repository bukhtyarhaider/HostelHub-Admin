import React, { useState } from "react";
import { message, Select } from "antd";
import styles from "./ProfileInfo.module.scss";
import { avatar, cameraIcon } from "../../../assets";
import CustomInput from "../../../components/CustomInput/CustomInput";
import { ProfileInfoProps } from "./ProfileInfoProps";
import { Loader } from "../../../components/Loader/Loader";
import { _updateProfile, uploadImage } from "../../../services/firebase";

const { Option } = Select;

const ProfileInfo: React.FC<ProfileInfoProps> = ({ userData, setUserData }) => {
  const [errors, setErrors] = useState<any>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setErrors((prevErrors: { [key: string]: string }) => ({
      ...prevErrors,
      [name]: "",
    }));

    setUserData({ ...userData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setErrors((prevErrors: { [key: string]: any }) => ({
      ...prevErrors,
      [name]: "",
    }));

    setUserData({ ...userData, [name]: value });
  };

  const validate = () => {
    const newErrors: any = {};

    if (!userData?.fullName) {
      newErrors.fullName = "Full Name is required";
    }

    if (!userData?.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!userData?.phoneNumber) {
      newErrors.phoneNumber = "Contact Number is required";
    } else if (!/^\+?\d{10,13}$/.test(userData.phoneNumber)) {
      newErrors.phoneNumber = "Contact Number is invalid";
    }

    if (!userData?.address) {
      newErrors.address = "Current Address is required";
    }

    if (!userData?.state) {
      newErrors.state = "Current State is required";
    }

    return newErrors;
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setIsLoading(true);
      try {
        let profileImageUrl = "";

        if (profileImage) {
          profileImageUrl = await uploadImage(
            profileImage,
            `profilePictures/${userData.email}`
          );
        } else {
          profileImageUrl = userData?.photoURL ?? "";
        }

        await _updateProfile({
          fullName: userData.fullName ?? "",
          phoneNumber: userData.phoneNumber ?? "",
          address: userData.address ?? "",
          state: userData.state ?? "",
          photoURL: profileImageUrl,
        });

        message.success("Profile Updatted!");
      } catch (error: unknown) {
        if (error instanceof Error) {
          message.error(`Failed to update profile: ${error.message}`);
        } else {
          message.error("Failed to update profile due to an unknown error.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.heading}>Admin Profile</h2>

      <div className={styles.profilePictureContainer}>
        {!!profileImage || userData.photoURL ? (
          <img
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : userData.photoURL
            }
            alt="Profile"
            className={styles.profilePicture}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {!!userData?.fullName ? userData?.fullName?.charAt(0) : "Admin"}
          </div>
        )}
        <div className={styles.cameraIcon}>
          <label htmlFor="profileImage">
            <img
              src={cameraIcon}
              alt="Camera Icon"
              style={{ cursor: "pointer" }}
            />
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onImageChange}
          />
        </div>
      </div>

      <h3 className={styles.subHeading}>User Information</h3>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <label>Full Name</label>
          <div className={styles.input}>
            <CustomInput
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={userData?.fullName ?? ""}
              onChange={handleChange}
            />
            {errors.fullName && <div className="error">{errors.fullName}</div>}
          </div>
        </div>

        <div className={styles.inputContainer}>
          <label>Email</label>
          <div className={styles.input}>
            <CustomInput
              type="email"
              name="email"
              placeholder="Email"
              disabled={true}
              value={userData?.email ?? ""}
              onChange={handleChange}
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
        </div>

        <div className={styles.inputContainer}>
          <label>Contact Number</label>
          <div className={styles.input}>
            <CustomInput
              type="text"
              name="phoneNumber"
              placeholder="Contact Number"
              value={userData?.phoneNumber ?? ""}
              onChange={handleChange}
            />
            {errors.phoneNumber && (
              <div className="error">{errors.phoneNumber}</div>
            )}
          </div>
        </div>

        <div className={styles.inputContainer}>
          <label>Current Address</label>
          <div className={styles.input}>
            <CustomInput
              type="text"
              name="address"
              placeholder="Current Address"
              value={userData?.address ?? ""}
              onChange={handleChange}
            />
            {errors.address && <div className="error">{errors.address}</div>}
          </div>
        </div>

        <div className={styles.inputContainer}>
          <label>Current State</label>
          <div className={styles.input}>
            <Select
              value={userData?.state}
              style={{ width: "100%" }}
              onChange={(value) => handleSelectChange("state", value)}
            >
              <Option value="Punjab">Punjab</Option>
              <Option value="Sindh">Sindh</Option>
              <Option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</Option>
              <Option value="Balochistan">Balochistan</Option>
            </Select>
            {errors.state && <div className="error">{errors.state}</div>}
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </div>
      </form>
      {<Loader hide={!isLoading} />}
    </div>
  );
};

export default ProfileInfo;

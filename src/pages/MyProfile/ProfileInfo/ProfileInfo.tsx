import React, { useState } from "react";
import { Select } from "antd";
import styles from "./ProfileInfo.module.scss";
import { avatar, cameraIcon } from "../../../assets";
import CustomInput from "../../../components/CustomInput/CustomInput";

const { Option } = Select;

const ProfileInfo = ({ userData, setUserData }) => {
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Remove error for the specific field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setUserData({ ...userData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    // Remove error for the specific field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setUserData({ ...userData, [name]: value });
  };

  const validate = () => {
    const newErrors: any = {};

    if (!userData.fullName) {
      newErrors.fullName = "Full Name is required";
    }

    if (!userData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!userData.phoneNumber) {
      newErrors.phoneNumber = "Contact Number is required";
    } else if (!/^\+?\d{10,13}$/.test(userData.phoneNumber)) {
      newErrors.phoneNumber = "Contact Number is invalid";
    }

    if (!userData.currentAddress) {
      newErrors.currentAddress = "Current Address is required";
    }

    if (!userData.currentState) {
      newErrors.currentState = "Current State is required";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Handle successful form submission here
      console.log("Form submitted successfully", userData);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.heading}>User Profile</h2>

      <div className={styles.profilePictureContainer}>
        <img src={avatar} alt="Profile" className={styles.profilePicture} />
        <div className={styles.cameraIcon}>
          <img src={cameraIcon} alt="Camera Icon" />
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
              value={userData.fullName}
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
              value={userData.email}
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
              value={userData.phoneNumber}
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
              name="currentAddress"
              placeholder="Current Address"
              value={userData.currentAddress}
              onChange={handleChange}
            />
            {errors.currentAddress && (
              <div className="error">{errors.currentAddress}</div>
            )}
          </div>
        </div>

        <div className={styles.inputContainer}>
          <label>Current State</label>
          <div className={styles.input}>
            <Select
              value={userData.currentState}
              style={{ width: "100%" }}
              onChange={(value) => handleSelectChange("currentState", value)}
            >
              <Option value="Punjab">Punjab</Option>
              <Option value="Sindh">Sindh</Option>
              <Option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</Option>
              <Option value="Balochistan">Balochistan</Option>
            </Select>
            {errors.currentState && (
              <div className="error">{errors.currentState}</div>
            )}
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" className={styles.backButton}>
            Back
          </button>
          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;

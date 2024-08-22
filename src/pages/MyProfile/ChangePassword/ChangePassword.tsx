import React, { useState } from "react";
import styles from "./ChangePassword.module.scss";
import CustomInput from "../../../components/CustomInput/CustomInput";

const ChangePassword = ({ userData, setUserData }) => {
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Remove error for the specific field being changed
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setUserData({ ...userData, [name]: value });
  };

  const validate = () => {
    const newErrors: any = {};

    if (!userData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!userData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (userData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }

    if (!userData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (userData.confirmPassword !== userData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

      <h3 className={styles.subHeading}>Change Password</h3>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <label>Current Password</label>
          <div className={styles.input}>
            <CustomInput
              type="text"
              name="currentPassword"
              placeholder="Enter current password"
              value={userData.currentPassword}
              onChange={handleChange}
            />
            {errors.currentPassword && (
              <div className="error">{errors.currentPassword}</div>
            )}
          </div>
        </div>

        <div className={styles.inputContainer}>
          <label>New Password</label>
          <div className={styles.input}>
            <CustomInput
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={userData.newPassword}
              onChange={handleChange}
            />
            {errors.newPassword && (
              <div className="error">{errors.newPassword}</div>
            )}
          </div>
        </div>

        <div className={styles.inputContainer}>
          <label>Confirm New Password</label>
          <div className={styles.input}>
            <CustomInput
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={userData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <div className="error">{errors.confirmPassword}</div>
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

export default ChangePassword;

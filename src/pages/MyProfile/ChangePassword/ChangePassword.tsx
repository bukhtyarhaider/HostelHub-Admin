import React, { useState } from "react";
import styles from "./ChangePassword.module.scss";
import CustomInput from "../../../components/CustomInput/CustomInput";
import { _updatePassword } from "../../../services/firebase";
import { Loader } from "../../../components/Loader/Loader";
import { message } from "antd";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setPasswordData((prevPasswordData) => ({
      ...prevPasswordData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        setIsLoading(true);
        await _updatePassword(passwordData.newPassword).catch();
        message.success("Password Updatted!");
      } catch (error: any) {
        setErrors({ firebaseError: error.message, ...errors });
        message.error(`${error.message}`);
        throw new Error(error.message);
      } finally {
        setIsLoading(false);
      }
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
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
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              value={passwordData.currentPassword}
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
              value={passwordData.newPassword}
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
              value={passwordData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <div className="error">{errors.confirmPassword}</div>
            )}
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </div>
      </form>
      <Loader hide={!isLoading} />
    </div>
  );
};

export default ChangePassword;

import { useState } from "react";
import styles from "./Login.module.scss";
import CustomInput from "../../../components/CustomInput/CustomInput";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("warden");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Remove error for the specific field
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [name]: "",
    }));

    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const authToken = "your-generated-auth-token";
      localStorage.setItem("authToken", authToken);
      navigate("/");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.heading}>Welcome To The Portal</h2>
        <p className={styles.subHeading}>Please login using your details.</p>

        <div className={styles.switchButtons}>
          <button
            className={`${styles.switchButton} ${
              activeTab === "warden" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("warden")}
          >
            SIGN IN AS WARDEN
          </button>
          <button
            className={`${styles.switchButton} ${
              activeTab === "admin" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("admin")}
          >
            SIGN IN AS ADMIN
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <label>Email</label>
            <div className={styles.input}>
              <CustomInput
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
          </div>

          <div className={styles.inputContainer}>
            <label>Password</label>
            <div className={styles.input}>
              <CustomInput
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="error">{errors.password}</div>
              )}
            </div>
          </div>

          <div className={styles.buttonWrapper}>
            <button type="submit" className="info">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

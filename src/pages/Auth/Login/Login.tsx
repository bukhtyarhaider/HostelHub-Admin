import { useState } from "react";
import styles from "./Login.module.scss";
import CustomInput from "../../../components/CustomInput/CustomInput";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../../services/firebase";
import { Loader } from "../../../components/Loader/Loader";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setIsLoading(true);
      try {
        await signIn(formData.email, formData.password);
        setIsLoading(false);
        navigate("/");
      } catch (error: any) {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          form: error.message,
        }));
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.heading}>Welcome To The Portal</h2>
        <p className={styles.subHeading}>Please login using your details.</p>

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
              {errors.form && <div className="error">{errors.form}</div>}
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
      {<Loader hide={!isLoading} />}
    </div>
  );
};

export default Login;

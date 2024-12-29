import React from "react";
import styles from "./Loader.module.scss";
import ClipLoader from "react-spinners/ClipLoader";
import { LoaderProps } from "./LoaderProps";

export const Loader: React.FC<LoaderProps> = ({
  hide = false,
  size = 50,
  color = "#123abc",
}) => {
  if (hide) {
    return null;
  }

  return (
    <div className={styles.loaderContainer}>
      <ClipLoader size={size} color={color} />
    </div>
  );
};

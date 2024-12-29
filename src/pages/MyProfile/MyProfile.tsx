import { Tabs } from "antd";
import styles from "./MyProfile.module.scss";
import ProfileInfo from "./ProfileInfo/ProfileInfo";
import ChangePassword from "./ChangePassword/ChangePassword";
import { useEffect, useState } from "react";
import { getProfile } from "../../services/firebase";
import { Loader } from "../../components/Loader/Loader";
import { UserProfile } from "../../types/types";

const MyProfile = () => {
  const [userData, setUserData] = useState<UserProfile>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfile();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchData();
  }, []);

  const items = [
    {
      key: "1",
      label: "USER INFORMATION",
      children: !!userData ? (
        <ProfileInfo userData={userData} setUserData={setUserData} />
      ) : (
        <Loader />
      ),
    },
    {
      key: "2",
      label: "CHANGE PASSWORD",
      children: <ChangePassword />,
    },
  ];
  return (
    <div className={styles.myProfileContainer}>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default MyProfile;

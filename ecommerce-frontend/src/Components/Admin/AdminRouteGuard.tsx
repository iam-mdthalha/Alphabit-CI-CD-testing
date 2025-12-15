import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "State/store";

const AdminRouteGuard = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const { adminToken, isAdminLoggedIn } = useSelector((state: RootState) => state.adminlogin);

  useEffect(() => {
    if (!adminToken || !isAdminLoggedIn) {
      notifications.show({
        title: "Access Denied",
        message: "Please login as admin to access this page",
        color: "red",
      });
      navigate("/admin-login");
    }
  }, [adminToken, isAdminLoggedIn, navigate]);

  return adminToken && isAdminLoggedIn ? children : null;
};

export default AdminRouteGuard;
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "State/Admin/AuthSlice/AdminLoginSlice";
import { setAdminLoggedIn } from "State/Admin/StateEvents/AdminStateEvents";

const AdminLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(adminLogout());
    dispatch(setAdminLoggedIn(false));
    navigate("/admin-login");
  }, [dispatch, navigate]);

  return null;
};

export default AdminLogout;

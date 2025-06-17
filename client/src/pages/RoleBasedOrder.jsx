import { useSelector } from "react-redux";
import AdminOrders from "../pages/AdminOrders";
import MyOrders from "../pages/MyOrders";
// import AdminOrders from "../pages/AdminOrders";

const RoleBasedOrder = () => {
  const user = useSelector((state) => state.user);

  if (user?.role === "ADMIN") {
    return <AdminOrders />;
  } else {
    return <MyOrders />;
  }
};

export default RoleBasedOrder;

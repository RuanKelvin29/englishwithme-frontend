import { useRouter } from "next/navigation";

export const handleTokenExpired = () => {

  localStorage.removeItem("user");
  localStorage.removeItem("token");

  alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

  const router = useRouter();
  router.replace("/");
};
import { jwtDecode } from "jwt-decode";

export function getTokenRole() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = jwtDecode(token);
  return decoded.VaiTro;
}

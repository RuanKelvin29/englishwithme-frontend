import API from "./apiConfig";

export const loginUser = async (IDTaiKhoan, MatKhau) => {
    const response = await API.post("/api/auth/login", { IDTaiKhoan, MatKhau });
    return response.data;
}; 

export const registerUser = async (
  IDTaiKhoan,
  MatKhau,
  Email
) => {
    const response = await API.post("/api/auth/register", {
      IDTaiKhoan,
      MatKhau,
      Email,
    });
  return response.data;
};

export const updateUserProfile = async (user) => {
    const response = await API.put("/api/auth/update-profile", user);
    return response.data;
};
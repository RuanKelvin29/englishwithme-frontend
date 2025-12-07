import API from "./apiConfig";

export const getAccounts = async (query = "") => {
    const response = await API.get(`/api/accounts${query}`);
    return response.data;
}

export const getAccountByID = async (IDTaiKhoan, query = "") => {
    const response = await API.get(`/api/accounts/${IDTaiKhoan}${query}`);
    return response.data;
}

export const deleteAccount = async (IDTaiKhoan) => {
    const response = await API.delete(`/api/accounts/${IDTaiKhoan}`);
    return response.data;
}
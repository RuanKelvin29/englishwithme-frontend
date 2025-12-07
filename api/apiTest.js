import API from "./apiConfig";

export const getTests = async (query = "") => {
  const response = await API.get(`/api/tests${query}`);
  return response.data;
};

export const getTestForEdit = async (IDDeThi) => {
  const response = await API.get(`/api/tests/edit/${IDDeThi}`);
  return response.data;
}

export const getTestByID = async (IDDeThi) => {
  const response = await API.get(`/api/tests/${IDDeThi}`);
  return response.data;
};

export const createTest = async (formData) => {
  const response = await API.post(`/api/tests/create-test`, formData, {
    headers: { 
      "Content-Type": "multipart/form-data", 
    },
  });
  return response.data;
}

export const updateTest = async (IDDeThi, formData) => {
  const response = await API.put(`api/tests/update-test/${IDDeThi}`, formData, {
    headers: { 
      "Content-Type": "multipart/form-data", 
    },
  });
  return response.data;
}

export const toggleTestVisibility = async (IDDeThi) => {
  const response = await API.patch(`/api/tests/toggle-hidden/${IDDeThi}`);
  return response.data;
};
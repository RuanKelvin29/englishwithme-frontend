import API from "./apiConfig";

export const uploadAudio = async (formData) => {
    const response = await API.post("/api/uploads/upload-audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });
    return response.data;
}
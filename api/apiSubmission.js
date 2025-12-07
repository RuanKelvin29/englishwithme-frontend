import API from "./apiConfig";

export const getSubmissions = async (query = "") => {
    const response = await API.get(`/api/submissions${query}`);
    return response.data;
}

export const getSubmissionsByTestID = async (IDDeThi, query="") => {
    const response = await API.get(`/api/submissions/test/${IDDeThi}${query}`);
    return response.data;
};

export const getSubmissionByID = async (IDBaiThi) => {
    const response = await API.get(`/api/submissions/${IDBaiThi}`);
    return response.data;
}

export const createSubmission = async ( IDDeThi, user ) => {
    const response = await API.post("/api/submissions/start-submission", {IDDeThi, user});
    return response.data;
};

export const submitSubmission = async (IDBaiThi, answers) => {
    const response = await API.post("/api/submissions/submit-submission", {IDBaiThi, answers});
    return response.data;
}

export const deleteSubmission = async (IDBaiThi) => {
    const response = await API.delete(`/api/submissions/${IDBaiThi}`);
    return response.data;
}

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

/**
 * Uploads a resume PDF for analysis.
 * @param {File} file
 * @returns {Promise<object>} the analysis object from the backend
 */
export async function analyzeResume(file) {
  console.log("file", file);
  const formData = new FormData();
  console.log("formdata line 19", formData);
  formData.append("resume", file);
  console.log("reaced line 21");

  try {
    console.log("form", formData);
    const response = await api.post("/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.code === "ECONNABORTED") {
      throw new Error(
        "The request timed out. Please check your connection and try again."
      );
    }
    if (!error.response) {
      throw new Error(
        "Could not reach the server. Please make sure the backend is running."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
}

export default api;

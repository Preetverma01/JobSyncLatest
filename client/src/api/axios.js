import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jobsync-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Uploads a resume PDF for analysis.
 * Posts to the authenticated endpoint POST /api/resume/analyze,
 * which returns { success, message, resume, analysis }.
 * @param {File} file
 * @returns {Promise<object>} the backend response payload
 */
export async function analyzeResume(file) {
  const formData = new FormData();
  formData.append("resume", file);

  try {
    const response = await api.post("/resume/analyze", formData, {
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

import axios from "axios";
import config from "../config";

async function collectStorage() {
  try {
    const res = await axios.post(
      config.url + "/users/collect-storage",
      {},
      {
        headers: {
          "Access-Control-Expose-Headers": "X-Session",
          "X-Session": localStorage.getItem("session_key"),
        },
      }
    );
    localStorage.setItem("session_key", res.headers.get("X-Session"));
    return res.data;
  } catch (error) {
    console.error("Error connect:", error);
    return null;
  }
}

export default collectStorage;

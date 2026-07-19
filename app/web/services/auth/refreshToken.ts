import api from "@/lib/api";

export default async function refreshToken() {
  try {
    const res = await api.post("/v1/auth/token/refresh");
    return res.data.status;
  } catch (err) {
    return null;
  }
}

import api from "@/lib/api";

export const sendVerificationEmail = async (email: string) => {
  await api.post("/v1/auth/verify/send", { email });
};

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/api";
import refreshToken from "@/services/auth/refreshToken";
interface User {
  id: string;
  email: string;
  name?: string;
  isVerified?: boolean;
}

interface UseMeResult {
  user: User | null;
  loading: boolean;
  route: boolean;
}

export function useMe(): UseMeResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState(false);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await api.get("/v1/auth/me");
        setUser(res.data.data.user);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          const token = await refreshToken();
          if (token === 200) {
            return fetchMe();
          }
          setUser(null);
          setRoute(true);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  return { user, loading, route };
}

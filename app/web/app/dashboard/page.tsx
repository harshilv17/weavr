"use client";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { useMe } from "@/hooks/useMe";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading, route } = useMe();

  const router = useRouter();

  useEffect(() => {
    if (route) {
      router.push("/signin");
    }
    if (user?.isVerified === false) {
      router.push(`/verification/${user.email}`);
    }
  }, [route, user]);

  if (loading) return null;

  return <DashboardClient user={user} />;
}

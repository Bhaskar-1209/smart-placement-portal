"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

export default function RequireAuth({ roles, children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (!loading && user && roles?.length && !roles.includes(user.role)) router.replace("/dashboard");
  }, [loading, user, roles, router]);

  if (loading || !user) return <div className="content">Loading...</div>;
  if (roles?.length && !roles.includes(user.role)) return null;
  return children;
}

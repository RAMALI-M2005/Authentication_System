"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function SignOutButton({ btnStyle }: { btnStyle?: React.CSSProperties }) {
  const [loading, setLoading] = useState(false);
  const nav = useRouter()

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
         toast.success("User Signed Out successfully")
         nav.push("/account/sign-in");
      } else {
        console.error(data.error);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <button onClick={handleSignOut} style={btnStyle} disabled={loading}>
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}

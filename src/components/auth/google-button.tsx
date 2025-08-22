"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface SignOutButtonProps {
  label?: string;
}

export default function GoogleButton({ label  }: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/oAuthSignIn", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Something went wrong!");
        setLoading(false);
      }
    } catch {
      toast.error("Failed to sign out");
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleSignOut}
      disabled={loading}
    >
      {loading ? (
        "Google provider Loading..."
      ) : (
        <>
          <LogOut className="w-4 h-4" />
          {label}
        </>
      )}
    </Button>
  );
}

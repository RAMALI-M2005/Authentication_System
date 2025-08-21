"use client"
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function EmailVerification() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const codeparam = searchParams.get("code");

  const [userEmail, setUserEmail] = useState(email || "");
  const [step, setStep] = useState<"send" | "verify">("send");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(codeparam || "");
  const nav = useRouter();

  // 👉 Run side-effects safely
useEffect(() => {
  if (!userEmail) {
    toast.info("Enter your email.", { description: "to get the verification code." });
  }
}, []);


  useEffect(() => {
    if (codeparam) {
      setStep("verify");
    }
  }, [codeparam]);

  const handleSendCode = async () => {
    setLoading(true);
    if (!userEmail) {
      toast.error("email is required");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/emails/send-verification`, {
        method: "POST",
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message, {
          description: data.desc,
        });
        setUserEmail(data.email)
        setStep("verify");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong while sending the code: " + err, {
        description: "try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
  setLoading(true);
  try {
    const res = await fetch(`/api/emails/verify-code`, {
      method: "POST",
      body: JSON.stringify({ email: userEmail, code }), // <- use 'to' to match server
    });
    const data = await res.json();
    if (data.success) {
      toast.success(data.message);
      nav.push("/dashboard");
    } else {
      toast.error(data.message || "Invalid verification code", { description: "try again" });
    }
  } catch {
    toast.error("Something went wrong while verifying the code");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        {step === "send" && (
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
              Verify your email
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              We will send a 6-digit verification code to:
              <Input
                className="font-semibold"
                onChange={(e) => setUserEmail(e.target.value)}
                value={userEmail}
              />
            </p>
            <Button className="w-full" onClick={handleSendCode} disabled={loading}>
              {loading ? "Sending..." : "Send Verification Code"}
            </Button>
          </div>
        )}

        {step === "verify" && (
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
              Enter verification code
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              We sent a 6-digit code to:{" "}
              <span className="font-semibold">{email}</span>
            </p>
            <Input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className="text-center text-xl tracking-[10px] font-mono"
            />
            <Button
              className="w-full"
              onClick={handleVerifyCode}
              disabled={loading || code.length !== 6}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

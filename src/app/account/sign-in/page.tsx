"use client";

import React, { useState, FormEvent} from "react";
import { signIn } from "@/lib/actions";
import GoogleButton from "@/components/auth/google-button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const nav = useRouter();

  const validate = () => {
    if (!email) return "Email is required.";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) return "Enter a valid email.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await signIn({ email, password });

      if (res.status) {
        setSuccess(res.message || "User signed in successfully");
        toast.success(res.message);
        setEmail("");
        setPassword("");
        nav.push("/dashboard");
      } else {
        setError(res.error || "Sign in failed.");
        if (res.verificate) toast.error(res.error || "Sign in failed.", {
          duration:3000,
          description:res.desc,
            action: (
            <Link href={`/account/verification-email?email=${encodeURIComponent(email)}`}>
              <Button className="cursor-pointer p-1" variant="outline" size="sm">
                verify your email
              </Button>
            </Link>
          ),
        });
        else toast.error(res.error || "Sign in failed.");
      }
    } catch {
      setError("Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center flex-col justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign in
          </CardTitle>
          <CardDescription className="text-center">
            Welcome back! Please sign in to continue.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <GoogleButton label="Sign in with Google" />

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>{success}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            <div className="mt-2 flex items-center justify-center">
              <p>{"Don't"} have an account?</p>
              <Link href={"/account/sign-up"}>sign-up</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

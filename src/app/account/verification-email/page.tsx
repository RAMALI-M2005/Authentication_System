import EmailVerification from "@/components/verificationWrapped";
import { Suspense } from "react";




export default function VerificationEmailWrapper  ({ searchParams }: { searchParams: { [key: string]: string } }) {
   const emailParam = searchParams.email;
  const codeParam = searchParams.code;
  const stepParam = searchParams.step;
  const which = stepParam ? "verify" : codeParam ? "verify" : "send";

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EmailVerification   emailParam={emailParam}
      codeParam={codeParam}
      which={which}/>
    </Suspense>
  );
};

import EmailVerification from "@/components/verificationWrapped";
import { Suspense } from "react";




export default function VerificationEmailWrapper  ({ searchParams }: { searchParams: { [key: string]: string } }) {


  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EmailVerification searchParams={searchParams} />
    </Suspense>
  );
};

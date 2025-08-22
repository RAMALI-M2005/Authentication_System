import EmailVerification from "@/components/verificationWrapped";
import { Suspense } from "react";




const VerificationEmailWrapper = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EmailVerification/>
    </Suspense>
  );
};

export default VerificationEmailWrapper;
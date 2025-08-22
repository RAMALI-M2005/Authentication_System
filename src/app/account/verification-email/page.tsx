// app/account/verification-email/page.tsx

import EmailVerification from "@/components/verificationWrapped";
import { Suspense } from "react";

export default function VerificationEmail(){
   return <VerificationEmailWrapper/>
}

 function VerificationEmailWrapper() {

  return (
    <Suspense fallback={<p>loading...</p>}>
      <EmailVerification/>
    </Suspense>
  );
}




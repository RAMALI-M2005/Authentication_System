// app/account/verification-email/page.tsx

import EmailVerification from "@/components/verificationWrapped";

export default function VerificationEmailWrapper({ searchParams }: { searchParams: { [key: string]: string } }) {
  // No Suspense needed since EmailVerification is client-only and
  // doesn’t directly call useSearchParams anymore
  return <EmailVerification searchParams={searchParams} />;
}

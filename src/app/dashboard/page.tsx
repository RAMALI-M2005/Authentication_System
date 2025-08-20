"use client";

import Link from "next/link";

export default function Page() {
  return (
  <>
    <p>secret page</p>
    <Link href={"/"} className="text-blue-400 hover:underline">go back to home</Link>
  </>
);
}

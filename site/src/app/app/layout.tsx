import NextTopLoader from "nextjs-toploader";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { UserProvider } from "./components/UserContext"; // This will be the client-side context
import { redirect } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const token = cookies().get("token")?.value || null; // Fetch the token from cookies
  if (!token) {
    return redirect("/");
  }

  return (
    <>
      <NextTopLoader showSpinner={false} color="rgb(37 99 235)" zIndex={100} />
      <UserProvider token={token}>{children}</UserProvider>
    </>
  );
}

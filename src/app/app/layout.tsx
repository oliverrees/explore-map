import { cookies } from "next/headers";
import { ReactNode } from "react";
import { UserProvider } from "./components/UserContext"; // This will be the client-side context
import { redirect } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const token = cookies().get("token")?.value || null; // Fetch the token from cookies
  if (!token) {
    return redirect("/");
  }

  return <UserProvider token={token}>{children}</UserProvider>;
}

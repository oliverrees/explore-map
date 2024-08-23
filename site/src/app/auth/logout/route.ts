// app/auth/logout/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function GET(request: Request) {
  try {
    // Clear the token cookie by setting it to expire immediately
    cookies().set("token", "", { expires: new Date(0) });

    // Construct the absolute URL for the home page

    // Redirect the user to the home page
    return NextResponse.redirect(process.env.BASE_URL || "", 302);
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { success: false, message: "Failed to logout" },
      { status: 500 }
    );
  }
}

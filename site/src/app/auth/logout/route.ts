// app/auth/logout/route.ts

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Create a response object
    const response = NextResponse.redirect(process.env.BASE_URL || "", 302);

    // Clear the token cookie by setting it to expire immediately
    response.cookies.set("token", "", { expires: new Date(0) });

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { success: false, message: "Failed to logout" },
      { status: 500 }
    );
  }
}

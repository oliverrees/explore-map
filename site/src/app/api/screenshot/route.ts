// app/api/screenshot/route.ts
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import sharp from "sharp";
import chromium from "@sparticuz/chromium";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();

    // Set the viewport to a 16:9 aspect ratio
    const width = 1200; // Width of the viewport
    const height = 630; // Height of the viewport
    await page.setViewport({ width, height });

    // Go to the URL and wait for the page to load
    await page.goto(url, { waitUntil: "networkidle0" });

    // Wait for the specific element that indicates the page is fully loaded
    await page.waitForSelector(".page-loaded", { timeout: 30000 });

    // Take a screenshot with custom dimensions
    const screenshotBuffer = await page.screenshot({ fullPage: true });

    await browser.close();

    // Use sharp to crop the screenshot
    const croppedBuffer = await sharp(screenshotBuffer)
      .extract({ left: 0, top: 0, width: width, height: height - 20 }) // Crop the last 10 pixels
      .toBuffer();

    // Return the cropped screenshot
    return new NextResponse(croppedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="screenshot.png"',
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to take screenshot" },
      { status: 500 }
    );
  }
}

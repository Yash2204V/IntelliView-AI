import { NextRequest, NextResponse } from "next/server";
const pdfParse = require("pdf-parse");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".pdf")) {
      return NextResponse.json({ error: "Please upload a PDF file" }, { status: 400 });
    }

    // Convert the file to a buffer for pdf-parse
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the PDF
    const data = await pdfParse(buffer);

    // We only need the text, and we truncate it slightly if it's too massive
    // to avoid token limits, but 32k context size can easily handle almost any resume.
    const text = data.text.trim();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error parsing resume form:", error);
    return NextResponse.json(
      { error: "Failed to parse resume. Please ensure it is a valid PDF." },
      { status: 500 }
    );
  }
}

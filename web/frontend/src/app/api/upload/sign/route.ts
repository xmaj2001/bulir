// src/app/api/upload/sign/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { folder } = await req.json();

    const timestamp = Math.round(Date.now() / 1000);
    const uploadPreset = "qcena"; // o teu preset

    // Params que vão ser assinados — têm de ser EXACTAMENTE os mesmos
    // que o client vai enviar no upload
    const paramsToSign = [
      `folder=${folder ?? "qcenas/services"}`,
      `timestamp=${timestamp}`,
      `upload_preset=${uploadPreset}`,
    ]
      .sort()
      .join("&");

    const signature = crypto
      .createHash("sha256")
      .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
      .digest("hex");

    return NextResponse.json({
      signature,
      timestamp,
      uploadPreset,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao gerar assinatura" },
      { status: 500 },
    );
  }
}

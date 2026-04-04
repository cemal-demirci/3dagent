import { NextResponse } from "next/server";
import { applyStudioSettingsPatch } from "@/lib/studio/settings-store";
import { sanitizeStudioSettings } from "@/lib/studio/settings";

export const runtime = "nodejs";

/**
 * POST /api/studio/import
 * JSON dosyasından studio ayarlarını içe aktarır.
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!rawBody.trim()) {
      return NextResponse.json({ error: "Boş dosya." }, { status: 400 });
    }

    const data = JSON.parse(rawBody) as Record<string, unknown>;

    // Support both direct settings and wrapped export format
    const settings = (data?.settings ?? data) as Record<string, unknown>;
    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Geçersiz ayar formatı." }, { status: 400 });
    }

    const result = applyStudioSettingsPatch(settings);
    return NextResponse.json(
      {
        success: true,
        settings: sanitizeStudioSettings(result),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Import failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

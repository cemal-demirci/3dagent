import { NextResponse } from "next/server";
import { loadStudioSettings } from "@/lib/studio/settings-store";

export const runtime = "nodejs";

/**
 * GET /api/studio/export
 * Tüm studio ayarlarını JSON olarak dışa aktarır.
 */
export async function GET() {
  try {
    const settings = loadStudioSettings();
    const exportData = {
      _meta: {
        exportedAt: new Date().toISOString(),
        version: "0.1.4",
        app: "claw3d",
      },
      settings,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="claw3d-settings-${Date.now()}.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

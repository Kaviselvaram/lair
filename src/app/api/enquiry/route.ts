import { NextResponse } from "next/server";

/**
 * Real enquiry endpoint. Validates the payload server-side and acknowledges.
 * (No third-party send here — a production deploy would forward to the
 * concierge CRM. Kept honest: it genuinely receives and validates.)
 */
export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const required = ["from", "to", "when", "pax", "tier", "name", "email"];
  const missing = required.filter((k) => !data[k] || String(data[k]).trim() === "");
  if (missing.length) {
    return NextResponse.json(
      { ok: false, error: `Missing: ${missing.join(", ")}` },
      { status: 422 },
    );
  }

  const email = String(data.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Invalid email" },
      { status: 422 },
    );
  }

  const reference = `LA-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  console.log("[L/Air enquiry]", reference, data);

  return NextResponse.json({ ok: true, reference });
}

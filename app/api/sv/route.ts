import { NextResponse } from "next/server";
import { postWebVisitToDiscord } from "@/lib/discord";
import { cleanURLDomain } from "@/lib/urls";

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json({
      finished: true,
    });
  }

  const {
    location,
    pathname,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_ref,
    isMobile,
  } = await req.json();

  const messageToPost = `
    ${isMobile ? " 📱 " : " 🖥️ "} visita: \`${pathname}\` desde ${
    location.city
  } ${
    location.country_code && location.country_code.length > 0
      ? `:flag_${location.country_code.toString().toLowerCase()}:`
      : ""
  } ${utm_source && utm_source !== "null" ? `source: \`${utm_source}\`` : ""} ${
    utm_medium && utm_medium !== "null" ? `medium: \`${utm_medium}\`` : ""
  } ${
    utm_campaign && utm_campaign !== "null"
      ? `campaign: \`${utm_campaign}\``
      : ""
  } ${
    utm_ref &&
    utm_ref !== "null" &&
    !utm_ref.includes("http://localhost:3000/") &&
    !utm_ref.includes("http://smoluniverse.com/") &&
    !utm_ref.includes("checkout.stripe.com")
      ? `ref: \`${cleanURLDomain(utm_ref)}\``
      : ""
  }`;

  postWebVisitToDiscord(messageToPost);

  await new Promise((resolve) => setTimeout(resolve, 400));

  return NextResponse.json({
    finished: true,
  });
}

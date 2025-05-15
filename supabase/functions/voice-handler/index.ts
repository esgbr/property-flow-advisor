import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

// CORS headers for browser/API access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const MY_PHONE = Deno.env.get("MY_PHONE");
  let goalPhone: string | null = null;

  if (req.method === "POST") {
    // Try as form field (from Twilio or CRM)
    try {
      const formData = await req.formData();
      goalPhone = formData.get("goal_phone") as string | null;
    } catch (_) {}
    // If not present, try JSON body (if CRM sends it this way)
    if (!goalPhone) {
      try {
        const body = await req.json();
        goalPhone = body.goal_phone ?? null;
      } catch (_) {}
    }
  } else {
    const url = new URL(req.url);
    goalPhone = url.searchParams.get("goal_phone");
  }

  const GOAL_PHONE_FALLBACK = Deno.env.get("GOAL_PHONE");
  const GOAL_PHONE = goalPhone || GOAL_PHONE_FALLBACK;

  // Always respond with valid XML and correct headers!
  if (!MY_PHONE || !GOAL_PHONE) {
    // Return valid, but safe TwiML so Twilio doesn’t fallback to music/demo!
    const errorTwiml = `
<Response>
  <Say voice="alice">Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.</Say>
  <Hangup/>
</Response>
    `.trim();

    return new Response(errorTwiml, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/xml",
      },
    });
  }

  // Success: normal TwiML dial, as before
  const twiml = `
<Response>
  <Dial record="record-from-answer-dual" answerOnBridge="true">
    <Number>${MY_PHONE}</Number>
    <Number>${GOAL_PHONE}</Number>
  </Dial>
</Response>
  `.trim();

  return new Response(twiml, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "text/xml",
    },
  });
});

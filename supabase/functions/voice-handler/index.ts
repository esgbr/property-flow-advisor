
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

// CORS headers for browser/API access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const MY_PHONE = Deno.env.get("MY_PHONE");   // your phone must stay a secret

  let goalPhone: string | null = null;

  if (req.method === "POST") {
    // Try as form field (from Twilio or CRM)
    try {
      const formData = await req.formData();
      goalPhone = formData.get("goal_phone") as string | null;
    } catch (e) {
      // fallback to nothing
    }
    // If not present, try JSON body (if CRM sends it this way)
    if (!goalPhone) {
      try {
        const body = await req.json();
        goalPhone = body.goal_phone ?? null;
      } catch (e) {
        // fallback to nothing
      }
    }
  } else {
    // Allow ?goal_phone=... on GET requests (not typical for Twilio, but for custom clients)
    const url = new URL(req.url);
    goalPhone = url.searchParams.get("goal_phone");
  }

  // Fallback to secret if no variable provided
  const GOAL_PHONE_FALLBACK = Deno.env.get("GOAL_PHONE");
  const GOAL_PHONE = goalPhone || GOAL_PHONE_FALLBACK;

  if (!MY_PHONE || !GOAL_PHONE) {
    return new Response("Missing phone configuration", { status: 400, headers: corsHeaders });
  }

  // Respond with TwiML to dial your phone, then the target number, recording the call
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

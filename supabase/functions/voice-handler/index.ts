
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

// CORS headers for browser/API access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Parse incoming Twilio webhook parameters
  const url = new URL(req.url);
  const fromTwilio = req.method === "POST"
    ? await req.formData().then(fd => ({
        CallSid: fd.get("CallSid"),
        From: fd.get("From"),
        To: fd.get("To"),
        // Add more as needed
      }))
    : {};

  // Set your own (YOUR) and goal (TARGET) phone numbers
  // Use E.164 format: e.g. +491729256845
  const MY_PHONE = Deno.env.get("MY_PHONE");   // e.g., your personal phone number
  const GOAL_PHONE = Deno.env.get("GOAL_PHONE"); // e.g., the final call recipient

  if (!MY_PHONE || !GOAL_PHONE) {
    return new Response("Missing phone configuration", { status: 500, headers: corsHeaders });
  }

  // Respond with TwiML to dial YOUR phone first, then the goal number, recording the call
  // This will cause Twilio to dial your phone; after you answer, it bridges to the target and records
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

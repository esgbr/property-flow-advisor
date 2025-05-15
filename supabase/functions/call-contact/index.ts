
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { toPhone } = await req.json();
    if (!toPhone) {
      return new Response(JSON.stringify({ error: "Missing toPhone" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const fromPhone = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (!accountSid || !authToken || !fromPhone) {
      return new Response(JSON.stringify({ error: "Twilio credentials missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const basicAuth = "Basic " + btoa(`${accountSid}:${authToken}`);
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`;

    // For demo, connect to a fixed number and play a message.
    // In real app, you'd set 'url' to point to your own webhook for call flows.
    const twimlUrl = "http://demo.twilio.com/docs/voice.xml";

    const form = new URLSearchParams({
      To: toPhone,
      From: fromPhone,
      Url: twimlUrl,
    });

    const twilioRes = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: basicAuth,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });
    const data = await twilioRes.json();

    if (!twilioRes.ok) {
      console.error("Twilio error", data);
      return new Response(JSON.stringify({ error: data.message || "Twilio API error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ sid: data.sid, status: data.status }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Call initiation failed:", err);
    return new Response(JSON.stringify({ error: "Call failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

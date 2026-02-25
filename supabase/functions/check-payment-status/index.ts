import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BLACKCAT_API_KEY = Deno.env.get("BLACKCAT_API_KEY");
    if (!BLACKCAT_API_KEY) {
      throw new Error("BLACKCAT_API_KEY is not configured");
    }

    const { saleId } = await req.json();

    if (!saleId) {
      return new Response(
        JSON.stringify({ success: false, message: "saleId é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Checking payment status for sale:", saleId);

    const response = await fetch(
      `https://api.blackcatpagamentos.online/api/sales/${saleId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": BLACKCAT_API_KEY,
        },
      }
    );

    const responseText = await response.text();
    console.log("BlackCat status check response:", response.status, responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          message: responseData?.message || "Erro ao verificar status",
          details: responseData,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Check payment error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

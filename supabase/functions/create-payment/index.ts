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

    const body = await req.json();

    // Validate required fields
    if (!body.paymentMethod || !body.items?.length || !body.customer) {
      return new Response(
        JSON.stringify({ success: false, message: "Campos obrigatórios faltando" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build BlackCat API payload
    // Values must be in centavos (cents)
    const payload: Record<string, unknown> = {
      amount: body.amount, // already in centavos from frontend
      currency: "BRL",
      paymentMethod: body.paymentMethod, // "pix" or "credit_card"
      items: body.items.map((item: { title: string; unitPrice: number; quantity: number }) => ({
        title: item.title,
        unitPrice: item.unitPrice, // in centavos
        quantity: item.quantity,
        tangible: true,
      })),
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        phone: body.customer.phone,
        document: {
          number: body.customer.document,
          type: "cpf",
        },
      },
      shipping: {
        name: body.customer.name,
        street: body.shipping.street,
        number: body.shipping.number,
        complement: body.shipping.complement || "",
        neighborhood: body.shipping.neighborhood,
        city: body.shipping.city,
        state: body.shipping.state,
        zipCode: body.shipping.zipCode,
      },
    };

    if (body.postbackUrl) {
      payload.postbackUrl = body.postbackUrl;
    }

    if (body.externalRef) {
      payload.externalRef = body.externalRef;
    }

    if (body.paymentMethod === "pix") {
      payload.pix = { expiresInDays: 1 };
    }

    if (body.paymentMethod === "credit_card" && body.cardData) {
      payload.card = body.cardData;
    }

    console.log("Sending to BlackCat:", JSON.stringify(payload));

    const response = await fetch(
      "https://api.blackcatpagamentos.online/api/sales/create-sale",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": BLACKCAT_API_KEY,
        },
        body: JSON.stringify(payload),
      }
    );

    const responseText = await response.text();
    console.log("BlackCat status:", response.status);
    console.log("BlackCat response:", responseText);

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
          message: responseData?.message || "Erro no gateway de pagamento",
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
    console.error("Payment error:", error);
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

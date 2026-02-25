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
    const BLACKCAT_PUBLIC_KEY = Deno.env.get("BLACKCAT_PUBLIC_KEY");
    const BLACKCAT_SECRET_KEY = Deno.env.get("BLACKCAT_SECRET_KEY");
    console.log("Public key set:", !!BLACKCAT_PUBLIC_KEY, "length:", BLACKCAT_PUBLIC_KEY?.length ?? 0, "prefix:", BLACKCAT_PUBLIC_KEY?.substring(0, 5));
    console.log("Secret key set:", !!BLACKCAT_SECRET_KEY, "length:", BLACKCAT_SECRET_KEY?.length ?? 0, "prefix:", BLACKCAT_SECRET_KEY?.substring(0, 5));

    if (!BLACKCAT_PUBLIC_KEY || !BLACKCAT_SECRET_KEY) {
      throw new Error("BLACKCAT_PUBLIC_KEY or BLACKCAT_SECRET_KEY is not configured");
    }

    const authHeader = "Bearer " + BLACKCAT_SECRET_KEY;

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
          "Authorization": authHeader,
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

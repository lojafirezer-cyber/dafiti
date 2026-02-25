import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHOPIFY_STORE_DOMAIN = "cbzktq-8n.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SHOPIFY_ACCESS_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
    if (!SHOPIFY_ACCESS_TOKEN) {
      throw new Error("SHOPIFY_ACCESS_TOKEN is not configured");
    }

    const body = await req.json();
    const { items, customer, shipping, paymentMethod, discount, shippingCost, orderId } = body;

    if (!items?.length || !customer) {
      return new Response(
        JSON.stringify({ success: false, message: "Campos obrigatórios faltando" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build line items for Shopify Draft Order
    const lineItems = items.map((item: { title: string; quantity: number; price: string; variantId?: string }) => {
      const lineItem: Record<string, unknown> = {
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      };
      // If we have a Shopify variant ID, use it
      if (item.variantId) {
        // Extract numeric ID from GraphQL ID format
        const numericId = item.variantId.replace('gid://shopify/ProductVariant/', '');
        lineItem.variant_id = parseInt(numericId);
      }
      return lineItem;
    });

    // Build draft order payload
    const draftOrder: Record<string, unknown> = {
      line_items: lineItems,
      customer: {
        first_name: customer.name?.split(' ')[0] || '',
        last_name: customer.name?.split(' ').slice(1).join(' ') || '',
        email: customer.email,
        phone: customer.phone,
      },
      shipping_address: {
        first_name: customer.name?.split(' ')[0] || '',
        last_name: customer.name?.split(' ').slice(1).join(' ') || '',
        address1: `${shipping.street}, ${shipping.number}`,
        address2: shipping.complement || '',
        city: shipping.city,
        province: shipping.state,
        zip: shipping.cep,
        country: 'BR',
        phone: customer.phone,
      },
      note: `Pedido ${orderId || ''} - ${paymentMethod || 'N/A'}`,
      tags: `lovable,${paymentMethod || 'custom'}`,
      use_customer_default_address: false,
    };

    // Add shipping line
    if (shippingCost !== undefined) {
      draftOrder.shipping_line = {
        title: shippingCost === 0 ? "Frete Grátis" : "Envio Padrão",
        price: shippingCost.toFixed(2),
        custom: true,
      };
    }

    // Add discount if applicable
    if (discount && discount > 0) {
      draftOrder.applied_discount = {
        description: "Cupom de desconto",
        value_type: "fixed_amount",
        value: discount.toFixed(2),
        title: "DESCONTO",
      };
    }

    console.log("Creating Shopify draft order:", JSON.stringify(draftOrder));

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/draft_orders.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        },
        body: JSON.stringify({ draft_order: draftOrder }),
      }
    );

    const responseText = await response.text();
    console.log("Shopify draft order response:", response.status, responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (!response.ok) {
      console.error("Shopify draft order error:", responseData);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Erro ao criar pedido no Shopify",
          details: responseData,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Complete the draft order (mark as paid)
    const draftOrderId = responseData?.draft_order?.id;
    if (draftOrderId) {
      console.log("Completing draft order:", draftOrderId);
      const completeResponse = await fetch(
        `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/draft_orders/${draftOrderId}/complete.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          },
          body: JSON.stringify({ payment_pending: false }),
        }
      );

      const completeText = await completeResponse.text();
      console.log("Draft order complete response:", completeResponse.status, completeText);

      let completeData;
      try {
        completeData = JSON.parse(completeText);
      } catch {
        completeData = { raw: completeText };
      }

      return new Response(
        JSON.stringify({
          success: true,
          draftOrderId,
          orderId: completeData?.draft_order?.order_id,
          orderName: completeData?.draft_order?.name,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Create Shopify order error:", error);
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

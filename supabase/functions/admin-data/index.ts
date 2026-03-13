import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHOPIFY_STORE_DOMAIN = "cbzktq-8n.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";
const ADMIN_PASSWORD = "direitaraiz2025";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { password, action, params } = body;

    if (password !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ success: false, message: "Senha inválida" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SHOPIFY_ACCESS_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
    if (!SHOPIFY_ACCESS_TOKEN) {
      throw new Error("SHOPIFY_ACCESS_TOKEN is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let result: unknown;

    switch (action) {
      case "orders": {
        const limit = params?.limit || 50;
        const status = params?.status || "any";
        const res = await fetch(
          `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/orders.json?limit=${limit}&status=${status}&order=created_at+desc`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
            },
          }
        );
        const data = await res.json();
        result = data.orders || [];
        break;
      }

      case "customers": {
        const limit = params?.limit || 50;
        const res = await fetch(
          `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/customers.json?limit=${limit}&order=created_at+desc`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
            },
          }
        );
        const data = await res.json();
        result = data.customers || [];
        break;
      }

      case "products": {
        const limit = params?.limit || 50;
        const res = await fetch(
          `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/products.json?limit=${limit}`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
            },
          }
        );
        const data = await res.json();
        result = data.products || [];
        break;
      }

      case "analytics": {
        const days = params?.days || 30;
        const since = new Date();
        since.setDate(since.getDate() - days);

        // Total views
        const { data: views, error: viewsError } = await supabase
          .from("page_views")
          .select("*")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: false });

        if (viewsError) throw viewsError;

        // Unique visitors
        const uniqueVisitors = new Set((views || []).map((v: any) => v.visitor_id)).size;

        // Views per page
        const pageStats: Record<string, number> = {};
        (views || []).forEach((v: any) => {
          pageStats[v.page_path] = (pageStats[v.page_path] || 0) + 1;
        });

        // Views per day
        const dailyStats: Record<string, number> = {};
        (views || []).forEach((v: any) => {
          const day = v.created_at.split("T")[0];
          dailyStats[day] = (dailyStats[day] || 0) + 1;
        });

        result = {
          totalViews: (views || []).length,
          uniqueVisitors,
          pageStats: Object.entries(pageStats)
            .map(([path, count]) => ({ path, count }))
            .sort((a, b) => b.count - a.count),
          dailyStats: Object.entries(dailyStats)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date)),
        };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ success: false, message: "Ação inválida" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Admin data error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

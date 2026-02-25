import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SHOPIFY_STORE_DOMAIN = "cbzktq-8n.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "1afa6acaf9311b3ac89f0dd271b8ce6e";
const SITE_URL = "https://loja.direitaraiz.com";

const PRODUCTS_QUERY = `
  query GetAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          description
          handle
          tags
          vendor
          productType
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

async function fetchAllProducts() {
  const allProducts: any[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const variables: any = { first: 50 };
    if (cursor) variables.after = cursor;

    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query: PRODUCTS_QUERY, variables }),
    });

    if (!response.ok) throw new Error(`Shopify API error: ${response.status}`);
    const data = await response.json();
    if (data.errors) throw new Error(data.errors.map((e: any) => e.message).join(", "));

    const products = data.data.products;
    allProducts.push(...products.edges);
    hasNextPage = products.pageInfo.hasNextPage;
    cursor = products.pageInfo.endCursor;
  }

  return allProducts;
}

function escapeCSV(value: string): string {
  if (!value) return "";
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function getGender(tags: string[]): string {
  const upper = tags.map(t => t.toUpperCase());
  if (upper.some(t => t.includes("INFANTIL") || t.includes("KIDS") || t.includes("BABY"))) return "unisex";
  if (upper.some(t => t.includes("FEMININO") || t.includes("FEMALE"))) return "female";
  if (upper.some(t => t.includes("MASCULINO") || t.includes("MALE"))) return "male";
  return "unisex";
}

function getAgeGroup(tags: string[]): string {
  const upper = tags.map(t => t.toUpperCase());
  if (upper.some(t => t.includes("INFANTIL") || t.includes("KIDS") || t.includes("BABY"))) return "kids";
  return "adult";
}

function formatPrice(amount: string, currency: string): string {
  return `${parseFloat(amount).toFixed(2)} ${currency}`;
}

serve(async (req) => {
  // Allow CORS for any origin
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  try {
    const products = await fetchAllProducts();
    
    const headers = [
      "id", "title", "description", "availability", "condition", "price",
      "link", "image_link", "gtin", "mpn", "brand", "mobile_link",
      "additional_image_link", "google_product_category", "product_type",
      "inventory", "sale_price", "sale_price_effective_date", "gender",
      "color", "size", "age_group", "item_group_id",
      "custom_label_0", "custom_label_1", "custom_label_2", "custom_label_3", "custom_label_4"
    ];

    const rows: string[] = [headers.join(",")];

    for (const { node: product } of products) {
      const tags = product.tags || [];
      const images = product.images.edges.map((e: any) => e.node.url);
      const mainImage = images[0] || "";
      const additionalImages = images.slice(1, 11).join(",");
      const gender = getGender(tags);
      const ageGroup = getAgeGroup(tags);
      const isInfantil = tags.some((t: string) => t.toUpperCase().includes("INFANTIL") || t.toUpperCase().includes("KIDS"));
      const productLink = `${SITE_URL}/produto/${product.handle}`;

      // FILTER: Only Nação Raiz products (exclude infantil/kids)
      if (isInfantil) continue;

      // Find color option
      const colorOption = product.options?.find((o: any) => o.name.toLowerCase() === "cor" || o.name.toLowerCase() === "color");

      // Pick ONE variant per product: prefer "Clássica/Clássico" style, otherwise first available
      const allVariants = product.variants.edges.map((e: any) => e.node);
      let chosenVariant = allVariants.find((v: any) =>
        v.selectedOptions?.some((o: any) =>
          o.name.toLowerCase() === "estilo" && (o.value.toLowerCase().includes("clássic") || o.value.toLowerCase().includes("classic"))
        ) && v.availableForSale
      );
      if (!chosenVariant) {
        chosenVariant = allVariants.find((v: any) =>
          v.selectedOptions?.some((o: any) =>
            o.name.toLowerCase() === "estilo" && (o.value.toLowerCase().includes("clássic") || o.value.toLowerCase().includes("classic"))
          )
        );
      }
      if (!chosenVariant) {
        chosenVariant = allVariants.find((v: any) => v.availableForSale) || allVariants[0];
      }
      if (!chosenVariant) continue;

      const variant = chosenVariant;
      const variantId = variant.id.replace("gid://shopify/ProductVariant/", "");
      const availability = variant.availableForSale ? "in stock" : "out of stock";
      const price = formatPrice(variant.price.amount, variant.price.currencyCode);
      const salePrice = "";

      const sizeOption = variant.selectedOptions?.find((o: any) =>
        o.name.toLowerCase() === "tamanho" || o.name.toLowerCase() === "size"
      );
      const size = sizeOption?.value || "";

      const colorVariantOption = variant.selectedOptions?.find((o: any) =>
        o.name.toLowerCase() === "cor" || o.name.toLowerCase() === "color"
      );
      const color = colorVariantOption?.value || (colorOption?.values?.[0] || "");

      const row = [
        escapeCSV(variantId),
        escapeCSV(product.title + (variant.title !== "Default Title" ? ` - ${variant.title}` : "")),
        escapeCSV(product.description?.substring(0, 5000) || ""),
        availability,
        "new",
        price,
        escapeCSV(productLink),
        escapeCSV(mainImage),
        "",
        escapeCSV(variantId),
        escapeCSV(product.vendor || "Direita Raiz"),
        escapeCSV(productLink),
        escapeCSV(additionalImages),
        "Apparel & Accessories > Clothing",
        escapeCSV(product.productType || "Clothing"),
        "",
        salePrice,
        "",
        gender,
        escapeCSV(color),
        escapeCSV(size),
        ageGroup,
        escapeCSV(product.handle),
        "adult",
        escapeCSV(product.productType || ""),
        "",
        "",
        "",
      ];

      rows.push(row.join(","));
    }

    const csv = rows.join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "inline; filename=x-product-feed.csv",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=1800",
      },
    });
  } catch (error) {
    console.error("Error generating feed:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});

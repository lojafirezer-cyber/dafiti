import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ShopifyAnalytics from "./components/ShopifyAnalytics";
import { PageTransition } from "./components/PageTransition";
import { useCartSync } from "./hooks/useCartSync";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import TermsOfUse from "./pages/TermsOfUse";
import FAQ from "./pages/FAQ";
import ExchangesReturns from "./pages/ExchangesReturns";
import Collection from "./pages/Collection";
import NacaoKids from "./pages/NacaoKids";
import DireitaRaiz from "./pages/DireitaRaiz";
import Products from "./pages/Products";
import Tracking from "./pages/Tracking";
import Checkout from "./pages/Checkout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Shopify from "./pages/Shopify";
import ThankYou from "./pages/ThankYou";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  useCartSync();

  // TEMPORARY: Fire test events to activate Twitter pixel
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((window as any).twq) {
        (window as any).twq('event', 'tw-r4hhy-r4hi2', {
          value: 0.01, currency: 'BRL', num_items: 1, conversion_id: 'test-activate-atc',
        });
        (window as any).twq('event', 'tw-r4hhy-r4hhz', {
          value: 0.01, currency: 'BRL', num_items: 1, conversion_id: 'test-activate-purchase',
        });
        console.log('[Twitter Pixel] Test events fired to activate pixel');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <ScrollToTop />
      <ShopifyAnalytics />
      <PageTransition />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/produto/:handle" element={<ProductDetail />} />
        <Route path="/privacidade" element={<PrivacyPolicy />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/termos" element={<TermsOfUse />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/trocas" element={<ExchangesReturns />} />
        <Route path="/colecao" element={<Collection />} />
        <Route path="/colecao/nacao-kids" element={<NacaoKids />} />
        <Route path="/colecao/direita-raiz" element={<DireitaRaiz />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/rastreio" element={<Tracking />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/shopify" element={<Shopify />} />
        <Route path="/obrigado" element={<ThankYou />} />
        <Route path="/admin" element={<Admin />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

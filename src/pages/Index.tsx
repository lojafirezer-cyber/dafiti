import { useState } from 'react';
import { Header } from '@/components/store/Header';
import { HeroBanner } from '@/components/store/HeroBanner';
import { PromoAlert } from '@/components/store/PromoAlert';
import { CollectionLinks } from '@/components/store/CollectionLinks';
import { HomeProductGrid } from '@/components/store/HomeProductGrid';
import { Footer } from '@/components/store/Footer';
import { PromoBanner } from '@/components/store/PromoBanner';

// Promo end date - 4 days from now
const promoEndDate = new Date();
promoEndDate.setDate(promoEndDate.getDate() + 4);

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <PromoAlert 
        message="FRETE GRÁTIS A PARTIR DE 2 PEÇAS" 
        endDate={promoEndDate}
      />
      
      <main>
        <PromoBanner position="top" link="/produtos" />
        <HomeProductGrid collectionFilter="nacao-raiz" sectionTitle="Mais Vendidos" />
        <PromoBanner position="bottom" link="/produtos" />
      </main>

      <Footer />
    </div>
  );
}

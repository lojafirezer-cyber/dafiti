import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, ChevronDown, CreditCard, Package, Truck, MapPin } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { CartDrawer } from './CartDrawer';
import { Logo } from './Logo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const categories = [
  { name: 'Camiseta', href: '/produtos?type=camiseta' },
  { name: 'Camiseta Infantil', href: '/produtos?type=infantil' },
  { name: 'Hoodie Moletom', href: '/produtos?type=hoodie' },
  { name: 'Body Infantil', href: '/produtos?type=body' },
];

const collections = [
  { name: 'Nação Kids', href: '/colecao/nacao-kids' },
  { name: 'Direita Raiz', href: '/colecao/direita-raiz' },
];

const benefitsMessages = [
  { icon: CreditCard, text: 'Parcele em até 3x sem juros' },
  { icon: Package, text: 'Primeira troca sem custo' },
  { icon: Truck, text: 'Frete grátis a partir de 2 peças' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBenefitIndex, setCurrentBenefitIndex] = useState(0);
  const [cepDialogOpen, setCepDialogOpen] = useState(false);
  const [cepInput, setCepInput] = useState('');
  const [orderLoginOpen, setOrderLoginOpen] = useState(false);
  const [cpfInput, setCpfInput] = useState('');
  const [orderCodeInput, setOrderCodeInput] = useState('');
  const [savedCity, setSavedCity] = useState<string | null>(() => {
    return localStorage.getItem('headerCity');
  });
  const { setOpen: setCartOpen } = useCartStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produtos?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
  };

  const handleOrderLogin = () => {
    const cleanCpf = cpfInput.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      toast.error('CPF inválido');
      return;
    }
    if (!orderCodeInput.trim()) {
      toast.error('Insira o código do pedido');
      return;
    }
    setOrderLoginOpen(false);
    navigate(`/rastreio?cpf=${encodeURIComponent(cleanCpf)}&pedido=${encodeURIComponent(orderCodeInput.trim())}`);
    setCpfInput('');
    setOrderCodeInput('');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBenefitIndex((prev) => (prev + 1) % benefitsMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCepSubmit = async () => {
    if (cepInput.length !== 8) {
      toast.error('CEP inválido');
      return;
    }
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepInput}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }
      
      const cityName = data.localidade;
      setSavedCity(cityName);
      localStorage.setItem('headerCity', cityName);
      localStorage.setItem('headerCep', cepInput);
      setCepDialogOpen(false);
      setCepInput('');
      toast.success('Localização salva!');
    } catch {
      toast.error('Erro ao buscar CEP');
    }
  };

  const CurrentIcon = benefitsMessages[currentBenefitIndex].icon;

  return (
    <>
      <header className="bg-background text-foreground border-b border-border">
        {/* Benefits Bar */}
        <div className="bg-foreground text-background py-2 px-4 text-sm overflow-hidden h-10 w-full">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full h-full">
            {/* CEP Selector - Left */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setCepDialogOpen(true)}
                className="flex items-center gap-1.5 text-xs font-medium hover:opacity-75 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                {savedCity ? (
                  <span className="flex items-center gap-1">
                    <span className="opacity-70">Enviar para</span>
                    <span className="font-semibold truncate max-w-[100px]">{savedCity}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <span className="opacity-70">Informe seu</span>
                    <span className="font-semibold">CEP</span>
                  </span>
                )}
              </button>
            </div>

            {/* Benefits Message - Center */}
            <span 
              key={currentBenefitIndex}
              className="flex items-center gap-2 text-xs md:text-sm font-medium animate-fade-in mx-auto md:mx-0"
            >
              <CurrentIcon className="w-4 h-4" />
              {benefitsMessages[currentBenefitIndex].text}
            </span>

            {/* Track Order - Right */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-medium">
              <Truck className="w-3.5 h-3.5" />
              <Link to="/rastreio" className="hover:text-neutral-300 transition-colors font-bold">
                Rastrear Pedido
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="bg-background border-b border-border px-4 md:px-10 py-4 md:py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
            {/* Mobile Left Actions */}
            <div className="lg:hidden flex items-center gap-2">
              <button 
                className="p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              {/* Mobile Search Button - Left */}
              <button 
                className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Pesquisar"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop Navigation - Left */}
            <div className="hidden lg:flex items-center gap-6 flex-1">
              <Link to="/" className="text-sm font-bold uppercase hover:text-accent transition-colors tracking-wide">
                Loja
              </Link>
              
              {/* Produtos Dropdown - Hover */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-bold uppercase hover:text-accent transition-colors tracking-wide">
                  Produtos
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-background border border-border rounded-sm py-1 min-w-[180px] shadow-lg">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.href}
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Categorias Dropdown - Hover */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-bold uppercase hover:text-accent transition-colors tracking-wide">
                  Categorias
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-background border border-border rounded-sm py-1 min-w-[180px] shadow-lg">
                    {collections.map((collection) => (
                      <Link
                        key={collection.name}
                        to={collection.href}
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        {collection.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link to="/sobre" className="text-sm font-bold uppercase hover:text-accent transition-colors tracking-wide">
                Sobre
              </Link>
            </div>

            {/* Logo - Center */}
            <Link to="/" className="navbar-brand absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:mx-auto">
              <Logo className="h-10 md:h-12 w-auto" />
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              {/* Desktop Search Button */}
              <button 
                className="hidden lg:block p-2 hover:bg-muted rounded-full transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Pesquisar"
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setOrderLoginOpen(true)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Acompanhar pedido"
              >
                <User className="w-5 h-5" />
              </button>

              <button 
                className="p-2 hover:bg-muted rounded-full transition-colors relative"
                onClick={() => setCartOpen(true)}
                aria-label="Carrinho"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <form onSubmit={handleSearch} className="mt-4 max-w-md mx-auto animate-fade-in">
              <input
                type="search"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-muted border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                autoFocus
              />
            </form>
          )}
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-b border-border animate-slide-in">
            <div className="px-4 py-6 space-y-4">
              <Link to="/" className="block text-base font-bold uppercase tracking-wide" onClick={() => setMobileMenuOpen(false)}>
                Loja
              </Link>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Produtos</p>
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.href}
                    className="block pl-4 text-base"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Categorias</p>
                {collections.map((collection) => (
                  <Link
                    key={collection.name}
                    to={collection.href}
                    className="block pl-4 text-base"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {collection.name}
                  </Link>
                ))}
              </div>
              <Link to="/sobre" className="block text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
                Sobre
              </Link>
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <button 
                  className="flex items-center gap-3 text-sm" 
                  onClick={() => { setMobileMenuOpen(false); setOrderLoginOpen(true); }}
                >
                  <User className="w-5 h-5" />
                  Acompanhar Pedido
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Order Login Dialog */}
      <Dialog open={orderLoginOpen} onOpenChange={setOrderLoginOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Acompanhar Pedido</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Insira seus dados para ver as atualizações do seu pedido.
          </p>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">CPF</label>
              <Input
                type="text"
                placeholder="000.000.000-00"
                value={cpfInput}
                onChange={(e) => setCpfInput(formatCpf(e.target.value))}
                onKeyDown={(e) => e.key === 'Enter' && handleOrderLogin()}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Código do Pedido</label>
              <Input
                type="text"
                placeholder="Ex: #12345"
                value={orderCodeInput}
                onChange={(e) => setOrderCodeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleOrderLogin()}
              />
            </div>
            <Button 
              onClick={handleOrderLogin}
              className="w-full bg-black hover:bg-neutral-800 text-white h-11"
            >
              Entrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CEP Dialog */}
      <Dialog open={cepDialogOpen} onOpenChange={setCepDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Selecione onde quer receber suas compras</DialogTitle>
          </DialogHeader>
          
          <p className="text-gray-500 text-sm">
            Você poderá ver custos e prazos de entrega precisos em tudo que procurar.
          </p>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">CEP</label>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Informar um CEP"
                  value={cepInput}
                  onChange={(e) => setCepInput(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  onKeyDown={(e) => e.key === 'Enter' && handleCepSubmit()}
                  className="pr-20"
                />
                <Button 
                  onClick={handleCepSubmit}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-4 text-white"
                  style={{ backgroundColor: '#50B150' }}
                >
                  Usar
                </Button>
              </div>
              <a 
                href="https://buscacepinter.correios.com.br/app/endereco/index.php" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline text-sm whitespace-nowrap"
                style={{ color: '#50B150' }}
              >
                Não sei o meu CEP
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CartDrawer />
    </>
  );
}

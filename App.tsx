import React, { useState, useEffect, useRef } from 'react';
import { Product, View, HeroContent, InfoCard, BrandReview, PlatformRating } from './types';
import { QuoteProvider } from './context/CartContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { DataProvider, useData } from './context/DataContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import Button from './components/Button';
import ProductPage from './components/ProductPage';
import QuoteModal from './components/Cart';
import CataloguePage from './components/CataloguePage';
import AboutPage from './components/AboutPage';
import FaqPage from './components/FaqPage';
import ContactPage from './components/ContactPage';
import Toast from './components/Toast';
import SearchModal from './components/SearchModal';
import PartnersPage from './components/PartnersPage';
import AdminDashboard from './components/AdminDashboard';
import PasswordModal from './components/PasswordModal';
import ServicesPage from './components/ServicesPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import ReturnPolicyPage from './components/ReturnPolicyPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import FabricsPage from './components/FabricsPage';
import SubscriptionModal from './components/SubscriptionModal';
import InfoCards from './components/InfoCards';
import FeaturedVideo from './components/FeaturedVideo';
import SplashScreen from './components/SplashScreen';
import BrandReviews from './components/BrandReviews';
import FeaturedPartners from './components/FeaturedPartners';
import HowItWorks from './components/HowItWorks';
import CustomizationShowcase from './components/CustomizationShowcase';
import CallToAction from './components/CallToAction';
import AthletesPage from './components/AthletesPage';
import CommunityPage from './components/CommunityPage';
import WhyChooseUs from './components/WhyChooseUs';
import HowWeWorkPage from './components/HowWeWorkPage';
import AiAdvisor from './components/AiAdvisor';
import { MockupGeneratorPage } from './components/MockupGeneratorPage';
import { useOnScreen } from './useOnScreen';

const AppContent: React.FC = () => {
    const [view, setView] = useState<View>('home');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [catalogueFilter, setCatalogueFilter] = useState<{ type: 'group' | 'category' | 'gender'; value: string } | null>(null);
    const [toastMessage, setToastMessage] = useState('');
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [isSplashVisible, setIsSplashVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const { isAuthenticated, login } = useAdmin();
    const { 
        products: allProducts, collections, faqs: faqData, materials, 
        heroContents, infoCards, featuredVideoContent, brandReviews, platformRatings, partners, athletes, communityPosts,
        isLoading: isDataLoading 
    } = useData();
    
    const viewCatalogueButtonRef = useRef<HTMLDivElement>(null);
    useOnScreen(viewCatalogueButtonRef, '0px 0px -100px 0px');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        const checkHash = () => {
            if (window.location.hash === '#admin') {
                if (!isAuthenticated) setIsPasswordModalOpen(true);
                else setView('admin');
            }
        };
        checkHash();
        window.addEventListener('hashchange', checkHash);
        const splashTimer = setTimeout(() => setIsAppLoading(false), 1500);
        const visibilityTimer = setTimeout(() => setIsSplashVisible(false), 3000);
        const subscriptionTimer = setTimeout(() => {
            if (!localStorage.getItem('subscriptionModalDismissed')) setIsSubscriptionModalOpen(true);
        }, 8000);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('hashchange', checkHash);
            clearTimeout(splashTimer);
            clearTimeout(visibilityTimer);
            clearTimeout(subscriptionTimer);
        };
    }, [isAuthenticated]);

    const handleNavigate = (page: View, value: string | null = null) => {
        if (page === 'catalogue' && value) {
            const isGroup = collections.includes(value);
            const isGender = ['Men', 'Women', 'Unisex'].includes(value);
            if (isGroup) setCatalogueFilter({ type: 'group', value });
            else if (isGender) setCatalogueFilter({ type: 'gender', value });
            else setCatalogueFilter({ type: 'category', value });
        } else setCatalogueFilter(null);
        if (page === 'product' && value) {
            const product = allProducts.find(p => p.id === value);
            setSelectedProduct(product || null);
        }
        setView(page);
        window.scrollTo(0, 0);
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setView('product');
        window.scrollTo(0, 0);
    };

    const handlePasswordSubmit = async (password: string, username: string) => {
        const success = await login(username, password);
        if (success) {
            setIsPasswordModalOpen(false);
            setView('admin');
        } else {
            setToastMessage("Invalid credentials.");
        }
    };

    const handleCardClick = (card: InfoCard) => {
        if (card.linkType === 'page') handleNavigate(card.linkValue as View);
        else if (card.linkType === 'modal') {
            if (card.linkValue === 'subscribe') setIsSubscriptionModalOpen(true);
            if (card.linkValue === 'search') setIsSearchModalOpen(true);
        } else if (card.linkType === 'external') window.open(card.linkValue, '_blank', 'noopener,noreferrer');
    };

    const renderView = () => {
        if (view === 'admin' && !isAuthenticated) {
            setIsPasswordModalOpen(true);
            return renderHomePage();
        }
        switch (view) {
            case 'home': return renderHomePage();
            case 'product': return selectedProduct ? <ProductPage product={selectedProduct} onNavigate={handleNavigate} showToast={setToastMessage} materials={materials} allProducts={allProducts} onProductClick={handleProductClick} /> : <div className="text-center py-20">Product not found.</div>;
            case 'catalogue': return <CataloguePage products={allProducts} onProductClick={handleProductClick} initialFilter={catalogueFilter} />;
            case 'about': return <AboutPage onNavigate={handleNavigate} />;
            case 'partners': return <PartnersPage onNavigate={handleNavigate} />;
            case 'contact': return <ContactPage showToast={setToastMessage} />;
            case 'faq': return <FaqPage faqData={faqData} />;
            case 'admin': return isAuthenticated ? <AdminDashboard /> : renderHomePage();
            case 'services': return <ServicesPage onNavigate={handleNavigate} />;
            case 'terms-of-service': return <TermsOfServicePage />;
            case 'return-policy': return <ReturnPolicyPage />;
            case 'privacy-policy': return <PrivacyPolicyPage />;
            case 'materials': return <FabricsPage />;
            case 'athletes': return <AthletesPage />;
            case 'community': return <CommunityPage onNavigate={handleNavigate} />;
            case 'how-we-work': return <HowWeWorkPage />;
            case 'mockup-generator': return <MockupGeneratorPage />;
            default: return <div className="text-center py-20">Page not found</div>;
        }
    };

    const renderHomePage = () => {
        const homeHero = heroContents.find(h => h.displayOrder === 0);
        const secondaryHeroes = heroContents.filter(h => h.displayOrder > 0).sort((a, b) => a.displayOrder - b.displayOrder);
        const homeFeaturedProducts = homeHero?.featuredProductIds?.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as Product[] || [];
        return (
            <>
                {homeHero && <Hero {...homeHero} onNavigate={handleNavigate} isFirst={true} />}
                {homeFeaturedProducts.length > 0 && (
                     <div className="bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center mb-8">{homeHero?.featuredProductsTitle || 'Featured Products'}</h2>
                            <ProductGrid products={homeFeaturedProducts} onProductClick={handleProductClick} />
                        </div>
                    </div>
                )}
                <InfoCards cards={infoCards} onCardClick={handleCardClick} />
                <WhyChooseUs />
                {secondaryHeroes.map((hero) => (
                    <Hero key={hero.id} {...hero} onNavigate={handleNavigate} isFirst={false} />
                ))}
                <HowItWorks />
                {featuredVideoContent?.isVisible && <FeaturedVideo {...featuredVideoContent} />}
                <CustomizationShowcase />
                <BrandReviews brandReviews={brandReviews} platformRatings={platformRatings} />
                <FeaturedPartners partners={partners} />
                <CallToAction onNavigate={handleNavigate} />
            </>
        );
    };

    return (
        <div className="font-sans">
            {isSplashVisible && <SplashScreen isFadingOut={!isAppLoading && !isDataLoading} />}
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
            <Header onNavigate={handleNavigate} onQuoteClick={() => setIsQuoteModalOpen(true)} onSearchClick={() => setIsSearchModalOpen(true)} onSubscribeClick={() => setIsSubscriptionModalOpen(true)} view={view} catalogueFilter={catalogueFilter} isScrolled={isScrolled} />
            <main className={`transition-opacity duration-500 ${isAppLoading || isDataLoading ? 'opacity-0' : 'opacity-100'} pt-14`}>
                {renderView()}
            </main>
            <Footer onNavigate={handleNavigate} />
            <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} showToast={setToastMessage} />
            <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} products={allProducts} onProductClick={(product) => { handleProductClick(product); setIsSearchModalOpen(false); }} onNavigate={(page, value) => { handleNavigate(page, value); setIsSearchModalOpen(false); }} collections={collections} faqs={faqData} materials={materials} />
            <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} onSubmit={handlePasswordSubmit} />
            <SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={() => setIsSubscriptionModalOpen(false)} showToast={setToastMessage} />
            <AiAdvisor allProducts={allProducts} />
        </div>
    );
};

const App: React.FC = () => (
    <DataProvider>
        <AdminProvider>
            <QuoteProvider>
                <AppContent />
            </QuoteProvider>
        </AdminProvider>
    </DataProvider>
);

export default App;
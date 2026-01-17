
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Product, HeroContent, InfoCard, BrandReview, PlatformRating, View } from './types';
import { QuoteProvider } from './context/CartContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { DataProvider, useData } from './context/DataContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
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

// Helper to convert a string to a URL-friendly slug
const toSlug = (str: string) => str.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

const NotFoundPage: React.FC = () => <div className="text-center py-20">Page not found</div>;

const HomePage: React.FC<{
    heroContents: HeroContent[];
    allProducts: Product[];
    infoCards: InfoCard[];
    featuredVideoContent: any;
    brandReviews: BrandReview[];
    platformRatings: PlatformRating[];
    partners: any[];
    onNavigate: (path: string) => void;
    onProductClick: (product: Product) => void;
    onCardClick: (card: InfoCard) => void;
}> = ({ heroContents, allProducts, infoCards, featuredVideoContent, brandReviews, platformRatings, partners, onNavigate, onProductClick, onCardClick }) => {
    const homeHero = heroContents.find(h => h.displayOrder === 0);
    const secondaryHeroes = heroContents.filter(h => h.displayOrder > 0).sort((a, b) => a.displayOrder - b.displayOrder);
    const homeFeaturedProducts = homeHero?.featuredProductIds?.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as Product[] || [];

    return (
        <>
            {homeHero && <Hero {...homeHero} onNavigate={onNavigate} isFirst={true} />}
            {homeFeaturedProducts.length > 0 && (
                 <div className="bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center mb-8">{homeHero?.featuredProductsTitle || 'Featured Products'}</h2>
                        <ProductGrid products={homeFeaturedProducts} onProductClick={onProductClick} />
                    </div>
                </div>
            )}
            <InfoCards cards={infoCards} onCardClick={onCardClick} />
            <WhyChooseUs />
            {secondaryHeroes.map((hero) => (
                <Hero key={hero.id} {...hero} onNavigate={onNavigate} isFirst={false} />
            ))}
            <HowItWorks />
            {featuredVideoContent?.isVisible && <FeaturedVideo {...featuredVideoContent} />}
            <CustomizationShowcase />
            <BrandReviews brandReviews={brandReviews} platformRatings={platformRatings} />
            <FeaturedPartners partners={partners} />
            <CallToAction onNavigate={onNavigate} />
        </>
    );
};

const AppContent: React.FC = () => {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [isSplashVisible, setIsSplashVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, login } = useAdmin();
    const { 
        products: allProducts, collections, faqs: faqData, materials, 
        heroContents, infoCards, featuredVideoContent, brandReviews, platformRatings, partners
    } = useData();
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        
        const splashTimer = setTimeout(() => setIsAppLoading(false), 1500);
        const visibilityTimer = setTimeout(() => setIsSplashVisible(false), 3000);
        const subscriptionTimer = setTimeout(() => {
            if (!localStorage.getItem('subscriptionModalDismissed')) {
                setIsSubscriptionModalOpen(true);
            }
        }, 8000);

        if (location.hash === '#admin' && !isAuthenticated) {
            setIsPasswordModalOpen(true);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(splashTimer);
            clearTimeout(visibilityTimer);
            clearTimeout(subscriptionTimer);
        };
    }, [isAuthenticated, location.hash]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const handleNavigate = (pageOrPath: View | string, filterValue?: string | null) => {
        if (pageOrPath === 'home') {
            navigate('/');
            return;
        }

        if (pageOrPath === 'catalogue' || pageOrPath === 'all-products') {
            if (filterValue) {
                const isCollection = collections.includes(filterValue);
                if (isCollection) {
                    navigate(`/${toSlug(filterValue)}`);
                } else {
                    const isGender = ['Men', 'Women', 'Unisex'].includes(filterValue);
                    const type = isGender ? 'gender' : 'category';
                    navigate(`/all-products?type=${type}&value=${encodeURIComponent(filterValue)}`);
                }
            } else {
                navigate('/all-products');
            }
        } else {
             // Handles simple paths like '/about', '/contact', etc.
            navigate(pageOrPath.startsWith('/') ? pageOrPath : `/${pageOrPath}`);
        }
    };

    const handleProductClick = (product: Product) => {
        if (product && product.categoryGroup && product.id) {
            const groupSlug = toSlug(product.categoryGroup);
            navigate(`/${groupSlug}/${product.id}`);
        }
    };

    const handlePasswordSubmit = async (password: string, username: string) => {
        const success = await login(username, password);
        if (success) {
            setIsPasswordModalOpen(false);
            navigate('/admin');
        } else {
            setToastMessage("Invalid credentials.");
        }
    };
    
    const handleCardClick = (card: InfoCard) => {
        if (card.linkType === 'page') {
            handleNavigate(card.linkValue);
        } else if (card.linkType === 'modal') {
            if (card.linkValue === 'subscribe') setIsSubscriptionModalOpen(true);
            if (card.linkValue === 'search') setIsSearchModalOpen(true);
        } else if (card.linkType === 'external') {
            window.open(card.linkValue, '_blank', 'noopener,noreferrer');
        }
    };

    const handleSubscriptionClose = () => {
        setIsSubscriptionModalOpen(false);
        localStorage.setItem('subscriptionModalDismissed', 'true');
    };

    const ProductPageRoute: React.FC = () => {
        const { collection: collectionSlug, productId } = useParams<{ collection: string; productId: string }>();
        const selectedProduct = allProducts.find(p => p.id === productId);
        return selectedProduct ? <ProductPage product={selectedProduct} onNavigate={(path) => handleNavigate(path)} showToast={setToastMessage} materials={materials} allProducts={allProducts} onProductClick={handleProductClick} /> : <div className="text-center py-20">Product not found.</div>;
    };

    const CataloguePageRoute: React.FC = () => {
        const { collection: collectionSlug } = useParams<{ collection?: string }>();
        const { search } = useLocation();
        const params = new URLSearchParams(search);

        let initialFilter: { type: 'group' | 'category' | 'gender'; value: string } | null = null;
    
        if (collectionSlug) {
            const collectionName = collections.find(c => toSlug(c) === collectionSlug);
            if (collectionName) {
                initialFilter = { type: 'group', value: collectionName };
            }
        } else {
            const type = params.get('type') as 'group' | 'category' | 'gender' | null;
            const value = params.get('value');
            if (type && value) {
                initialFilter = { type, value };
            }
        }

        return <CataloguePage products={allProducts} onProductClick={handleProductClick} initialFilter={initialFilter} />;
    };
    
    const mainContentClass = `transition-opacity duration-500 ${isAppLoading ? 'opacity-0' : 'opacity-100'} ${location.pathname !== '/' ? 'pt-14' : ''}`;
    
    return (
        <div className="font-sans">
            {isSplashVisible && <SplashScreen isFadingOut={!isAppLoading} />}
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
            <Header onNavigate={handleNavigate} onQuoteClick={() => setIsQuoteModalOpen(true)} onSearchClick={() => setIsSearchModalOpen(true)} onSubscribeClick={() => setIsSubscriptionModalOpen(true)} isScrolled={isScrolled || location.pathname !== '/'} />
            <main className={mainContentClass}>
                <Routes>
                    <Route path="/" element={<HomePage heroContents={heroContents} allProducts={allProducts} infoCards={infoCards} featuredVideoContent={featuredVideoContent} brandReviews={brandReviews} platformRatings={platformRatings} partners={partners} onNavigate={(path) => handleNavigate(path)} onProductClick={handleProductClick} onCardClick={handleCardClick} />} />
                    <Route path="/all-products" element={<CataloguePageRoute />} />
                    <Route path="/:collection" element={<CataloguePageRoute />} />
                    <Route path="/:collection/:productId" element={<ProductPageRoute />} />
                    <Route path="/about" element={<AboutPage onNavigate={(path) => handleNavigate(path)} />} />
                    <Route path="/partners" element={<PartnersPage onNavigate={(path) => handleNavigate(path)} />} />
                    <Route path="/contact" element={<ContactPage showToast={setToastMessage} />} />
                    <Route path="/faq" element={<FaqPage faqData={faqData} />} />
                    <Route path="/admin" element={isAuthenticated ? <AdminDashboard /> : <HomePage heroContents={heroContents} allProducts={allProducts} infoCards={infoCards} featuredVideoContent={featuredVideoContent} brandReviews={brandReviews} platformRatings={platformRatings} partners={partners} onNavigate={(path) => handleNavigate(path)} onProductClick={handleProductClick} onCardClick={handleCardClick} />} />
                    <Route path="/services" element={<ServicesPage onNavigate={(path) => handleNavigate(path)} />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="/return-policy" element={<ReturnPolicyPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/materials" element={<FabricsPage />} />
                    <Route path="/athletes" element={<AthletesPage />} />
                    <Route path="/community" element={<CommunityPage onNavigate={(path) => handleNavigate(path)} />} />
                    <Route path="/how-we-work" element={<HowWeWorkPage />} />
                    <Route path="/mockup-generator" element={<MockupGeneratorPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer onNavigate={(path) => handleNavigate(path)} />
            <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} showToast={setToastMessage} />
            <SearchModal 
                isOpen={isSearchModalOpen} 
                onClose={() => setIsSearchModalOpen(false)} 
                products={allProducts} 
                onProductClick={(product) => { handleProductClick(product); setIsSearchModalOpen(false); }} 
                onNavigate={(page, value) => { handleNavigate(page, value); setIsSearchModalOpen(false); }} 
                collections={collections} 
                faqs={faqData} 
                materials={materials} 
            />
            <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} onSubmit={handlePasswordSubmit} />
            <SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={handleSubscriptionClose} showToast={setToastMessage} />
            <AiAdvisor allProducts={allProducts} />
        </div>
    );
};

const App: React.FC = () => (
    <Router>
        <DataProvider>
            <AdminProvider>
                <QuoteProvider>
                    <AppContent />
                </QuoteProvider>
            </AdminProvider>
        </DataProvider>
    </Router>
);

export default App;



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
// FIX: Changed to a named import to resolve the module error.
import { MockupGeneratorPage } from './components/MockupGeneratorPage';
import FeaturedPartners from './components/FeaturedPartners';
import HowItWorks from './components/HowItWorks';
import CustomizationShowcase from './components/CustomizationShowcase';
import CallToAction from './components/CallToAction';
import AthletesPage from './components/AthletesPage';
import CommunityPage from './components/CommunityPage';
import WhyChooseUs from './components/WhyChooseUs';
import HowWeWorkPage from './components/HowWeWorkPage';

const useOnScreen = (ref: React.RefObject<HTMLElement>, rootMargin: string = '0px 0px -150px 0px'): boolean => {
    const [isIntersecting, setIntersecting] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIntersecting(true);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin }
        );
        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, rootMargin]);
    return isIntersecting;
};


/**
 * @description The main component of the application. It manages the current view, state for modals,
 * and renders all other components. It acts as the central controller for the entire app.
 */
const AppContent: React.FC = () => {
    // State management for the application's UI
    const [view, setView] = useState<View>('home'); // Controls which page is currently displayed.
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Holds the product data for the product detail page.
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false); // Toggles the visibility of the quote request modal.
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // Toggles the visibility of the search modal.
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // Toggles visibility of the admin password modal.
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false); // Toggles the subscription modal.
    const [catalogueFilter, setCatalogueFilter] = useState<{ type: 'group' | 'category' | 'gender'; value: string } | null>(null); // Stores the active category filter for the catalogue page.
    const [toastMessage, setToastMessage] = useState(''); // Manages the message for the toast notification.
    const [isAppLoading, setIsAppLoading] = useState(true); // This now primarily controls the start of the fade-out sequence.
    const [isSplashVisible, setIsSplashVisible] = useState(true); // Controls whether the splash screen is in the DOM.
    const [isScrolled, setIsScrolled] = useState(false); // Controls header transparency on scroll.

    // Get admin context for authentication
    const { isAuthenticated, login } = useAdmin();
    // Get all site content from the DataContext
    const { 
        products: allProducts, collections, faqs: faqData, materials, 
        heroContents, infoCards, featuredVideoContent, brandReviews, platformRatings, partners, athletes, communityPosts,
        isLoading: isDataLoading 
    } = useData();
    
    // Animation Hooks
    const viewCatalogueButtonRef = useRef<HTMLDivElement>(null);
    useOnScreen(viewCatalogueButtonRef, '0px 0px -100px 0px');

    // On initial mount, manage splash screen, scroll, and subscription modal timers.
    useEffect(() => {
        // Splash screen fade-out timer
        const fadeTimer = setTimeout(() => {
            setIsAppLoading(false);
        }, 500);

        // Splash screen unmount timer
        const unmountTimer = setTimeout(() => {
            setIsSplashVisible(false);
        }, 2500);

        // Header transparency scroll listener
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);

        // Subscription Modal Pop-up Logic
        const hasDismissed = localStorage.getItem('subscriptionModalDismissed');
        let subscriptionTimer: ReturnType<typeof setTimeout>;
        if (!hasDismissed) {
            subscriptionTimer = setTimeout(() => {
                setIsSubscriptionModalOpen(true);
            }, 7000); // Show modal after 7 seconds
        }

        // Cleanup on unmount
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(unmountTimer);
            window.removeEventListener('scroll', handleScroll);
            if (subscriptionTimer) {
                clearTimeout(subscriptionTimer);
            }
        };
    }, []);

    // Function to display a toast notification for a short period.
    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage('');
        }, 3000); // Hide toast after 3 seconds.
    };

    // Function to handle clicking on a product card.
    // It sets the selected product and switches to the product detail view.
    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setView('product');
        setIsSearchModalOpen(false); // Close search modal if open
        window.scrollTo(0, 0); // Scroll to top of the page
    };
    
    // Handles the submission of the admin password.
    const handlePasswordSubmit = async (password: string, username: string) => {
        const success = await login(username, password);
        if (success) {
            setIsPasswordModalOpen(false);
            setView('admin');
            showToast('Admin login successful!');
        } else {
            showToast('Invalid admin credentials.');
        }
    };

    // Custom navigation handler for all internal links.
    const handleNavigate = (page: View, filterValue: string | null = null) => {
        if (page === 'admin') {
            if (isAuthenticated) {
                setView('admin');
            } else {
                setIsPasswordModalOpen(true);
            }
        } else {
            setView(page);
        }

        if (page === 'catalogue' && filterValue) {
            const productWithCategory = allProducts.find(p => p.category === filterValue);
            if (productWithCategory) {
                setCatalogueFilter({ type: 'category', value: filterValue });
            } else if (collections.includes(filterValue)) {
                setCatalogueFilter({ type: 'group', value: filterValue });
            } else if (['Men', 'Women', 'Unisex'].includes(filterValue)) {
                setCatalogueFilter({ type: 'gender', value: filterValue as 'Men' | 'Women' | 'Unisex' });
            } else {
                setCatalogueFilter(null);
            }
        } else if (page !== 'catalogue') {
            setCatalogueFilter(null);
        }
        
        window.scrollTo(0, 0);
    };

    // Handler for info card clicks
    const handleCardClick = (card: InfoCard) => {
        if (card.linkType === 'page') {
            handleNavigate(card.linkValue as View);
        } else if (card.linkType === 'modal') {
            if (card.linkValue === 'subscribe') {
                setIsSubscriptionModalOpen(true);
            } else if (card.linkValue === 'search') {
                setIsSearchModalOpen(true);
            }
        } else if (card.linkType === 'external') {
            window.open(card.linkValue, '_blank', 'noopener,noreferrer');
        }
    };

    // FIX: Added a return statement with the main JSX structure for the app.
    // This resolves the error "Type '() => void' is not assignable to type 'FC<{}>'".
    return (
        <div className={`font-sans antialiased text-gray-800 bg-white transition-opacity duration-500 ${isDataLoading && isSplashVisible ? 'opacity-0' : 'opacity-100'}`}>
            {isSplashVisible && <SplashScreen isFadingOut={!isAppLoading} />}
            
            {!isDataLoading && (
                <>
                    <Header 
                        onNavigate={handleNavigate}
                        onQuoteClick={() => setIsQuoteModalOpen(true)}
                        onSearchClick={() => setIsSearchModalOpen(true)}
                        onSubscribeClick={() => setIsSubscriptionModalOpen(true)}
                        view={view}
                        catalogueFilter={catalogueFilter}
                        isScrolled={isScrolled}
                    />
    
                    <main className="pt-14 bg-white">
                        {view === 'home' && (
                            <>
                                {heroContents.length > 0 && heroContents.sort((a,b) => a.displayOrder - b.displayOrder).map((hero, index) => (
                                    <React.Fragment key={hero.id}>
                                        <Hero 
                                            isFirst={index === 0}
                                            onNavigate={handleNavigate}
                                            {...hero}
                                        />
                                        {index === 0 && hero.featuredProductIds && hero.featuredProductIds.length > 0 && allProducts.length > 0 && (
                                            <div className="bg-white">
                                                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                                                    <h2 className="text-3xl font-oswald uppercase tracking-wider text-gray-900">{hero.featuredProductsTitle || 'Featured Products'}</h2>
                                                </div>
                                                <ProductGrid
                                                    products={allProducts.filter(p => hero.featuredProductIds?.includes(p.id))}
                                                    onProductClick={handleProductClick}
                                                />
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                                
                                <InfoCards cards={infoCards} onCardClick={handleCardClick} />
    
                                {featuredVideoContent && featuredVideoContent.isVisible && <FeaturedVideo {...featuredVideoContent} />}
    
                                <BrandReviews brandReviews={brandReviews} platformRatings={platformRatings} />
    
                                {partners.length > 0 && <FeaturedPartners partners={partners.slice(0, 12)} />}
    
                                <HowItWorks />
    
                                <CustomizationShowcase />
                                
                                <WhyChooseUs />
    
                                <CallToAction onNavigate={handleNavigate} />
                            </>
                        )}
    
                        {view === 'product' && selectedProduct && (
                            <ProductPage 
                                product={selectedProduct} 
                                onNavigate={handleNavigate} 
                                showToast={showToast} 
                                materials={materials}
                                allProducts={allProducts}
                                onProductClick={handleProductClick}
                            />
                        )}
                        
                        {view === 'catalogue' && <CataloguePage products={allProducts} onProductClick={handleProductClick} initialFilter={catalogueFilter} />}
                        {view === 'about' && <AboutPage onNavigate={handleNavigate} />}
                        {view === 'partners' && <PartnersPage onNavigate={handleNavigate} />}
                        {view === 'contact' && <ContactPage showToast={showToast} />}
                        {view === 'faq' && <FaqPage faqData={faqData} />}
                        {view === 'services' && <ServicesPage onNavigate={handleNavigate} />}
                        {view === 'terms-of-service' && <TermsOfServicePage />}
                        {view === 'return-policy' && <ReturnPolicyPage />}
                        {view === 'privacy-policy' && <PrivacyPolicyPage />}
                        {view === 'materials' && <FabricsPage />}
                        {view === 'how-we-work' && <HowWeWorkPage />}
                        {view === 'mockup-generator' && <MockupGeneratorPage />}
                        {view === 'athletes' && <AthletesPage />}
                        {view === 'community' && <CommunityPage onNavigate={handleNavigate} />}
    
                        {view === 'admin' && (
                            isAuthenticated ? <AdminDashboard /> : <div className="p-16 text-center"><p>You must be logged in to view the admin dashboard.</p><Button variant="solid" className="mt-4" onClick={() => setIsPasswordModalOpen(true)}>Admin Login</Button></div>
                        )}
                    </main>
    
                    {view !== 'admin' && <Footer onNavigate={handleNavigate} />}
    
                    <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} showToast={showToast} />
                    <SearchModal 
                        isOpen={isSearchModalOpen} 
                        onClose={() => setIsSearchModalOpen(false)} 
                        products={allProducts}
                        onProductClick={handleProductClick}
                        onNavigate={handleNavigate}
                        collections={collections}
                        faqs={faqData}
                        materials={materials}
                    />
                    <PasswordModal 
                        isOpen={isPasswordModalOpen}
                        onClose={() => setIsPasswordModalOpen(false)}
                        onSubmit={handlePasswordSubmit}
                    />
                    <SubscriptionModal 
                        isOpen={isSubscriptionModalOpen}
                        onClose={() => setIsSubscriptionModalOpen(false)}
                        showToast={showToast}
                    />
    
                    {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
                </>
            )}
        </div>
    );
};

// The App wrapper that provides all necessary contexts to the AppContent.
const App = () => (
    <DataProvider>
        <AdminProvider>
            <QuoteProvider>
                <AppContent />
            </QuoteProvider>
        </AdminProvider>
    </DataProvider>
);

// FIX: Added a default export to resolve the "has no default export" error in index.tsx.
export default App;
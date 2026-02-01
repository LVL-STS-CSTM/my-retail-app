
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AdminProvider } from './context/AdminContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import CataloguePage from './components/CataloguePage';
import ProductPage from './components/ProductPage';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';

const App: React.FC = () => (
    <Router>
        <DataProvider>
            <AdminProvider>
                <ProductProvider>
                    <CartProvider>
                        <Header />
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/catalogue" element={<CataloguePage products={[]} onProductClick={() => {}} initialFilter={null} onNavigate={() => {}} />} />
                            <Route path="/product/:productId" element={<ProductPage />} />
                        </Routes>
                        <Footer />
                    </CartProvider>
                </ProductProvider>
            </AdminProvider>
        </DataProvider>
    </Router>
);

export default App;

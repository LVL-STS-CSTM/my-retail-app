
import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Product } from '../types';
import Button from './Button';

export const MockupGeneratorPage: React.FC = () => {
    const { products } = useData();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [logo, setLogo] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [logoPos, setLogoPos] = useState({ x: 0.5, y: 0.5, scale: 0.2 });

    const mockupProducts = products.filter(p => p.mockupImageUrl);

    useEffect(() => {
        if (selectedProduct && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const productImg = new Image();
            productImg.crossOrigin = "anonymous";
            productImg.src = selectedProduct.mockupImageUrl!;
            productImg.onload = () => {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0);

                if (logo) {
                    const logoImg = new Image();
                    logoImg.src = logo;
                    logoImg.onload = () => {
                        const area = selectedProduct.mockupArea || { top: 20, left: 20, width: 60, height: 60 };
                        const drawW = (canvas.width * (area.width / 100)) * logoPos.scale * 5;
                        const drawH = logoImg.height * (drawW / logoImg.width);
                        const drawX = (canvas.width * (area.left / 100)) + (canvas.width * (area.width / 100) * logoPos.x) - (drawW / 2);
                        const drawY = (canvas.height * (area.top / 100)) + (canvas.height * (area.height / 100) * logoPos.y) - (drawH / 2);
                        
                        ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
                    };
                }
            };
        }
    }, [selectedProduct, logo, logoPos]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (prev) => setLogo(prev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="bg-white p-6 rounded-xl shadow-lg h-fit space-y-6">
                    <h1 className="font-oswald text-2xl uppercase tracking-wider">Mockup Studio</h1>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">1. Select Product</label>
                        <div className="grid grid-cols-3 gap-2">
                            {mockupProducts.map(p => (
                                <button 
                                    key={p.id}
                                    onClick={() => setSelectedProduct(p)}
                                    className={`aspect-square border-2 rounded-md overflow-hidden ${selectedProduct?.id === p.id ? 'border-black' : 'border-transparent'}`}
                                >
                                    <img src={p.mockupImageUrl} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">2. Upload Logo</label>
                        <input type="file" onChange={handleLogoUpload} className="text-sm block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
                    </div>

                    {logo && (
                        <div className="space-y-4 pt-4 border-t">
                            <label className="block text-sm font-medium text-gray-700">3. Adjust Placement</label>
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500">Scale</p>
                                <input type="range" min="0.05" max="0.5" step="0.01" value={logoPos.scale} onChange={(e) => setLogoPos(p => ({...p, scale: parseFloat(e.target.value)}))} className="w-full" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Preview */}
                <div className="lg:col-span-2 flex flex-col items-center">
                    <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden relative border border-gray-200">
                        {selectedProduct ? (
                            <canvas ref={canvasRef} className="w-full h-auto max-h-[70vh] object-contain" />
                        ) : (
                            <div className="aspect-[4/5] flex items-center justify-center text-gray-400">
                                Select a product to begin
                            </div>
                        )}
                    </div>
                    {selectedProduct && logo && (
                        <button 
                            onClick={() => {
                                const link = document.createElement('a');
                                link.download = `mockup-${selectedProduct.id}.png`;
                                link.href = canvasRef.current?.toDataURL() || '';
                                link.click();
                            }}
                            className="mt-6 bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
                        >
                            Download Mockup
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

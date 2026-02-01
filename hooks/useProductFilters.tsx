
import { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';

export const useProductFilters = (allProducts: Product[], initialFilter: { type: string, value: string } | null) => {
    const [selectedFilters, setSelectedFilters] = useState<{ group: string | null; category: string[]; gender: string[] }>({ group: null, category: [], gender: [] });
    const [showBestsellersOnly, setShowBestsellersOnly] = useState(false);

    useEffect(() => {
        if (initialFilter) {
            if (initialFilter.type === 'group') {
                setSelectedFilters(prev => ({ ...prev, group: initialFilter.value }));
            } else if (initialFilter.type === 'category') {
                setSelectedFilters(prev => ({ ...prev, category: [initialFilter.value] }));
            }
        }
    }, [initialFilter]);

    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            const groupMatch = !selectedFilters.group || p.category === selectedFilters.group;
            const categoryMatch = selectedFilters.category.length === 0 || selectedFilters.category.includes(p.category);
            const genderMatch = selectedFilters.gender.length === 0 || selectedFilters.gender.includes(p.gender);
            const bestsellerMatch = !showBestsellersOnly || p.isBestseller;
            return groupMatch && categoryMatch && genderMatch && bestsellerMatch;
        });
    }, [allProducts, selectedFilters, showBestsellersOnly]);

    const handleFilterChange = (filterType: 'group' | 'category' | 'gender', value: string) => {
        setSelectedFilters(prev => {
            if (filterType === 'group') {
                return { ...prev, group: prev.group === value ? null : value, category: [] }; // Reset category when group changes
            }
            const currentValues = prev[filterType];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [filterType]: newValues };
        });
    };

    const clearFilters = () => {
        setSelectedFilters({ group: null, category: [], gender: [] });
        setShowBestsellersOnly(false);
    };

    return { 
        filteredProducts, 
        selectedFilters, 
        showBestsellersOnly, 
        handleFilterChange, 
        setShowBestsellersOnly,
        clearFilters 
    };
};

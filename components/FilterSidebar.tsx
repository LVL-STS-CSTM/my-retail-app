
import React from 'react';
import { CloseIcon } from './icons';
import Accordion from './Accordion';

interface FilterSidebarProps {
    isMobile?: boolean;
    isFilterVisible: boolean;
    setIsFilterVisible: (visible: boolean) => void;
    clearFilters: () => void;
    memoizedFilterOptions: any;
    selectedFilters: any;
    handleFilterChange: (filterType: 'group' | 'category' | 'gender', value: string) => void;
    showBestsellersOnly: boolean;
    setShowBestsellersOnly: (show: boolean) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
    isMobile, 
    isFilterVisible,
    setIsFilterVisible,
    clearFilters, 
    memoizedFilterOptions, 
    selectedFilters, 
    handleFilterChange, 
    showBestsellersOnly, 
    setShowBestsellersOnly 
}) => (
    <div className="flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b">
            <h3 className="font-semibold text-lg">Filters</h3>
            {isMobile ? (
                <button onClick={() => setIsFilterVisible(false)}><CloseIcon className="w-6 h-6"/></button>
            ) : (
                <button onClick={clearFilters} className="text-sm text-gray-600 hover:text-black">Clear all</button>
            )}
        </div>
        <div className="p-4 space-y-2 overflow-y-auto flex-grow">
             <div>
                <h4 className="px-1 pt-2 pb-1 text-sm font-semibold uppercase tracking-wider text-gray-800">Collection</h4>
                <div className="pt-2 space-y-1">
                    {memoizedFilterOptions.groups.map(({ name }: { name: string }) => {
                        const isSelected = selectedFilters.group === name;
                        return (
                            <button 
                                key={name} 
                                onClick={() => handleFilterChange('group', name)}
                                className={`w-full text-left flex items-center justify-between space-x-2 p-2 rounded-md text-sm transition-colors ${isSelected ? 'bg-gray-800 text-white font-semibold' : 'hover:bg-gray-100'}`}
                            >
                                <span>{name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {selectedFilters.group && memoizedFilterOptions.categories.length > 0 && (
                <Accordion title="Category" theme="light">
                    <div className="pt-2 space-y-1">
                        {memoizedFilterOptions.categories.map(({ name, count }: { name: string, count: number }) => {
                            const isChecked = selectedFilters.category.includes(name);
                            const isDisabled = count === 0 && !isChecked;
                            return (
                                <label key={name} className={`flex items-center justify-between space-x-2 p-1 rounded ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={isChecked} onChange={() => handleFilterChange('category', name)} disabled={isDisabled} className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black disabled:bg-gray-200" />
                                        <span className="text-sm">{name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{count}</span>
                                </label>
                            );
                        })}
                    </div>
                </Accordion>
            )}
             <Accordion title="Gender" theme="light">
                 <div className="pt-2 space-y-1">
                    {memoizedFilterOptions.genders.map(({ name, count }: { name: string, count: number }) => {
                        const isChecked = selectedFilters.gender.includes(name);
                        const isDisabled = count === 0 && !isChecked;
                         return (
                            <label key={name} className={`flex items-center justify-between space-x-2 p-1 rounded ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={isChecked} onChange={() => handleFilterChange('gender', name)} disabled={isDisabled} className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black disabled:bg-gray-200" />
                                    <span className="text-sm">{name}</span>
                                </div>
                                <span className="text-xs text-gray-500">{count}</span>
                            </label>
                        );
                    })}
                </div>
             </Accordion>
             <Accordion title="More Filters" theme="light">
                <div className="pt-2 space-y-1">
                    <label className="flex items-center justify-between space-x-2 p-1 rounded hover:bg-gray-100 cursor-pointer">
                        <span className="text-sm">Bestsellers Only</span>
                        <input type="checkbox" checked={showBestsellersOnly} onChange={() => setShowBestsellersOnly(!showBestsellersOnly)} className="h-5 w-9 rounded-full bg-gray-200 relative cursor-pointer appearance-none transition-colors after:content-[''] after:h-4 after:w-4 after:rounded-full after:bg-white after:absolute after:top-0.5 after:left-0.5 after:shadow after:transition-transform checked:bg-black checked:after:translate-x-4" />
                    </label>
                </div>
            </Accordion>
        </div>
        {isMobile && (
             <div className="p-4 border-t bg-white sticky bottom-0 rounded-b-2xl">
                <button onClick={clearFilters} className="w-full py-3 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">Clear all filters</button>
             </div>
        )}
    </div>
);

export default FilterSidebar;

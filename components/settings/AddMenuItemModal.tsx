import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { MenuItem } from '../../types';

interface AddMenuItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddMenuItem: (itemData: Omit<MenuItem, 'id' | 'image'>) => void;
    menuItems: MenuItem[];
}

const AddMenuItemModal: React.FC<AddMenuItemModalProps> = ({ isOpen, onClose, onAddMenuItem, menuItems }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [error, setError] = useState('');

    const existingCategories = useMemo(() => Array.from(new Set(menuItems.map(item => item.category))), [menuItems]);
    const existingSubCategories = useMemo(() => Array.from(new Set(menuItems.filter(item => item.category === category).map(item => item.subCategory))), [menuItems, category]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const numPrice = parseFloat(price);

        if (!name.trim() || !price || isNaN(numPrice) || numPrice < 0 || !category.trim() || !subCategory.trim()) {
            setError('Please fill out all fields with valid information. Category and Sub-Category are required.');
            return;
        }

        onAddMenuItem({
            name,
            price: numPrice,
            category,
            subCategory,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card title="Add New Menu Item" className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="itemName" className="block text-sm font-medium text-gray-300 mb-1">Item Name</label>
                        <input
                            type="text"
                            id="itemName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                        <input
                            type="number"
                            id="itemPrice"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="itemCategory" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                             <input
                                type="text"
                                id="itemCategory"
                                list="category-list"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                                placeholder="e.g., Food"
                                required
                            />
                            <datalist id="category-list">
                                {existingCategories.map(cat => <option key={cat} value={cat} />)}
                            </datalist>
                        </div>
                         <div>
                            <label htmlFor="itemSubCategory" className="block text-sm font-medium text-gray-300 mb-1">Sub-Category</label>
                             <input
                                type="text"
                                id="itemSubCategory"
                                list="subcategory-list"
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                                className="w-full p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                                placeholder="e.g., Appetizer"
                                required
                            />
                            <datalist id="subcategory-list">
                                {existingSubCategories.map(sub => <option key={sub} value={sub} />)}
                            </datalist>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div className="flex gap-2 pt-4 border-t border-brand-primary">
                        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button variant="primary" type="submit" className="flex-1">Add Item</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddMenuItemModal;
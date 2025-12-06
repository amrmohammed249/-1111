
import React, { useState } from 'react';
import { Plus, Trash2, Package, Calculator } from 'lucide-react';
import { InventoryItem } from '../types';
import { Input, Button, Card } from './UIComponents';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  setInventory: (items: InventoryItem[]) => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ inventory, setInventory }) => {
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    subUnitName: 'شوال',
    conversionFactor: 25,
    pricePerMainUnit: 0,
  });

  const handleAddItem = () => {
    if (!newItem.name) return;
    
    const item: InventoryItem = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    setInventory([...inventory, item]);
    setNewItem({
      name: '',
      subUnitName: 'شوال',
      conversionFactor: 25,
      pricePerMainUnit: 0,
    });
  };

  const removeItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const calculatedSubPrice = newItem.pricePerMainUnit * newItem.conversionFactor;

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card className="p-6 border-blue-200 bg-blue-50">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          إضافة صنف جديد للمخزن
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-2">
            <Input 
              label="اسم الصنف" 
              placeholder="مثال: أرز بسمتي"
              value={newItem.name} 
              onChange={e => setNewItem({...newItem, name: e.target.value})} 
            />
          </div>
          <div>
            <Input 
              label="اسم الوحدة الفرعية" 
              placeholder="مثال: شوال"
              value={newItem.subUnitName} 
              onChange={e => setNewItem({...newItem, subUnitName: e.target.value})} 
            />
          </div>
          <div>
            <Input 
              label="الوزن / العدد (بالكيلو)" 
              type="number"
              min="1"
              value={newItem.conversionFactor} 
              onChange={e => setNewItem({...newItem, conversionFactor: parseFloat(e.target.value) || 0})} 
            />
          </div>
          <div>
            <Input 
              label="سعر الكيلو (الرئيسي)" 
              type="number"
              min="0"
              value={newItem.pricePerMainUnit} 
              onChange={e => setNewItem({...newItem, pricePerMainUnit: parseFloat(e.target.value) || 0})} 
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row justify-between items-center bg-white p-3 rounded-lg border border-blue-100">
           <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 md:mb-0">
             <Calculator className="w-4 h-4 text-blue-500" />
             <span>سعر الوحدة الفرعية المحسوب ({newItem.subUnitName || '...'}): </span>
             <span className="font-bold text-blue-700 text-lg mx-1">{calculatedSubPrice.toLocaleString()}</span>
             <span>( {newItem.conversionFactor} × {newItem.pricePerMainUnit} )</span>
           </div>
           <Button onClick={handleAddItem} icon={<Plus className="w-4 h-4" />}>
             إضافة للمخزن
           </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">أصناف المخزن الحالية</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الصنف</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوحدة الفرعية</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعة (كيلو)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سعر الكيلو</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سعر الفرعي</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">لا يوجد أصناف في المخزن حتى الآن</td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{item.subUnitName}</td>
                    <td className="px-4 py-3 text-gray-600">{item.conversionFactor}</td>
                    <td className="px-4 py-3 font-bold text-indigo-600">{item.pricePerMainUnit}</td>
                    <td className="px-4 py-3 font-bold text-green-600">{(item.pricePerMainUnit * item.conversionFactor).toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors bg-red-50 p-2 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default InventoryManager;

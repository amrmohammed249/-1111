
import React, { useState } from 'react';
import { Plus, Trash2, Wand2, LayoutTemplate, ShoppingCart, Upload, Image as ImageIcon } from 'lucide-react';
import { LineItem, CompanyDetails, QuotationData, InventoryItem } from '../types';
import { Input, Button, Card, TextArea } from './UIComponents';

interface EditorProps {
  company: CompanyDetails;
  setCompany: (c: CompanyDetails) => void;
  items: LineItem[];
  setItems: (i: LineItem[]) => void;
  quotationData: QuotationData;
  setQuotationData: (q: QuotationData) => void;
  onGenerateNotes: () => void;
  isGeneratingNotes: boolean;
  inventory: InventoryItem[];
}

const Editor: React.FC<EditorProps> = ({
  company, setCompany,
  items, setItems,
  quotationData, setQuotationData,
  onGenerateNotes, isGeneratingNotes,
  inventory
}) => {
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>('');

  const addItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      unit: '',
      capacity: 1,
      mainPrice: 0,
      subPrice: 0
    };
    setItems([...items, newItem]);
  };

  const addFromInventory = () => {
    const inventoryItem = inventory.find(i => i.id === selectedInventoryId);
    if (inventoryItem) {
      const newItem: LineItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: inventoryItem.name,
        unit: inventoryItem.subUnitName,
        capacity: inventoryItem.conversionFactor,
        mainPrice: inventoryItem.pricePerMainUnit,
        subPrice: inventoryItem.pricePerMainUnit * inventoryItem.conversionFactor
      };
      setItems([...items, newItem]);
      setSelectedInventoryId(''); // Reset selection
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      
      const updatedItem = { ...item, [field]: value };
      
      // Auto-calculate subPrice (Total) if mainPrice or capacity changes
      if (field === 'mainPrice' || field === 'capacity') {
        updatedItem.subPrice = updatedItem.mainPrice * updatedItem.capacity;
      }
      
      return updatedItem;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompany({ ...company, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Layout Control */}
      <Card className="p-6 border-indigo-200 bg-indigo-50">
        <h3 className="text-lg font-bold text-indigo-900 mb-4 border-b border-indigo-200 pb-2 flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5" />
          إعدادات القائمة
        </h3>
        
        {/* Header Layout Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">تخطيط الرأس (شعار واسم الشركة)</label>
          <div className="flex gap-4">
             <button 
               onClick={() => setQuotationData({...quotationData, headerLayout: 'right'})}
               className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${quotationData.headerLayout === 'right' ? 'border-indigo-600 bg-white shadow-sm' : 'border-transparent hover:bg-white/50'}`}
             >
               <div className="flex gap-1 mb-2">
                 <div className="w-8 h-4 bg-gray-300 rounded"></div>
                 <div className="w-4 h-4 bg-indigo-500 rounded"></div>
               </div>
               <span className="text-xs font-medium">الشركة يمين</span>
             </button>

             <button 
               onClick={() => setQuotationData({...quotationData, headerLayout: 'left'})}
               className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${quotationData.headerLayout === 'left' ? 'border-indigo-600 bg-white shadow-sm' : 'border-transparent hover:bg-white/50'}`}
             >
               <div className="flex gap-1 mb-2">
                 <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                 <div className="w-8 h-4 bg-gray-300 rounded"></div>
               </div>
               <span className="text-xs font-medium">الشركة يسار</span>
             </button>

             <button 
               onClick={() => setQuotationData({...quotationData, headerLayout: 'center'})}
               className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${quotationData.headerLayout === 'center' ? 'border-indigo-600 bg-white shadow-sm' : 'border-transparent hover:bg-white/50'}`}
             >
               <div className="flex flex-col items-center gap-1 mb-2">
                 <div className="w-8 h-4 bg-gray-300 rounded"></div>
                 <div className="w-4 h-4 bg-indigo-500 rounded"></div>
               </div>
               <span className="text-xs font-medium">توسط</span>
             </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input 
            label="عنوان القائمة" 
            value={quotationData.title} 
            onChange={e => setQuotationData({...quotationData, title: e.target.value})} 
          />
           <Input 
            label="العملة" 
            value={quotationData.currency} 
            onChange={e => setQuotationData({...quotationData, currency: e.target.value})} 
            placeholder="SAR, USD, ..."
          />
          <Input 
            label="رقم المرجع" 
            value={quotationData.id} 
            onChange={e => setQuotationData({...quotationData, id: e.target.value})} 
          />
          <Input 
            label="التاريخ" 
            type="date"
            value={quotationData.date} 
            onChange={e => setQuotationData({...quotationData, date: e.target.value})} 
          />
        </div>
      </Card>

      {/* Company Section */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">بيانات الشركة (المرسل)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input 
            label="اسم الشركة" 
            value={company.name} 
            onChange={e => setCompany({...company, name: e.target.value})} 
            placeholder="مثال: شركة الآفاق التقنية"
          />
          <Input 
            label="البريد الإلكتروني" 
            type="email"
            value={company.email} 
            onChange={e => setCompany({...company, email: e.target.value})} 
          />
          <Input 
            label="رقم الهاتف" 
            value={company.phone} 
            onChange={e => setCompany({...company, phone: e.target.value})} 
          />
          <Input 
            label="العنوان" 
            value={company.address} 
            onChange={e => setCompany({...company, address: e.target.value})} 
          />
        </div>
        
        {/* Logo Upload */}
        <div className="border-t border-gray-100 pt-4">
           <label className="block text-sm font-medium text-gray-700 mb-2">شعار الشركة (Logo)</label>
           <div className="flex items-center gap-4">
              {company.logoUrl ? (
                <div className="relative group">
                   <div className="w-20 h-20 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                     <img src={company.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                   </div>
                   <button 
                    onClick={() => setCompany({...company, logoUrl: ''})}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                   >
                     <Trash2 className="w-3 h-3" />
                   </button>
                </div>
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 text-gray-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              
              <div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Upload className="w-4 h-4 ml-2" />
                  {company.logoUrl ? 'تغيير الشعار' : 'رفع شعار'}
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG حتى 2MB</p>
              </div>
           </div>
        </div>
      </Card>

      {/* Items Section */}
      <Card className="p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-900">قائمة الأصناف</h3>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            {inventory.length > 0 && (
              <div className="flex items-center gap-2 flex-grow md:flex-grow-0">
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                  value={selectedInventoryId}
                  onChange={(e) => setSelectedInventoryId(e.target.value)}
                >
                  <option value="">-- اختر من المخزن --</option>
                  {inventory.map(inv => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} ({inv.subUnitName})
                    </option>
                  ))}
                </select>
                <Button 
                  onClick={addFromInventory} 
                  disabled={!selectedInventoryId}
                  variant="secondary"
                  icon={<ShoppingCart className="w-4 h-4 text-indigo-600" />}
                >
                  إضافة
                </Button>
              </div>
            )}
            <Button onClick={addItem} icon={<Plus className="w-4 h-4" />}>
              إضافة فارغ
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">اسم الصنف</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">الوحدة / العبوة</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">العدد / السعة</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">سعر الوحدة</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">الإجمالي</th>
                <th className="px-3 py-3 w-[10%]"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-3">
                    <Input 
                      value={item.name} 
                      onChange={e => updateItem(item.id, 'name', e.target.value)}
                      placeholder="اسم المنتج"
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      value={item.unit}
                      onChange={e => updateItem(item.id, 'unit', e.target.value)}
                      placeholder="شوال/كرتونة"
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input 
                      type="number" 
                      min="1"
                      value={item.capacity} 
                      onChange={e => updateItem(item.id, 'capacity', parseFloat(e.target.value) || 0)}
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input 
                      type="number" 
                      min="0"
                      value={item.mainPrice} 
                      onChange={e => updateItem(item.id, 'mainPrice', parseFloat(e.target.value) || 0)}
                      className="text-sm"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input 
                      type="number" 
                      value={item.subPrice} 
                      readOnly
                      className="text-sm bg-gray-50 font-bold text-gray-700"
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg mt-4">
            قم بإضافة أصناف لبدء القائمة
          </div>
        )}
      </Card>

      {/* AI & Notes Section */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            ملاحظات وشروط القائمة
          </h3>
          <Button 
            variant="secondary" 
            onClick={onGenerateNotes} 
            isLoading={isGeneratingNotes}
            icon={<Wand2 className="w-4 h-4 text-purple-600" />}
            className="border-purple-200 hover:bg-purple-50 text-purple-700"
          >
            توليد بالذكاء الاصطناعي
          </Button>
        </div>
        <TextArea 
          rows={4}
          placeholder="أدخل ملاحظاتك هنا أو استخدم الذكاء الاصطناعي لتوليد نص احترافي..."
          value={quotationData.notes}
          onChange={e => setQuotationData({...quotationData, notes: e.target.value})}
        />
      </Card>
    </div>
  );
};

export default Editor;

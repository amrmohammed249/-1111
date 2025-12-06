
import React, { useState } from 'react';
import { Printer, Edit3, Eye, FileText, Package } from 'lucide-react';
import { LineItem, CompanyDetails, ClientDetails, QuotationData, InventoryItem } from './types';
import Editor from './components/Editor';
import Preview from './components/Preview';
import InventoryManager from './components/InventoryManager';
import { Button } from './components/UIComponents';
import { generateQuotationNotes } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'inventory'>('editor');
  
  // Inventory State
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 'inv1', name: 'أرز بسمتي', subUnitName: 'شوال', conversionFactor: 40, pricePerMainUnit: 6 },
    { id: 'inv2', name: 'سكر ناعم', subUnitName: 'شوال', conversionFactor: 50, pricePerMainUnit: 3 },
    { id: 'inv3', name: 'عدس أحمر', subUnitName: 'كرتونة', conversionFactor: 10, pricePerMainUnit: 8 },
  ]);

  // State for form data
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', name: 'أرز بسمتي', unit: 'شوال', capacity: 40, mainPrice: 6, subPrice: 240 },
    { id: '2', name: 'سكر ناعم', unit: 'شوال', capacity: 50, mainPrice: 3, subPrice: 150 }
  ]);

  const [company, setCompany] = useState<CompanyDetails>({
    name: 'اسم شركتك هنا',
    address: 'الرياض، المملكة العربية السعودية',
    phone: '0500000000',
    email: 'info@company.com',
  });

  // Client state kept for service compatibility, but hidden from UI
  const [client] = useState<ClientDetails>({
    name: '',
    company: '',
    address: '',
    email: '',
  });

  const [quotationData, setQuotationData] = useState<QuotationData>({
    id: `PL-${new Date().getFullYear()}-001`,
    title: 'قائمة أسعار',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    taxRate: 0,
    discountRate: 0,
    currency: 'ر.س',
    notes: '',
    headerLayout: 'right'
  });

  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);

  const handleGenerateNotes = async () => {
    setIsGeneratingNotes(true);
    const notes = await generateQuotationNotes(company, client, items);
    setQuotationData(prev => ({ ...prev, notes }));
    setIsGeneratingNotes(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <FileText className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">سعرلي برو</h1>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'inventory' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Package className="w-4 h-4 ml-2" />
                المخزن
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'editor' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Edit3 className="w-4 h-4 ml-2" />
                القائمة
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'preview' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4 ml-2" />
                معاينة
              </button>
            </div>

            <Button onClick={handlePrint} icon={<Printer className="w-4 h-4" />}>
              طباعة / PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={activeTab === 'inventory' ? 'block' : 'hidden'}>
          <InventoryManager 
            inventory={inventory}
            setInventory={setInventory}
          />
        </div>

        <div className={activeTab === 'editor' ? 'block' : 'hidden'}>
          <Editor
            company={company}
            setCompany={setCompany}
            items={items}
            setItems={setItems}
            quotationData={quotationData}
            setQuotationData={setQuotationData}
            onGenerateNotes={handleGenerateNotes}
            isGeneratingNotes={isGeneratingNotes}
            inventory={inventory}
          />
        </div>

        <div className={activeTab === 'preview' ? 'block' : 'hidden'}>
          <div className="flex justify-center">
            <Preview 
              company={company}
              items={items}
              quotationData={quotationData}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

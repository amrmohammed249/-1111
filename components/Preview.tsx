
import React from 'react';
import { LineItem, CompanyDetails, QuotationData } from '../types';

interface PreviewProps {
  company: CompanyDetails;
  items: LineItem[];
  quotationData: QuotationData;
}

const Preview: React.FC<PreviewProps> = ({ company, items, quotationData }) => {
  return (
    <div className="bg-white mx-auto print-container shadow-2xl flex flex-col font-['Tajawal'] relative" style={{ width: '210mm', minHeight: '297mm', padding: '10mm 15mm' }}>
      
      {/* Header Section */}
      <div className="mb-4 pb-2 border-b-2 border-gray-800 flex flex-col items-center pt-2">
        
        {/* Logo Image - Top Center */}
        {company.logoUrl && (
          <img 
            src={company.logoUrl} 
            alt="Company Logo" 
            className="h-64 object-contain mb-4" 
          />
        )}

        {/* Company Name */}
        <h1 className="text-4xl font-black text-gray-900 mb-6 text-center tracking-wide leading-tight">
          {company.name}
        </h1>

        {/* Title Box */}
        <div className="border-2 border-gray-900 rounded-2xl px-12 py-2 mb-8 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">{quotationData.title}</h2>
        </div>

        {/* Info Line: Date & Phone */}
        <div className="w-full flex justify-between items-end mt-2 px-2">
           {/* Phone (Left) */}
          <div className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span dir="ltr" className="font-medium">{company.phone}</span>
            <span>:الهاتف</span>
          </div>

          {/* Date (Right) */}
          <div className="text-lg font-bold text-gray-900">
            التاريخ: <span className="font-medium mr-1">{quotationData.date}</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mb-8 flex-grow">
        <table className="w-full border-collapse border-2 border-gray-900 table-fixed">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-2 border-gray-900 py-3 px-1 text-center font-bold text-gray-900 w-[8%] text-lg">م</th>
              <th className="border-2 border-gray-900 py-3 px-4 text-right font-bold text-gray-900 w-[32%] text-lg">الصنف / البيان</th>
              <th className="border-2 border-gray-900 py-3 px-2 text-center font-bold text-gray-900 w-[20%] text-lg">الوحدة / العبوة</th>
              <th className="border-2 border-gray-900 py-3 px-2 text-center font-bold text-gray-900 w-[20%] text-lg">سعر الكيلو</th>
              <th className="border-2 border-gray-900 py-3 px-2 text-center font-bold text-gray-900 w-[20%] text-lg">
                الإجمالي
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="text-gray-900 hover:bg-gray-50/50">
                <td className="border-2 border-gray-900 py-3 px-2 text-center font-bold text-lg">
                  {index + 1}
                </td>
                <td className="border-2 border-gray-900 py-3 px-4 text-right font-bold text-xl truncate">
                  {item.name}
                </td>
                <td className="border-2 border-gray-900 py-3 px-2 text-center">
                  <div className="flex flex-col items-center justify-center h-full">
                    {/* Unit Name */}
                    <span className="font-bold text-xl leading-none mb-1">{item.unit}</span>
                    {/* Capacity displayed clearly */}
                    {item.capacity > 0 && (
                      <span className="text-sm font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
                        {item.capacity} كيلو
                      </span>
                    )}
                  </div>
                </td>
                <td className="border-2 border-gray-900 py-3 px-2 text-center font-bold text-xl">
                  {item.mainPrice}
                </td>
                <td className="border-2 border-gray-900 py-3 px-2 text-center font-black text-2xl">
                  {item.subPrice.toLocaleString()}
                </td>
              </tr>
            ))}
            
            {/* Empty rows to fill the page visually if items are few */}
            {items.length < 12 && Array.from({ length: 12 - items.length }).map((_, idx) => (
               <tr key={`empty-${idx}`}>
                 <td className="border-2 border-gray-900 py-4">&nbsp;</td>
                 <td className="border-2 border-gray-900 py-4">&nbsp;</td>
                 <td className="border-2 border-gray-900 py-4">&nbsp;</td>
                 <td className="border-2 border-gray-900 py-4">&nbsp;</td>
                 <td className="border-2 border-gray-900 py-4">&nbsp;</td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Notes */}
      {quotationData.notes && (
        <div className="mb-8 break-inside-avoid px-2">
          <h4 className="font-bold text-gray-900 mb-2 underline decoration-2 underline-offset-4">ملاحظات:</h4>
          <p className="text-base text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">{quotationData.notes}</p>
        </div>
      )}

      {/* Footer Address */}
      <div className="mt-auto pt-4 text-center border-t-2 border-gray-800">
        <p className="text-gray-800 font-bold text-lg">{company.address}</p>
      </div>
    </div>
  );
};

export default Preview;

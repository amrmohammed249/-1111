
import { GoogleGenAI } from "@google/genai";
import { LineItem, CompanyDetails, ClientDetails } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuotationNotes = async (
  company: CompanyDetails,
  client: ClientDetails,
  items: LineItem[]
): Promise<string> => {
  try {
    const itemsList = items.map(i => `- ${i.name} (${i.unit}) - ${i.mainPrice}`).join('\n');
    
    const prompt = `
      أنت مساعد أعمال ذكي. قم بكتابة "ملاحظات وشروط" احترافية لقائمة أسعار (Price List) باللغة العربية.
      
      المعلومات:
      الشركة المرسلة: ${company.name}
      بعض المنتجات:
      ${itemsList}

      المطلوب:
      اكتب فقرة قصيرة مهذبة تشكر العملاء، وتوضح أن الأسعار قابلة للتغيير دون إشعار مسبق، أو أنها سارية لفترة محددة. وتتمنى التعاون المستقبلي.
      اجعل النص رسمياً وجذاباً. لا تضع أي مقدمات، فقط النص النهائي للملاحظات.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "الأسعار قابلة للتغيير. شكراً لتعاملكم معنا.";
  } catch (error) {
    console.error("Error generating notes:", error);
    return "حدث خطأ أثناء إنشاء الملاحظات. يرجى المحاولة لاحقاً.";
  }
};

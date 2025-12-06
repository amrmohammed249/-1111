import { GoogleGenAI } from "@google/genai";
import { LineItem, CompanyDetails, ClientDetails } from "../types";

export const generateQuotationNotes = async (
  company: CompanyDetails,
  client: ClientDetails,
  items: LineItem[]
): Promise<string> => {
  try {
    // Initialize AI client lazily to prevent top-level crashes if process.env is missing on load
    // We try to get the key from process.env, or fallback to empty string to let the error be handled gracefully
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
    
    if (!apiKey) {
      console.warn("API Key not found in process.env.API_KEY");
      return "الرجاء ضبط إعدادات مفتاح API (VITE_API_KEY أو API_KEY) في منصة الاستضافة لتفعيل الميزة الذكية.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
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
    return "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى التأكد من إعدادات المفتاح والمحاولة لاحقاً.";
  }
};
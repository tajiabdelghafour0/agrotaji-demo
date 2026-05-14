"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle, MapPin } from "lucide-react";
import { getCurrentLocation } from "@/core/GeoTracker";
import { logInteraction } from "@/core/AsyncLogger";

interface CheckoutViewProps {
  diagnosisData: any;
  onBack: () => void;
}

export function CheckoutView({ diagnosisData, onBack }: CheckoutViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("جاري تحديد موقعك لربطك بأقرب مورد...");

  const handlePurchase = async () => {
    setIsLoading(true);
    let coords = null;
    try {
      coords = await getCurrentLocation();
      setLocationStatus("تم تحديد الموقع بنجاح");
    } catch (e) {
      console.warn("Location error:", e);
      setLocationStatus("سيتم المتابعة بدون تحديد دقيق للموقع");
    }

    // Fire & Forget Logging (No Backend blocking)
    logInteraction({
      event: "BUY_INTENT_WHATSAPP",
      metadata: { disease: diagnosisData.disease, score: diagnosisData.score, coords },
      timestamp: new Date().toISOString()
    });

    if (navigator.vibrate) navigator.vibrate(50);

    const message = `مرحباً AgroTaji، أريد طلب "باقة الإنقاذ العاجل" لحالة (نقص الكالسيوم). الإحداثيات الجغرافية لمزرعتي: ${coords ? `${coords.latitude},${coords.longitude}` : 'غير متوفرة'}. المرجو التأكيد!`;
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/212600000000?text=${encoded}`;

    setTimeout(() => {
      window.location.href = waUrl;
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col flex-1 bg-brand-offwhite p-6 h-full overflow-y-auto">
      {/* Top Trust Badge using Glassmorphism */}
      <div className="glass-panel w-full rounded-2xl p-4 flex items-center justify-center gap-2 mb-8 shadow-sm">
        <CheckCircle2 className="text-brand-green" size={24} />
        <span className="font-bold text-brand-green">مورد معتمد قريب منك (WhatsApp)</span>
      </div>

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-brand-green mb-2">باقة الإنقاذ العاجل</h2>
        <p className="text-brand-green/70">مخصصة لحالتك: نقص الكالسيوم</p>
      </div>

      {/* Bundle Selection */}
      <div className="bg-white rounded-3xl p-6 shadow-md mb-8 border border-gray-100 shrink-0">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
          <div>
            <h3 className="font-bold text-lg text-brand-green">1. كالسيوم سائل عالي التركيز</h3>
            <p className="text-xs text-brand-green/60">يوقف تساقط الأوراق فوراً</p>
          </div>
          <span className="font-bold text-[var(--color-brand-gold)]">150 د.م</span>
        </div>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
          <div>
            <h3 className="font-bold text-lg text-brand-green">2. سماد ورقي منشط</h3>
            <p className="text-xs text-brand-green/60">يعيد الحيوية في 24 ساعة</p>
          </div>
          <span className="font-bold text-[var(--color-brand-gold)]">80 د.م</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-xl text-brand-green">المجموع</span>
          <span className="font-bold text-2xl text-brand-green">230 د.م</span>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-4 shrink-0">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-brand-green/80 text-sm bg-brand-green/5 p-3 rounded-lg">
            <MapPin size={18} className="animate-bounce text-brand-gold" />
            <span className="font-medium">{locationStatus}</span>
          </div>
        )}
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full bg-[var(--color-brand-gold)] text-white rounded-2xl py-4 flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 shadow-lg shadow-black/10"
        >
          <div className="flex items-center gap-2">
            <MessageCircle size={22} />
            <span className="font-bold text-lg">أرسل الطلب عبر WhatsApp</span>
          </div>
          <span className="text-xs font-medium opacity-90">التوصيل مجاني • الدفع عند الاستلام</span>
        </button>
        <button onClick={onBack} disabled={isLoading} className="text-brand-green/60 text-sm font-medium py-3 active:scale-95 transition-transform">
          إلغاء والعودة للتشخيص
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Volume2, ChevronLeft } from "lucide-react";

interface DiagnosisViewProps {
  imageFile: File;
  onProceed: (diagnosisData: any) => void;
}

export function DiagnosisView({ imageFile, onProceed }: DiagnosisViewProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [status, setStatus] = useState<"scanning" | "done">("scanning");
  const [scanText, setScanText] = useState("نظام AgroTaji الخبير يقوم بالتحليل...");

  useEffect(() => {
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);

    // Simulate AI Mocking
    const timer1 = setTimeout(() => setScanText("جاري استخراج الخصائص الحيوية..."), 1500);
    const timer2 = setTimeout(() => setScanText("تمت مطابقة حالتك..."), 3000);
    const timer3 = setTimeout(() => {
      setStatus("done");
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Success Haptics
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  const playTTS = () => {
    if ("speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance("نتيجة الفحص، النبتة مصابة بنقص الكالسيوم. نسبة الصحة ثلاثون من مائة. ننصح بالتدخل الفوري.");
      msg.lang = "ar-SA";
      window.speechSynthesis.speak(msg);
    }
  };

  if (status === "scanning") {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden">
        <style>{`
          @keyframes scan {
            0% { top: 0; opacity: 1; }
            50% { top: 100%; opacity: 0.5; }
            100% { top: 0; opacity: 1; }
          }
          .animate-scanner {
            animation: scan 2.5s ease-in-out infinite;
            box-shadow: 0 0 15px 2px var(--color-brand-gold);
          }
        `}</style>
        {imageUrl && <img src={imageUrl} alt="Captured" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
        
        {/* Scanner Animation Line */}
        <div className="absolute left-0 w-full h-1 bg-brand-gold animate-scanner z-10" />
        
        {/* Liquid Glass Wait Badge */}
        <div className="absolute bottom-20 glass-panel px-6 py-3 rounded-full text-brand-green font-medium shadow-2xl z-20">
          {scanText}
        </div>
      </div>
    );
  }

  // Done State
  return (
    <div className="flex flex-col flex-1 bg-brand-offwhite p-6 h-full overflow-y-auto">
      <div className="w-full h-64 rounded-2xl overflow-hidden shrink-0 mb-6 relative shadow-md">
        {imageUrl && <img src={imageUrl} alt="Captured" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 right-4 text-white font-bold text-xl drop-shadow-md">
          التشخيص
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 mb-8 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-brand-green">نقص الكالسيوم الحاد</h2>
          <div className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full font-bold text-lg border border-red-200">
            30/100
          </div>
        </div>
        <p className="text-brand-green/80 text-sm leading-relaxed mb-6">
          مؤشر صحة النبتة منخفض جداً. تآكل الحواف يهدد المحصول بالكامل في غضون 48 ساعة إذا لم يتم التدخل.
        </p>
        <button onClick={playTTS} className="flex items-center gap-2 text-brand-gold font-bold active:scale-95 transition-transform bg-brand-gold/10 px-4 py-2 rounded-xl w-max">
          <Volume2 size={20} />
          استمع للتقرير
        </button>
      </div>

      <button
        onClick={() => onProceed({ disease: "Calcium Deficiency", score: 30 })}
        className="mt-auto w-full bg-brand-green text-brand-white rounded-2xl py-4 flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shrink-0"
      >
        <span className="font-bold text-lg">استعراض خطة العلاج</span>
        <ChevronLeft size={20} />
      </button>
    </div>
  );
}

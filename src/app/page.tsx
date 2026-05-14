"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Leaf, ScanLine, Phone, CheckCircle2, RefreshCcw } from "lucide-react";
import Image from "next/image";
import Webcam from "react-webcam";

type AppState = "capture" | "scanning" | "result";

export default function MockFlowPage() {
  const [appState, setAppState] = useState<AppState>("capture");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [hasCameraError, setHasCameraError] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  // Capture Image
  const handleCapture = useCallback(() => {
    try {
      console.log("[Action] Camera Clicked");
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setAppState("scanning");
      }
    } catch (err) {
      console.error("[Error] Camera capture failed", err);
    }
  }, []);

  // Scanning Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (appState === "scanning") {
      try {
        console.log("[Action] Mock Analysis Started");
        timer = setTimeout(() => {
          console.log("[Action] Analysis Completed, Navigating to Result");
          setAppState("result");
        }, 3000);
      } catch (err) {
        console.error("[Error] Analysis timeout failed", err);
      }
      return () => clearTimeout(timer);
    }
  }, [appState]);

  return (
    <div className="h-[100dvh] w-full max-w-md mx-auto relative overflow-hidden bg-black text-white selection:bg-none">
      
      {/* --- FLOATING HEADER --- */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <Image 
          src="/logo.png" 
          alt="AgroTaji" 
          width={100} 
          height={32} 
          className="object-contain invert brightness-0 drop-shadow-md opacity-90" 
          priority 
        />
      </div>

      {/* --- CAMERA & CAPTURED IMAGE LAYER (FULL SCREEN) --- */}
      <div className="absolute inset-0 z-0 bg-black">
        {(appState === "capture" || !capturedImage) ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              onUserMedia={() => setIsCameraReady(true)}
              onUserMediaError={() => setHasCameraError(true)}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            
            {/* Loading Camera State */}
            {!isCameraReady && !hasCameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 backdrop-blur-md">
                <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-white/60 text-sm font-medium tracking-wide animate-pulse">جاري فتح الكاميرا...</span>
              </div>
            )}

            {/* Error Camera State */}
            {hasCameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 backdrop-blur-md p-6 text-center">
                <span className="text-[#FF4B4B] text-lg font-bold mb-3">تعذر الوصول للكاميرا</span>
                <span className="text-white/80 text-sm font-medium leading-relaxed mb-6">يرجى تفعيل صلاحية الكاميرا في إعدادات المتصفح</span>
                <button 
                  onClick={() => {
                    setHasCameraError(false);
                    setIsCameraReady(false);
                  }}
                  className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold rounded-full active:scale-95 transition-transform"
                >
                  إعادة المحاولة
                </button>
              </div>
            )}
            
            {/* Ghost Outline (Leaf) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-12">
              <div className="w-full aspect-[3/4] border-[2px] border-white/20 border-dashed rounded-[3rem] flex items-center justify-center relative backdrop-blur-[1px]">
                <Leaf size={140} className="text-white/20" strokeWidth={1} />
                <div className="absolute bottom-8 px-5 py-2 bg-black/40 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                  <span className="text-white/80 text-xs font-semibold tracking-wide">ضع النبتة داخل الإطار</span>
                </div>
              </div>
            </div>
            
            {/* Refresh Camera Button */}
            <button 
              onClick={() => {
                setIsCameraReady(false);
                setHasCameraError(false);
              }}
              className="absolute top-8 right-5 z-50 p-2.5 bg-black/20 backdrop-blur-md rounded-full border border-white/10 active:scale-90 transition-transform shadow-sm"
            >
              <RefreshCcw size={18} className="text-white" />
            </button>
          </>
        ) : (
          <Image src={capturedImage} alt="Captured Plant" fill className="object-cover" />
        )}
      </div>

      {/* --- CAPTURE STATE CONTROLS --- */}
      {appState === "capture" && (
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-20 flex items-center justify-center pb-8 animate-[fadeIn_0.3s_ease-out]">
          <button 
            onClick={handleCapture}
            disabled={!isCameraReady}
            className="w-[88px] h-[88px] rounded-full border-[5px] border-white/70 flex items-center justify-center active:scale-90 transition-all disabled:opacity-50 disabled:active:scale-100 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            <div className="w-[70px] h-[70px] rounded-full bg-white shadow-inner" />
          </button>
        </div>
      )}

      {/* --- SCANNING STATE OVERLAY --- */}
      {appState === "scanning" && (
        <div className="absolute inset-0 z-30 backdrop-blur-[12px] bg-black/40 flex items-center justify-center animate-[fadeIn_0.4s_ease-out]">
          {/* Scan Box */}
          <div className="relative w-[75%] aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl bg-white/5">
            {/* Scanner Line */}
            <div className="absolute left-0 w-full h-[3px] bg-[#D4AF37] shadow-[0_0_25px_5px_#D4AF37] animate-[scanNative_2.5s_linear_infinite]" />
            <div className="absolute inset-0 flex items-center justify-center mix-blend-overlay">
              <ScanLine size={80} className="text-white opacity-40 animate-pulse" />
            </div>
          </div>
          {/* Analysis Text */}
          <div className="absolute bottom-24 px-6 py-3.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="text-white text-sm font-bold tracking-wide shadow-black drop-shadow-md">AgroTaji AI يقوم بالتحليل...</span>
          </div>
        </div>
      )}

      {/* --- RESULT STATE (GLASSMORPHISM BOTTOM SHEET) --- */}
      {appState === "result" && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/50 backdrop-blur-sm animate-[fadeIn_0.5s_ease-out]">
          
          {/* Invisible Overlay to dismiss */}
          <div className="flex-1" onClick={() => { 
            console.log("[Action] Dismissed Result via Backdrop");
            setAppState("capture"); 
            setCapturedImage(null); 
          }} />

          {/* Premium Glass Card */}
          <div className="w-full bg-[#1A3636]/90 backdrop-blur-2xl rounded-t-[2.5rem] border-t border-white/10 p-7 pb-10 shadow-[0_-10px_50px_rgba(0,0,0,0.6)] animate-[slideUp_0.5s_cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden">
            
            {/* Subtle Lighting Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Pill Handle */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-7" />

            {/* Diagnosis Result */}
            <div className="mb-7 relative z-10">
              <h2 className="text-[28px] font-black text-white mb-2 tracking-tight drop-shadow-sm">اللفحة (Mildiou)</h2>
              <p className="text-white/60 text-sm font-medium">مرض فطري خطير تم رصده على الأوراق ويستدعي تدخلاً سريعاً.</p>
            </div>

            {/* Health Score Sleek Progress Bar */}
            <div className="bg-black/30 rounded-2xl p-5 mb-7 border border-white/5 relative z-10">
              <div className="flex justify-between items-end mb-3">
                <span className="text-xs font-bold text-white/70 uppercase tracking-widest">صحة النبتة</span>
                <span className="text-2xl font-black text-[#FF4B4B] drop-shadow-md">30%</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-[#FF2A2A] to-[#FF6B6B] rounded-full w-[30%] relative shadow-[0_0_10px_rgba(255,75,75,0.6)]">
                   {/* Glow tip */}
                   <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/50 blur-[2px] rounded-full" />
                </div>
              </div>
            </div>

            {/* Proposed Solution */}
            <div className="bg-white/5 rounded-2xl p-5 mb-8 border border-white/10 relative overflow-hidden z-10">
              <div className="flex items-start gap-3.5 relative z-10">
                <CheckCircle2 className="text-[#D4AF37] shrink-0 mt-0.5" size={22} />
                <div>
                  <h4 className="text-[#D4AF37] text-sm font-bold mb-1.5 uppercase tracking-wide">باقة العلاج الموصى بها</h4>
                  <p className="text-white/90 text-[15px] leading-relaxed font-medium">
                    مبيد فطري جهازي <span className="opacity-50 mx-1">+</span> سماد ورقي غني بالعناصر الصغرى للتقوية السريعة.
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA (Real Gold) */}
            <a 
              href="https://wa.me/?text=السلام عليكم، قمت بتشخيص نبتتي عبر AgroTaji وأحتاج باقة علاج اللفحة. هل هي متوفرة؟"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => console.log("[Action] WhatsApp CTA Clicked")}
              className="relative z-10 w-full bg-[#D4AF37] text-[#1A3636] rounded-2xl py-4 flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] font-extrabold text-[17px] hover:bg-[#E5C14E]"
            >
              <Phone size={22} className="fill-[#1A3636]" />
              طلب العلاج الآن عبر WhatsApp
            </a>

            {/* Secondary Action */}
            <button 
              onClick={() => { 
                console.log("[Action] Requested New Scan");
                setAppState("capture"); 
                setCapturedImage(null); 
              }}
              className="w-full mt-5 py-2 text-white/50 text-sm font-bold active:text-white/80 transition-colors tracking-wide relative z-10"
            >
              إجراء فحص جديد
            </button>
          </div>
        </div>
      )}

      {/* Global CSS for Native Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanNative {
          0% { top: 0%; opacity: 0.2; }
          10% { opacity: 1; }
          50% { top: 100%; opacity: 1; }
          90% { opacity: 1; }
          100% { top: 0%; opacity: 0.2; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0.5; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Zap, ZapOff } from "lucide-react";
import { compressPlantImage } from "@/core/ImageCompressor";

interface ScannerViewProps {
  onCapture: (file: File) => void;
}

export function ScannerView({ onCapture }: ScannerViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flash, setFlash] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        alert("يرجى السماح بالوصول للكاميرا.");
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFlash = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    try {
      const advanced = [{ torch: !flash }];
      await track.applyConstraints({ advanced } as any);
      setFlash(!flash);
    } catch (err) {
      console.warn("Flash not supported on this device:", err);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    setIsProcessing(true);
    
    if (navigator.vibrate) navigator.vibrate(50);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
          try {
            const compressed = await compressPlantImage(file);
            onCapture(compressed);
          } catch (e) {
            console.error(e);
            setIsProcessing(false);
          }
        }
      }, "image/jpeg", 0.9);
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Ghost Outline (Leaf) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-64 h-64 opacity-60 text-white stroke-current stroke-[2px] fill-transparent">
           <path d="M50 10 C20 30 10 50 10 70 C10 90 30 95 50 95 C70 95 90 90 90 70 C90 50 80 30 50 10 Z M50 95 L50 20" strokeDasharray="4 4" />
        </svg>
      </div>

      <div className="absolute top-6 left-6 z-10">
        <button onClick={toggleFlash} className="p-3 bg-black/40 rounded-full text-white backdrop-blur-md">
          {flash ? <Zap size={24} /> : <ZapOff size={24} />}
        </button>
      </div>

      <div className="absolute bottom-10 left-0 w-full flex justify-center z-10">
        <button
          onClick={captureImage}
          disabled={isProcessing}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-90"
        >
          <div className={`w-16 h-16 rounded-full bg-white transition-all ${isProcessing ? 'scale-50 animate-pulse' : ''}`} />
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

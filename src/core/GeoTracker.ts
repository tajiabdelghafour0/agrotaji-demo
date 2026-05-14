export interface GeoData {
  latitude: number;
  longitude: number;
}

export function getCurrentLocation(): Promise<GeoData> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("الموقع غير مدعوم في هذا المتصفح."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("GeoTracker error:", error);
        reject(new Error("تعذر تحديد الموقع."));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  });
}

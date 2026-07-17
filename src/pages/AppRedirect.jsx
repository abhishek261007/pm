import { useEffect } from 'react';

export default function AppRedirect() {
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Check for Android
    if (/android/i.test(userAgent)) {
      window.location.href = "https://play.google.com/store/apps/details?id=com.abhishek261007.pmj";
    } else {
      // Redirect to pmjewellers.com for iPad, iOS, PC, etc.
      window.location.href = "https://pmjewellers.com";
    }
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#000', color: '#fff' }}>
      <p>Redirecting...</p>
    </div>
  );
}

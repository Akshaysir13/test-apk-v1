import { Shield, Maximize, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ScreenshotBlockerProps {
  onEnterFullscreen: () => void;
}

export default function ScreenshotBlocker({ onEnterFullscreen }: ScreenshotBlockerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    // Check if it's running in a WebView (your APK)
    const webViewDetected = userAgent.includes('wv') || // Android WebView
      userAgent.includes('webview') ||
      (window as any).ReactNativeWebView !== undefined || // React Native
      (window as any).flutter_inappwebview !== undefined; // Flutter

    // Check if it's a mobile device
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;

    setIsWebView(webViewDetected);
    setIsMobile((isMobileUA || (isTouchDevice && isSmallScreen)) && !webViewDetected);
  }, []);

  useEffect(() => {
    // Block ALL interactions when violation screen is shown
    const preventInteraction = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    const preventKeyboard = (e: KeyboardEvent) => {
      // Only allow the button click to continue
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    document.addEventListener('keydown', preventKeyboard, true);
    document.addEventListener('keyup', preventKeyboard, true);
    document.addEventListener('copy', preventInteraction, true);
    document.addEventListener('paste', preventInteraction, true);
    document.addEventListener('cut', preventInteraction, true);
    document.addEventListener('contextmenu', preventInteraction, true);
    document.addEventListener('selectstart', preventInteraction, true);
    document.addEventListener('dragstart', preventInteraction, true);

    return () => {
      document.removeEventListener('keydown', preventKeyboard, true);
      document.removeEventListener('keyup', preventKeyboard, true);
      document.removeEventListener('copy', preventInteraction, true);
      document.removeEventListener('paste', preventInteraction, true);
      document.removeEventListener('cut', preventInteraction, true);
      document.removeEventListener('contextmenu', preventInteraction, true);
      document.removeEventListener('selectstart', preventInteraction, true);
      document.removeEventListener('dragstart', preventInteraction, true);
    };
  }, []);

  // ALWAYS show the black violation screen - no exceptions
  // This ensures any recording captures only a black screen
  return (
    <div
      className="fixed inset-0 z-[99999] bg-black flex items-center justify-center pointer-events-auto"
      style={{
        backgroundColor: '#000000',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999
      }}
    >
      <div className="text-center p-4 sm:p-8 max-w-md bg-slate-900 rounded-xl border-2 border-red-600 shadow-2xl mx-4">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Shield className="text-red-500 animate-pulse w-16 h-16 sm:w-20 sm:h-20" />
            <AlertTriangle className="absolute top-0 right-0 text-red-600 animate-bounce w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-red-500 mb-4 uppercase">VIOLATION!</h1>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
          {isMobile || isWebView ? 'Security Alert' : 'Fullscreen Exit Detected'}
        </h2>
        <p className="text-red-300 mb-6 text-base sm:text-lg font-semibold">
          ⚠️ You must stay in fullscreen mode during the test
        </p>
        <p className="text-gray-300 mb-4 text-sm sm:text-base">
          This violation has been recorded and logged.
        </p>
        <p className="text-yellow-400 mb-4 text-sm sm:text-base font-bold">
          📹 Screen recording will only capture this black screen
        </p>
        <p className="text-gray-400 mb-8 text-xs sm:text-sm">
          Click below to return to fullscreen and continue your test.
        </p>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEnterFullscreen();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 mx-auto cursor-pointer w-full sm:w-auto"
        >
          <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
          Return to Fullscreen
        </button>
        <p className="text-gray-500 mt-8 text-xs border-t border-gray-700 pt-4">
          All violations are monitored and logged to the server.
        </p>
      </div>
    </div>
  );
}
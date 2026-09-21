import { useState, useEffect, useCallback } from 'react';

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Detect if already installed / standalone mode
        const isStandalone = 
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true ||
            document.referrer.includes('android-app://');

        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const iosDevice = /iphone|ipad|ipod/.test(userAgent);
        const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
        const isIOSSafari = iosDevice && isSafari;
        setIsIOS(iosDevice);

        // Check if previously dismissed in this session
        const dismissedSession = sessionStorage.getItem('devburundi_pwa_dismissed');
        if (dismissedSession) {
            setIsDismissed(true);
        }

        // Handle beforeinstallprompt (Chromium, Android, Edge, etc.)
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);

            // Automatically open popup after a gentle delay on page open if not dismissed
            if (!dismissedSession && !isStandalone) {
                const timer = setTimeout(() => {
                    setIsOpen(true);
                }, 1000);
                return () => clearTimeout(timer);
            }
        };

        // Handle successful installation
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
            setIsOpen(false);
            sessionStorage.removeItem('devburundi_pwa_dismissed');
            console.log('[PWA] Devburundi was successfully installed');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // If on iOS and not in standalone and not dismissed, show guided prompt
        if (iosDevice && !isStandalone && !dismissedSession) {
            const timer = setTimeout(() => {
                setIsInstallable(true);
                setIsOpen(true);
            }, 1200);
            return () => clearTimeout(timer);
        }

        // Fallback for browsers that don't fire beforeinstallprompt immediately (like desktop Chrome before interaction)
        // Ensure prompt is still visible after 1.5s if not already standalone and not dismissed
        if (!dismissedSession && !isStandalone) {
            const fallbackTimer = setTimeout(() => {
                setIsOpen(true);
            }, 1500);
            return () => clearTimeout(fallbackTimer);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const promptInstall = useCallback(async () => {
        if (!deferredPrompt) {
            if (isIOS) {
                // iOS requires manual Add to Home Screen, keep open or focus instructions
                return { outcome: 'instructions_shown' };
            }
            return { outcome: 'unavailable' };
        }

        try {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult.outcome === 'accepted') {
                console.log('[PWA] User accepted the install prompt');
                setIsInstalled(true);
                setIsOpen(false);
            } else {
                console.log('[PWA] User dismissed the install prompt');
            }
            setDeferredPrompt(null);
            return choiceResult;
        } catch (error) {
            console.error('[PWA] Installation prompt error:', error);
            return { outcome: 'error' };
        }
    }, [deferredPrompt, isIOS]);

    const dismissPrompt = useCallback(() => {
        setIsOpen(false);
        setIsDismissed(true);
        sessionStorage.setItem('devburundi_pwa_dismissed', 'true');
    }, []);

    const openPrompt = useCallback(() => {
        setIsOpen(true);
    }, []);

    return {
        isInstallable,
        isInstalled,
        isOpen,
        isIOS,
        isDismissed,
        promptInstall,
        dismissPrompt,
        openPrompt,
    };
}
export default usePWAInstall;

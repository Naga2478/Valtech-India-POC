// MobileMenuScript.ts

import { useEffect } from 'react';

const MobileMenuScript = () => {
    useEffect(() => {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenuContent = document.getElementById('headerContainer');

        const toggleMobileMenu = () => {
            if (mobileMenuContent) {
                mobileMenuContent.style.display = mobileMenuContent?.style.display === 'block' ? 'none' : 'block';
                const isMobileMenuActive = mobileMenuToggle?.classList.contains('active');
                mobileMenuToggle?.classList.toggle('active', !isMobileMenuActive);
            }
        };

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        return () => {
            if (mobileMenuToggle) {
                mobileMenuToggle.removeEventListener('click', toggleMobileMenu);
            }
        };
    }, []);

    return null;
};

export default MobileMenuScript;

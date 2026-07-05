import WhatsAppButton from '@/components/WhatsAppButton';
import UrgencyBanner from '@/components/UrgencyBanner';
import ScratchCardPopup from '@/components/ScratchCardPopup';
import GlobalTracker from '@/components/GlobalTracker';
import SocialProofPopup from '@/components/SocialProofPopup';
import { LanguageProvider } from '@/lib/LanguageContext';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <GlobalTracker />
      <UrgencyBanner />
      {children}
      <ScratchCardPopup />
      <SocialProofPopup />
      <WhatsAppButton />

      {/* Google Analytics (Tag Manager) */}
      {process.env.NEXT_PUBLIC_GOOGLE_ID && process.env.NEXT_PUBLIC_GOOGLE_ID !== 'TU_ID_AQUI' && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ID} />
      )}

      {/* Facebook Pixel */}
      {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID && process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID !== 'TU_ID_AQUI' && (
        <>
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </LanguageProvider>
  );
}

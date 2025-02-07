import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeAppearance } from 'antd-style';
import { ResolvingViewport } from 'next';
import { ReactNode } from 'react';
import { isRtlLang } from 'rtl-detect';

import Analytics from '@/components/Analytics';
import { DEFAULT_LANG } from '@/const/locale';
import PWAInstall from '@/features/PWAInstall';
import AuthProvider from '@/layout/AuthProvider';
import GlobalProvider from '@/layout/GlobalProvider';
import { DynamicLayoutProps } from '@/types/next';
import { RouteVariants } from '@/utils/server/routeVariants';

const inVercel = process.env.VERCEL === '1';

interface RootLayoutProps extends DynamicLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

// 客户端配置
interface HpClientConfig {
  appUrl: string;
  logto: {
    clientId: string;
    issuer: string;
  };
  ssoProvider: string;
}

const RootLayout = async ({ children, params, modal }: RootLayoutProps) => {
  const { variants } = await params;

  const { locale, isMobile, theme, primaryColor, neutralColor } =
    RouteVariants.deserializeVariants(variants);

  const direction = isRtlLang(locale) ? 'rtl' : 'ltr';

  const hpClientConfig: HpClientConfig = {
    appUrl: process.env.APP_URL || '',
    logto: {
      clientId: process.env.AUTH_LOGTO_ID || '',
      issuer: process.env.AUTH_LOGTO_ISSUER || '',
    },
    ssoProvider: process.env.NEXT_AUTH_SSO_PROVIDERS || '',
  };

  return (
    <html dir={direction} lang={locale} suppressHydrationWarning>
      <body>
        <GlobalProvider
          appearance={theme}
          isMobile={isMobile}
          locale={locale}
          neutralColor={neutralColor}
          primaryColor={primaryColor}
        >
          <AuthProvider>
            {children}
            {!isMobile && modal}
          </AuthProvider>
          <PWAInstall />
        </GlobalProvider>
        <Analytics />
        {inVercel && <SpeedInsights />}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__HP_CLIENT_CONFIG__ = ${JSON.stringify(hpClientConfig)};`,
          }}
        />
      </body>
    </html>
  );
};

export default RootLayout;

export { generateMetadata } from './metadata';

export const generateViewport = async (props: DynamicLayoutProps): ResolvingViewport => {
  const isMobile = await RouteVariants.getIsMobile(props);

  const dynamicScale = isMobile ? { maximumScale: 1, userScalable: false } : {};

  return {
    ...dynamicScale,
    initialScale: 1,
    minimumScale: 1,
    themeColor: [
      { color: '#f8f8f8', media: '(prefers-color-scheme: light)' },
      { color: '#000', media: '(prefers-color-scheme: dark)' },
    ],
    viewportFit: 'cover',
    width: 'device-width',
  };
};

export const generateStaticParams = () => {
  const themes: ThemeAppearance[] = ['dark', 'light'];
  const mobileOptions = [true, false];
  // only static for serveral page, other go to dynamtic
  const staticLocales = [DEFAULT_LANG, 'zh-CN'];

  const variants: { variants: string }[] = [];

  for (const locale of staticLocales) {
    for (const theme of themes) {
      for (const isMobile of mobileOptions) {
        variants.push({
          variants: RouteVariants.serializeVariants({ isMobile, locale, theme }),
        });
      }
    }
  }

  return variants;
};


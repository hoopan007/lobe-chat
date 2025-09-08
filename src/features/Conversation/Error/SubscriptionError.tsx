import { Icon } from '@lobehub/ui';
import { Button } from 'antd';
import { ExternalLink } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { useSlarkConfig } from '@/hooks/useSlarkConfig';
import { useChatStore } from '@/store/chat';
import { ChatMessageError } from '@/types/message';
import { ChatErrorType } from '@/types/fetch';

import { ErrorActionContainer } from './style';

interface SubscriptionErrorProps {
  error?: ChatMessageError;
  id: string;
}

const SubscriptionError = memo<SubscriptionErrorProps>(({ error, id }) => {
  const { t } = useTranslation('error');
  const [deleteMessage] = useChatStore((s) => [s.deleteMessage]);
  const { config: slarkConfig } = useSlarkConfig();
  
  // 从运行时配置获取 Slark 相关 URL，解决生产环境环境变量无法获取的问题
  const slarkBaseUrl = slarkConfig?.SLARK_URL || '';
  const slarkSettingsPath = slarkConfig?.SLARK_PATH_SETTINGS || '';
  const slarkPricingPath = slarkConfig?.SLARK_PATH_PRICING || '';
  
  const slarkSettingsUrl = slarkBaseUrl + slarkSettingsPath;
  const slarkPricingUrl = slarkBaseUrl + slarkPricingPath;
  
  let targetUrl = slarkBaseUrl;
  let buttonText = t('unlock.subscription.subscriptionError');
  switch (error?.type) {
    case ChatErrorType.SubscriptionRequired: {
      targetUrl = slarkPricingUrl;
      buttonText = t('unlock.subscription.subscriptionRequired');
      break;
    }
    case ChatErrorType.SubscriptionExpired: {
      targetUrl = slarkSettingsUrl;
      buttonText = t('unlock.subscription.subscriptionExpired');
      break;
    }
    case ChatErrorType.SubscriptionLimited: {
      targetUrl = slarkSettingsUrl;
      buttonText = t('unlock.subscription.subscriptionLimited');
      break;
    }
    default: {
      break;
    }
  }
  
  return (
    <ErrorActionContainer>
      <Flexbox gap={16} width={'100%'}>
        <Button
          block
          icon={<Icon icon={ExternalLink} />}
          onClick={() => {
            console.log('targetUrl', targetUrl);
            window.open(targetUrl, '_blank');
          }}
          type={'primary'}
        >
          {buttonText}
        </Button>
        <Button
          onClick={() => {
            deleteMessage(id);
          }}
        >
          {t('unlock.closeMessage')}
        </Button>
      </Flexbox>
    </ErrorActionContainer>
  );
});

export default SubscriptionError; 
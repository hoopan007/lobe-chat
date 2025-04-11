import { Icon } from '@lobehub/ui';
import { Button } from 'antd';
import { ExternalLink } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { useChatStore } from '@/store/chat';
import { ChatMessageError } from '@/types/message/chat';
import { ChatErrorType } from '@/types/fetch';

import { ErrorActionContainer } from './style';

interface SubscriptionErrorProps {
  error?: ChatMessageError;
  id: string;
}

const SubscriptionError = memo<SubscriptionErrorProps>(({ error, id }) => {
  const { t } = useTranslation('error');
  const [deleteMessage] = useChatStore((s) => [s.deleteMessage]);
  const slarkUrl = process.env.NEXT_PUBLIC_SLARK_URL;
  
  let targetUrl = slarkUrl;
  let buttonText = t('unlock.subscription.subscriptionError');
  switch (error?.type) {
    case ChatErrorType.SubscriptionRequired:
      targetUrl = `${slarkUrl}?test=1`;
      buttonText = t('unlock.subscription.subscriptionRequired');
      break;
    case ChatErrorType.SubscriptionExpired:
      targetUrl = `${slarkUrl}?test=2`;
      buttonText = t('unlock.subscription.subscriptionExpired');
      break;
    case ChatErrorType.SubscriptionLimited:
      targetUrl = `${slarkUrl}?test=3`;
      buttonText = t('unlock.subscription.subscriptionLimited');
      break;
    default:
      break;
  }
  
  return (
    <ErrorActionContainer>
      <Flexbox gap={16} width={'100%'}>
        <Button
          block
          icon={<Icon icon={ExternalLink} />}
          onClick={() => {
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
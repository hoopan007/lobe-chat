import { Icon } from '@lobehub/ui';
import { Button } from 'antd';
import { ExternalLink } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { useChatStore } from '@/store/chat';

import { ErrorActionContainer } from './style';

interface SubscriptionErrorProps {
  id: string;
  subscriptionStatus?: string; // 由API返回的状态
}

const SubscriptionError = memo<SubscriptionErrorProps>(({ id, subscriptionStatus }) => {
  const { t } = useTranslation('error');
  const [deleteMessage] = useChatStore((s) => [s.deleteMessage]);
  
  return (
    <ErrorActionContainer>
      <Flexbox gap={16} width={'100%'}>
        <Button
          block
          icon={<Icon icon={ExternalLink} />}
          onClick={() => {
            window.open('https://www.google.com', '_blank');
          }}
          type={'primary'}
        >
          升级账户 {subscriptionStatus || ''}
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
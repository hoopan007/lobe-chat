import { ApiClient } from './api';

const AppId = 'lobe';

// 创建实例
const api = new ApiClient(process.env.RYLAI_API_URL || '', {
  headers: {
    'rylai-gateway-key': process.env.RYLAI_API_KEY || '',
  },
});

export interface UserSubscription {
  is_subscribed?: number;
  oneai_base_url?: string;
  oneai_token?: string;
  plan_id?: number;
  user_subscription_id?: number;
  valid_until?: string;
}

// 查询用户订阅
export const getUserSubscription = async (userId: string): Promise<UserSubscription> => {
  try {
    const response = await api.get<{ code: number; data: UserSubscription; message: string }>(
      '/gateway/user/get-subscription',
      {
        app_id: AppId,
        sso_user_id: userId,
      },
    );
    const { data, code, message } = response;
    if (code === 0) {
      return data;
    } else {
      throw new Error(message || 'Unknown error');
    }
  } catch (error) {
    console.error('Failed to get user subscription:', error);
    return {};
  }
};

export interface UserFileStorage {
  active_size: number;
  total_size: number;
  used_size: number;
}

// 查询用户文件存储
export const getUserFileStorage = async (userId: string): Promise<UserFileStorage> => {
  try {
    const response = await api.get<{ code: number; data: UserFileStorage; message: string }>(
      '/gateway/user-subscriptions/get-user-file-storage',
      {
        app_id: AppId,
        sso_user_id: userId,
      },
    );
    const { data, code, message } = response;
    if (code === 0) {
      return data;
    } else {
      throw new Error(message || 'Unknown error');
    }
  } catch (error) {
    console.error('Failed to get user file storage:', error);
    return { active_size: 0, total_size: 0, used_size: 0 };
  }
};

// POST 请求
// const createData = async () => {
//   try {
//     const response = await api.post<{ id: number }>('/users', {
//       name: 'John',
//       email: 'john@example.com'
//     });
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// };

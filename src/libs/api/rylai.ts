import { ApiClient } from './api';

const AppId = 'lobe';

// 创建实例
const api = new ApiClient(process.env.RYLAI_API_URL || '', {
  headers: {
    'rylai-gateway-key': process.env.RYLAI_API_KEY || '',
  },
});

export interface UserSubscription {
  credits_token: string;
  status: string;
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
    return { credits_token: '', status: '500' };
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

export interface UserVectorStorage {
  active_count: number;
  total_count: number;
  used_count: number;
}

// 查询用户向量存储
export const getUserVectorStorage = async (userId: string): Promise<UserVectorStorage> => {
  try {
    const response = await api.get<{ code: number; data: UserVectorStorage; message: string }>(
      '/gateway/user-subscriptions/get-user-vector-storage',
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
    console.error('Failed to get user vector storage:', error);
    return { active_count: 0, total_count: 0, used_count: 0 };
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

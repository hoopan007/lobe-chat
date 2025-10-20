import { GoogleGenAIOptions } from '@google/genai';
import { ModelRuntime } from '@lobechat/model-runtime';
import { LobeVertexAI } from '@lobechat/model-runtime/vertexai';
import { ClientSecretPayload } from '@lobechat/types';
import { safeParseJSON } from '@lobechat/utils';
import { ModelProvider } from 'model-bank';

import { getLLMConfig } from '@/envs/llm';
import { getUserSubscription } from '@/libs/api/rylai';
import { ChatErrorType } from '@/types/fetch';

import apiKeyManager from './apiKeyManager';

export * from './trace';

/**
 * Retrieves the options object from environment and apikeymanager
 * based on the provider and payload.
 *
 * @param provider - The model provider.
 * @param payload - The JWT payload.
 * @returns The options object.
 */
const getParamsFromPayload = (provider: string, payload: ClientSecretPayload) => {
  const llmConfig = getLLMConfig() as Record<string, any>;

  switch (provider) {
    case ModelProvider.VertexAI: {
      return {};
    }

    default: {
      let upperProvider = provider.toUpperCase();

      if (!(`${upperProvider}_API_KEY` in llmConfig)) {
        upperProvider = ModelProvider.OpenAI.toUpperCase(); // Use OpenAI options as default
      }

      const apiKey = apiKeyManager.pick(payload?.apiKey || llmConfig[`${upperProvider}_API_KEY`]);
      const baseURL = payload?.baseURL || process.env[`${upperProvider}_PROXY_URL`];

      return baseURL ? { apiKey, baseURL } : { apiKey };
    }

    case ModelProvider.Ollama: {
      const baseURL = payload?.baseURL || process.env.OLLAMA_PROXY_URL;

      return { baseURL };
    }

    case ModelProvider.Azure: {
      const { AZURE_API_KEY, AZURE_API_VERSION, AZURE_ENDPOINT } = llmConfig;
      const apiKey = apiKeyManager.pick(payload?.apiKey || AZURE_API_KEY);
      const baseURL = payload?.baseURL || AZURE_ENDPOINT;
      const apiVersion = payload?.azureApiVersion || AZURE_API_VERSION;
      return { apiKey, apiVersion, baseURL };
    }

    case ModelProvider.AzureAI: {
      const { AZUREAI_ENDPOINT, AZUREAI_ENDPOINT_KEY } = llmConfig;
      const apiKey = payload?.apiKey || AZUREAI_ENDPOINT_KEY;
      const baseURL = payload?.baseURL || AZUREAI_ENDPOINT;
      return { apiKey, baseURL };
    }

    case ModelProvider.Bedrock: {
      const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SESSION_TOKEN } = llmConfig;
      let accessKeyId: string | undefined = AWS_ACCESS_KEY_ID;
      let accessKeySecret: string | undefined = AWS_SECRET_ACCESS_KEY;
      let region = AWS_REGION;
      let sessionToken: string | undefined = AWS_SESSION_TOKEN;
      // if the payload has the api key, use user
      if (payload.apiKey) {
        accessKeyId = payload?.awsAccessKeyId;
        accessKeySecret = payload?.awsSecretAccessKey;
        sessionToken = payload?.awsSessionToken;
        region = payload?.awsRegion;
      }
      return { accessKeyId, accessKeySecret, region, sessionToken };
    }

    case ModelProvider.Cloudflare: {
      const { CLOUDFLARE_API_KEY, CLOUDFLARE_BASE_URL_OR_ACCOUNT_ID } = llmConfig;

      const apiKey = apiKeyManager.pick(payload?.apiKey || CLOUDFLARE_API_KEY);
      const baseURLOrAccountID =
        payload.apiKey && payload.cloudflareBaseURLOrAccountID
          ? payload.cloudflareBaseURLOrAccountID
          : CLOUDFLARE_BASE_URL_OR_ACCOUNT_ID;

      return { apiKey, baseURLOrAccountID };
    }

    case ModelProvider.GiteeAI: {
      const { GITEE_AI_API_KEY } = llmConfig;

      const apiKey = apiKeyManager.pick(payload?.apiKey || GITEE_AI_API_KEY);

      return { apiKey };
    }

    case ModelProvider.Github: {
      const { GITHUB_TOKEN } = llmConfig;

      const apiKey = apiKeyManager.pick(payload?.apiKey || GITHUB_TOKEN);

      return { apiKey };
    }

    case ModelProvider.OllamaCloud: {
      const { OLLAMA_CLOUD_API_KEY } = llmConfig;

      const apiKey = apiKeyManager.pick(payload?.apiKey || OLLAMA_CLOUD_API_KEY);

      return { apiKey };
    }

    case ModelProvider.TencentCloud: {
      const { TENCENT_CLOUD_API_KEY } = llmConfig;

      const apiKey = apiKeyManager.pick(payload?.apiKey || TENCENT_CLOUD_API_KEY);

      return { apiKey };
    }
  }
};

const buildVertexOptions = (
  payload: ClientSecretPayload,
  params: Partial<GoogleGenAIOptions> = {},
): GoogleGenAIOptions => {
  const rawCredentials = payload.apiKey ?? process.env.VERTEXAI_CREDENTIALS ?? '';
  const credentials = safeParseJSON<Record<string, string>>(rawCredentials);

  const projectFromParams = params.project as string | undefined;
  const projectFromCredentials = credentials?.project_id;
  const projectFromEnv = process.env.VERTEXAI_PROJECT;

  const project = projectFromParams ?? projectFromCredentials ?? projectFromEnv;
  const location =
    (params.location as string | undefined) ?? payload.vertexAIRegion ?? process.env.VERTEXAI_LOCATION ?? undefined;

  const googleAuthOptions = params.googleAuthOptions ?? (credentials ? { credentials } : undefined);

  const options: GoogleGenAIOptions = {
    ...params,
    vertexai: true,
  };

  if (googleAuthOptions) options.googleAuthOptions = googleAuthOptions;
  if (project) options.project = project;
  if (location) options.location = location as GoogleGenAIOptions['location'];

  return options;
};

/**
 * Initializes the agent runtime with the user payload in backend
 * @param provider - The provider name.
 * @param payload - The JWT payload.
 * @param params
 * @returns A promise that resolves when the agent runtime is initialized.
 */
export const initModelRuntimeWithUserPayload = async (
  provider: string,
  payload: ClientSecretPayload,
  params: any = {},
) => {
  const runtimeProvider = payload.runtimeProvider ?? provider;

<<<<<<< HEAD
  // user subscription
  if (payload.userId) {
    try {
      if (!process.env.ONEAI_API_URL) {
        throw new Error('ONEAI_API_URL is not set');
      }
      const subscription = await getUserSubscription(payload.userId);
      if (subscription.status === '200') {
        payload.baseURL = process.env.ONEAI_API_URL;
        payload.apiKey = subscription.credits_token;
      } else {
        // 根据subscription status返回不同错误类型
        const subscriptionStatus = subscription.status;
        let errorType = '';
        
        // 根据状态设置不同的错误类型
        switch (subscriptionStatus) {
          case '401': {
            errorType = ChatErrorType.SubscriptionRequired as any;
            break;
          }
          case '402': {
            errorType = ChatErrorType.SubscriptionExpired as any;
            break;
          }
          case '403': {
            errorType = ChatErrorType.SubscriptionLimited as any;
            break;
          }
          default: {
            errorType = ChatErrorType.SubscriptionError as any;
          }
        }
        
        // 不要抛出普通错误，使用createErrorResponse
        throw {
          body: { 
            provider
          },
          errorType,
          message: `User subscription error: ${subscriptionStatus}`
        };
      }
    } catch (error: any) {
      console.error('Failed to get user subscription:', error);
      
      throw error;
    }
  }


=======
  if (runtimeProvider === ModelProvider.VertexAI) {
    const vertexOptions = buildVertexOptions(payload, params);
    const runtime = LobeVertexAI.initFromVertexAI(vertexOptions);

    return new ModelRuntime(runtime);
  }

>>>>>>> upstream/main
  return ModelRuntime.initializeWithProvider(runtimeProvider, {
    ...getParamsFromPayload(runtimeProvider, payload),
    ...params,
  });
};

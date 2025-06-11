import { NextResponse } from 'next/server';

export async function GET() {
  // 调试：查看所有环境变量
  const allEnvs = Object.keys(process.env)
    .filter(key => key.includes('SLARK'))
    .reduce((acc, key) => {
      acc[key] = process.env[key];
      return acc;
    }, {} as Record<string, string | undefined>);

  // 尝试不同的环境变量读取方式
  const slarkUrl = process.env.NEXT_PUBLIC_SLARK_URL || 
                   process.env.SLARK_URL || 
                   '';
  const slarkSettingsPath = process.env.NEXT_PUBLIC_SLARK_PATH_SETTINGS || 
                           process.env.SLARK_PATH_SETTINGS || 
                           '';
  const slarkPricingPath = process.env.NEXT_PUBLIC_SLARK_PATH_PRICING || 
                          process.env.SLARK_PATH_PRICING || 
                          '';

  return NextResponse.json({
    // 配置值
    NEXT_PUBLIC_SLARK_PATH_PRICING: slarkPricingPath,
    NEXT_PUBLIC_SLARK_PATH_SETTINGS: slarkSettingsPath,
    NEXT_PUBLIC_SLARK_URL: slarkUrl,
    // 调试信息
    debug: {
      allSlarkEnvs: allEnvs,
      directAccess: {
        NEXT_PUBLIC_SLARK_URL: process.env.NEXT_PUBLIC_SLARK_URL,
        SLARK_URL: process.env.SLARK_URL,
      },
      nodeEnv: process.env.NODE_ENV,
      processEnvKeys: Object.keys(process.env).length,
    },
  });
} 
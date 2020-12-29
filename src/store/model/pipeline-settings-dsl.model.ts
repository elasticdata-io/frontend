import { TelegramHookProvider } from '@/store/model/hook/telegram-hook-provider.model';
import { WebHookProvider } from '@/store/model/hook/web-hook-provider.model';

export interface PipelineSettingsHook {
    provider: WebHookProvider | TelegramHookProvider,
}

export interface PipelineSettings {
    hooks: Array<PipelineSettingsHook>,
    window: {
        width: number,
        height: number,
        lang: string,
    },
    needProxyRotation: boolean,
    proxies: string[],
    network: {
        skipResources: {
            stylesheet: boolean,
            image: boolean,
            font: boolean,
        }
    },
    userInteraction: {
        watchCommands: Array<object>,
    },
    maxWorkingMinutes: number,
}
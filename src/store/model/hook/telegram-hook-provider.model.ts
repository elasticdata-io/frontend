import { HookProvider } from './hook-provider.model';

export interface TelegramHookProvider extends HookProvider {
    type: 'telegram',
    chatId: number | string,
}
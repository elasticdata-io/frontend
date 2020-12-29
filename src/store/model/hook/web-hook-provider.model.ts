import { HookProvider } from './hook-provider.model';

export interface WebHookProvider extends HookProvider {
    type: 'web',
    callbackUrl: string,
}
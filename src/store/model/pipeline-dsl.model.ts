import { PipelineSettings } from '@/store/model/pipeline-settings-dsl.model';

export interface PipelineDsl {
    commands: Array<object>,
    dataRules: Array<object>,
    settings: PipelineSettings,
    version: string,
}
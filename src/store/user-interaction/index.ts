import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import * as getter from './getters';

export interface ExecuteCommand {
    commands: any[];
    userInteractionId: string;
    taskId: string;
    pageContext: string;
}

export interface UserInteraction {
    id: string;
    jpegScreenshotLink: string;
    pageWidthPx: number;
    pageHeightPx: number;
    pageElements: any[];
    currentUrl: string;
    pageContext: string;
    taskId: string;
    userId: string;
    pipelineId: string;
    status: string;
    pipelineStatus: string;
    createdOnUtc: Date;
    modifiedOnUtc: Date;
    endOnUtc: Date;
    expiredOnUtc: Date;
}

interface State {
    userInteractions: Map<string, UserInteraction>;
    loading: boolean;
}

const state: State = {
	userInteractions: new Map<string, UserInteraction>(),
	loading: false,
};

const mutations = {
	[mutation.SET_LOADING_USER_INTERACTIONS](state, loading) {
		Vue.set(state, 'loading', loading);
	},

	[mutation.SET_USER_INTERACTIONS](state: State, userInteractions: Array<UserInteraction>) {
        state.userInteractions.clear();
        const data = userInteractions || [];
        data.forEach(x => state.userInteractions.set(x.id, x));
		Vue.set(state, 'userInteractions', new Map(state.userInteractions));
	},

	[mutation.UPSERT_USER_INTERACTION](state: State, userInteraction: UserInteraction) {
        const has = state.userInteractions.has(userInteraction.id)
        if (has) {
            state.userInteractions.delete(userInteraction.id);
        }
        state.userInteractions.set(userInteraction.id, userInteraction);
        Vue.set(state, 'userInteractions', new Map(state.userInteractions));
	},
};

const actions = {
	async [action.FETCH_USER_INTERACTIONS]({ commit, state }, { taskId }) {
		commit(mutation.SET_LOADING_USER_INTERACTIONS, true);
		if (state.fetch) {
            state.fetch.abort();
		}
        try {
            const before = request => (state.fetch = request);
            const res = await Vue.http.get(`/api/task-user-interaction/${taskId}`, { before });
            const data = res.body;
            commit(mutation.SET_USER_INTERACTIONS, data);
        } finally {
            commit(mutation.SET_LOADING_USER_INTERACTIONS, false);
        }
	},

	async [action.UPSERT_USER_INTERACTION]({ commit, state }, userInteraction: UserInteraction) {
        commit(mutation.UPSERT_USER_INTERACTION, userInteraction);
	},

	async [action.EXECUTE_COMMAND]({ commit, state }, executeCommand: ExecuteCommand) {
        await Vue.http.post(`/api/task/execute-command/v2`, JSON.stringify(executeCommand));
	},
};

const getters = {
	[getter.USER_INTERACTIONS]: (state: State) => {
        return Array.from(state.userInteractions, ([key, value]) => (value));
    },
	[getter.FIND_USER_INTERACTION_BY_ID]: (state: State) => id => {
        const userInteractions = state.userInteractions;
        return userInteractions.get(id) || {};
    },
	[getter.LOADING_USER_INTERACTIONS]: (state: State) => state.loading,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};

import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import * as getter from './getters';

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
    userInteractions: UserInteraction[];
    loading: boolean;
}

const state: State = {
	userInteractions: [],
	loading: false,
};

const mutations = {
	[mutation.SET_LOADING_USER_INTERACTIONS](state, loading) {
		Vue.set(state, 'loading', loading);
	},

	[mutation.SET_USER_INTERACTIONS](state: State, userInteractions) {
		Vue.set(state, 'userInteractions', userInteractions);
	},

	[mutation.UPSERT_USER_INTERACTION](state: State, userInteraction: UserInteraction) {
        const index = state.userInteractions.findIndex(x => x.id === userInteraction.id);
        if (index === -1) {
            state.userInteractions.push(userInteraction);
            return;
        }
        state.userInteractions[index] = userInteraction;
        Vue.set(state, 'userInteractions', state.userInteractions);
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
            const data = res.body || [];
            commit(mutation.SET_USER_INTERACTIONS, data);
        } finally {
            commit(mutation.SET_LOADING_USER_INTERACTIONS, false);
        }
	},

	async [action.UPSERT_USER_INTERACTION]({ commit, state }, userInteraction: UserInteraction) {
        commit(mutation.UPSERT_USER_INTERACTION, userInteraction);
	},
};

const getters = {
	[getter.USER_INTERACTIONS]: (state: State) => state.userInteractions || [],
	[getter.FIND_USER_INTERACTION_BY_ID]: (state: State) => id => {
        const userInteractions = state.userInteractions || [];
        return userInteractions.find(x => x.id === id);
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

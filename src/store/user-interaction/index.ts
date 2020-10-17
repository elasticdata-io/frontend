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
	[mutation.SET_LOADING](state, loading) {
		Vue.set(state, 'loading', loading);
	},

	[mutation.SET_USER_INTERACTIONS](state, userInteractions) {
		Vue.set(state, 'userInteractions', userInteractions);
	},
};

const actions = {
	async [action.FETCH_USER_INTERACTIONS]({ commit, state }, { taskId }) {
		commit(mutation.SET_LOADING, true);
		if (state.fetch) {
            state.fetch.abort();
		}
        try {
            const before = request => (state.fetch = request);
            const res = await Vue.http.get(`/api/task-user-interaction/${taskId}`, { before });
            const data = res.body || [];
            commit(mutation.SET_USER_INTERACTIONS, data);
        } catch (e) {
            commit(mutation.SET_LOADING, false);
            throw e;
        }
	},
};

const getters = {
	[getter.USER_INTERACTIONS]: state => state.userInteractions || [],
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};

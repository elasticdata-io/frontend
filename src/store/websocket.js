import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Vue from 'vue';

let stompClient = null;
const protocol = window.location.protocol;
const hostname = window.location.hostname;
const apiPort = hostname.includes('localhost') ? 8080 : window.location.port;
const wsUrl = `${protocol}//${hostname}:${apiPort}/ws`;

const reconnectTimeout = 1 * 1000; // in ms

let subscribes = [];

let reconnectId;

function stompFailureCallback(error) {
	console.warn('ws is disconnected: ', error);
	if (!reconnectId) {
		reconnectId = setInterval(stompConnect, reconnectTimeout);
	}
}

function stompConnect() {
	const token = Vue.localStorage.get('token');
	if (!token) {
		console.error('token must be specified');
		return;
	}
	console.info('ws try reconnecting');
	const sock = new SockJS(wsUrl);
	stompClient = Stomp.over(sock);
	stompClient.connect(
		{ 'Auth-Token': token },
		() => {
			init();
		},
		stompFailureCallback
	);
}

function init() {
	console.info('ws is connected', reconnectId);
	if (reconnectId) {
		clearInterval(reconnectId);
	}
	subscribes.forEach(config =>
		stompClient.subscribe(config.message, config.fn.bind(config.scope))
	);
}

function subscribe(message, fn, scope) {
	subscribes.push({
		message: message,
		fn: fn,
		scope: scope,
	});
}

export { stompClient, subscribe, stompConnect };

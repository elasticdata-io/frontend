<template>
	<cmd-layout :cmd="cmd" @mode="switchMode" :examples="command.examples">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>завантаження веб сторінки (url адреси)</strong>
			</p>
		</div>
	</cmd-layout>
</template>
<script>
import CmdLayout from './CmdLayout';
import CmdDoc from './CmdDoc';

export default {
	name: 'openurl',
	mixins: [CmdDoc],
	components: {
		CmdLayout,
	},
	computed: {},
	data: () => {
		return {};
	},
	methods: {},
};
</script>

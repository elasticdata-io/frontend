<template>
	<v-avatar size="30">
		<img :src="picture" />
	</v-avatar>
</template>
<script>
export default {
	name: 'AvatarIcon',
	computed: {},
	methods: {},
	props: {
		picture: {
			type: String,
			required: false,
			default: '/default-user.png',
		},
	},
};
</script>
picture

<template>
	<div class="w-screen h-screen bg-gray-400">
		<TheTable />
		<UserDetail />
	</div>
</template>

<script>
  import TheTable from '@/components/TheTable.vue';
  import UserDetail from '@/components/UserDetail';

  export default {
    name: 'App',
    components: {
      TheTable,
      UserDetail
    }
  };
</script>
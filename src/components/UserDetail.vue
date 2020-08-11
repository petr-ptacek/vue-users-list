<template>
	<div class="border-2 border-black">
		<div class="flex flex-col items-center bg-white">
			<div class="flex items-center justify-center p-3 w-64 h-auto">
				<img class="block rounded-full"
				     :src="avatar"
				     :alt="`${firstName} ${lastName}`">
			</div>

			<div>
				<div class="grid grid-cols-2  gap-1 xl:grid-cols-3">
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">First Name:</div>&nbsp;
						<div>{{ firstName }}</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Last Name:</div>&nbsp;
						<div>{{ lastName }}</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Gender:</div>&nbsp;
						<div>{{ gender }}</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Age:</div>&nbsp;
						<div>{{ age }}</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Status:</div>&nbsp;
						<div>{{ status ? 'ACTIVE' : 'INACTIVE' }}</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Birth date:</div>&nbsp;
						<div>{{ dob | formatDate }}</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Address:</div>&nbsp;
						<div v-html="address"></div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Phone:</div>&nbsp;
						<div>{{ phone }}</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Email:</div>&nbsp;
						<div>{{ email }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  export default {
    name: 'UserDetail',
    props: {
      user: { type: Object, required: false, default: () => ({}) }
    },
    filters: {
      formatDate(v) {
        const d = new Date(v);
        const year = d.getFullYear();
        const month = d.getMonth() + 1 < 10 ? `0${ d.getMonth() + 1 }` : d.getMonth() + 1;
        const date = d.getDate() < 10 ? `0${ d.getDate() }` : d.getDate();
        return `${ year }.${ month }.${ date }`;
      }
    },
    computed: {
      firstName() { return this?.user?.firstName ?? ''; },
      lastName() { return this?.user?.lastName ?? ''; },
      gender() { return this?.user?.gender ?? ''; },
      age() { return this?.user?.age ?? ''; },
      dob() { return this?.user?.dob ?? ''; },
      email() { return this?.user?.email ?? ''; },
      phone() { return this?.user?.phone ?? ''; },
      avatar() { return this?.user?.avatar ?? ''; },
      status() { return this?.user?.active ?? ''; },
      address() {
        const { address } = this.user;
        if ( !address ) return '';

        const { city, state, country, streetAddress, zipCode } = address;
        return `${ country }<br>${ city }<br>${ state }<br>${ streetAddress }`;
      }
    }
  };
</script>
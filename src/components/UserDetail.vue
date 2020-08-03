<template>
	<div class="border-2 border-gray-500">
		<div class="flex flex-col items-center bg-white">
			<div class="flex items-center p-3 w-64 h-auto">
				<img class="block rounded-full" src="https://lorempixel.com/250/250/people/?65007" alt="faf">
			</div>

			<div>
				<div class="grid grid-cols-2  gap-1 xl:grid-cols-3">
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">First Name:</div>&nbsp;
						<div>Kellie</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Last Name:</div>&nbsp;
						<div>Heaney</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Age:</div>&nbsp;
						<div>12</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Gender:</div>&nbsp;
						<div>female</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Status:</div>&nbsp;
						<div>active</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Email:</div>&nbsp;
						<div>wolf.joan@example.org</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Address:</div>&nbsp;
						<div>74320 McCullough Lakes South Emil, MT 23247</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Phone:</div>&nbsp;
						<div>1-729-783-7270 x3388</div>
					</div>
					<div class="flex flex-col p-2">
						<div class="font-bold mr-1">Birth date:</div>&nbsp;
						<div>2008-03-20</div>
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
    }
  };
</script>
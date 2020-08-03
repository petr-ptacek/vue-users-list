<template>
	<div class="p-4 bg-white flex flex-col justify-center">
		<div class="flex justify-center items-center">
			<div class="p-3 flex flex-col ">
				<h1 class="text-center mb-2 text-xl font-semibold">List of users</h1>
				<TheTable v-show="!loading"
				          :column-defs="columnDefs"
				          :datasource="displayedUsers"
				          @on-row-selected="onRowSelectedHandler"
				>
					<template #td="{ rowData, colData, colId, colDef }">
						<img v-if="colId === 'avatar'"
						     class="inline-block rounded-full h-auto w-12"
						     :alt="`${rowData.first_name}
				     ${rowData.last_name}`"
						     :src="colData" />
						<span v-else>{{ colData }}</span>
					</template>
				</TheTable>
				<div v-show="loading"
				     ref="table-preloader"
				     style="min-width: 750px;min-height: 600px"
				     class="flex justify-center items-center">
					Fetching data ...
				</div>

				<div class="flex mt-2 items-center justify-between">
					<button
							style="min-width: 105px;"
							:disabled="disabledPreviousBtn"
							class="btn flex justify-center items-center"
							@click="previousPage"
					>
						<svg class="w-4 h-4 mr-1 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						<span>Previous</span>
					</button>
					<span>Current page: <strong>{{ meta.currentPage }}</strong></span>
					<button
							style="min-width: 105px;"
							:disabled="disabledNextBtn"
							class="btn flex justify-center items-center"
							@click="nextPage"
					>
						<span>Next</span>
						<svg class="w-4 h-4 ml-1 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
						</svg>
					</button>
				</div>
			</div>

			<div class="p-3 max-w-4xl">
				<UserDetail class="p-3 shadow-2xl" />
			</div>
		</div>
	</div>
</template>

<script>
  import TheTable from '@/components/TheTable.vue';
  import UserDetail from '@/components/UserDetail';

  import { uuid } from '@/utils';
  import { fetchUsers } from '@/api';

  export default {
    name: 'App',
    data() {
      return {
        columnDefs: [
          {
            headerName: 'Index',
            field: '_index',
            colId: '_index',
            sortable: false,
            visible: false
          },
          {
            headerName: 'ID',
            field: 'id',
            colId: 'id',
            sortable: false,
            visible: false
          },
          {
            headerName: 'First Name',
            field: 'first_name',
            colId: 'first_name',
            sortable: true,
            visible: true
          },
          {
            headerName: 'Last Name',
            field: 'last_name',
            colId: 'last_name',
            sortable: true,
            visible: true
          },
          {
            headerName: 'Age',
            field: 'age',
            colId: 'age',
            sortable: true,
            visible: true
          },
          {
            headerName: 'Gender',
            field: 'gender',
            colId: 'gender',
            sortable: true,
            visible: true
          },
          {
            headerName: 'Status',
            field: 'status',
            colId: 'status',
            sortable: true,
            visible: true
          },
          {
            headerName: 'Email',
            field: 'email',
            colId: 'email',
            sortable: true,
            visible: true
          },
          {
            headerName: 'Phone',
            field: 'phone',
            colId: 'phone',
            sortable: true,
            visible: false
          },
          {
            headerName: 'Avatar',
            field: '_links.avatar.href',
            colId: 'avatar',
            sortable: false,
            visible: true
          },
        ],
        users: [],
        loading: false,
        meta: {
          totalCount: 0,
          pageCount: 0,
          currentPage: 1,
          perPage: 10
        }
      };
    },

    computed: {
      displayedUsers() {
        const { currentPage, perPage } = this.meta;

        return this.users.slice(
            (currentPage - 1) * perPage,
            currentPage * perPage
        );
      },
      disabledPreviousBtn() {
        return (this.meta.currentPage - 1) < 1;
      },
      disabledNextBtn() {
        return (this.meta.currentPage + 1) > this.meta.pageCount;
      }
    },

    watch: {
      'meta.currentPage'(value) {
        if ( value * this.meta.perPage > this.users.length ) {
          this.fetchUsers(value - 1);
        }
      }
    },

    created() {
      this.fetchUsers();
    },

    methods: {
      onRowSelectedHandler({ rowData }) {
        debugger
      },

      previousPage() {
        this.meta.currentPage--;
      },

      nextPage() {
        this.meta.currentPage++;
      },

      async fetchUsers(page = this.meta.currentPage) {
        this.loading = true;

        let response;
        try {
          response = await fetchUsers(page);
        } catch ( e ) {
          alert(e.toString());
        }

        this.users =
            [
              ...this.users,
              ...response.result.map((user, index) => ({
                ...user,
                age: new Date().getFullYear() - new Date(user.dob).getFullYear(),
                $uuid: uuid(),
                $index: this.users.length + index
              }))
            ];

        const { perPage, currentPage, totalCount, pageCount } = response._meta;

        this.meta.totalCount = totalCount;
        this.meta.pageCount = Math.ceil(totalCount / this.meta.perPage);

        this.loading = false;
      }
    },
    components: {
      TheTable,
      UserDetail
    }
  };
</script>
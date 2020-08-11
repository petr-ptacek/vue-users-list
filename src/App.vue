<template>
	<div class="p-4 bg-white flex flex-col justify-center w-full h-full">
		<div class="flex justify-center items-center w-full h-full">
			<div class="p-1 flex flex-col w-1/2 h-full">
				<h1 class="text-center mb-2 text-xl font-semibold">List of users</h1>
				<div>
					<TheTable v-show="!loading"
					          class="w-full h-full"
					          :column-defs="columnDefs"
					          :datasource="displayedUsers"
					          @row-select="onRowSelectHandler"
					          @row-deselect="onRowDeselectHandler"
					          @row-click="onRowClickHandler"
					          @sort-model-change="onTableSortModelChange"
					>
						<template #td="{ rowData, colData, colId, colDef }">
							<img v-if="colId === 'avatar'"
							     class="inline-block rounded-full h-auto w-12"
							     :alt="`${rowData.firstName} ${rowData.lastName}`"
							     :src="colData"
							     @error="imgFetchErrorHandler(rowData)"
							/>
							<span v-else-if="colId === 'active'"
							      class="w-5 h-5 rounded-full block"
							      :class="[ rowData.active ? 'bg-green-600' : 'bg-red-600' ]"
							>
						</span>
							<span v-else>{{ colData }}</span>
						</template>
					</TheTable>
					<div v-show="loading"
					     ref="table-preloader"
					     style="min-width: 930px; min-height: 600px;"
					     class="flex justify-center items-center bg-gray-300 text-white font-semibold text-3xl">
						Fetching data ...
					</div>
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

			<!--USER DETAIL-->
			<div class="p-1 w-1/2 h-full flex flex-col">
				<h1 class="text-center mb-2 text-xl font-semibold">User Detail</h1>
				<UserDetail
						v-if="selectedUser"
						:user="selectedUser"
						class="p-3 shadow-2xl"
				/>
				<div v-else
				     class="bg-gray-300 text-white font-semibold text-3xl flex justify-center items-center"
				     style="min-height: 450px"
				>
					Select the user from the List of Users
				</div>
			</div>
			<!--./USER DETAIL-->
		</div>
	</div>
</template>

<script>
  import TheTable   from '@/components/TheTable.vue';
  import UserDetail from '@/components/UserDetail';

  const IS_PROD_MODE = process.env.NODE_ENV === 'production';

  import { COLUMN_DEFS }   from './config';
  import * as api          from '@/api';
  import avatarBlankMale   from '@/assets/img/avatar-blank-male.jpg';
  import avatarBlankFemale from '@/assets/img/avatar-blank-female.jpg';

  export default {
    name: 'App',
    data() {
      return {
        selectedUser: null,
        columnDefs: COLUMN_DEFS,
        sortModel: {},
        users: [],
        loading: false,
        meta: {
          original: {
            currentPage: 1,
            pagesCount: 0,
            perPage: 20
          },
          usersCount: 0,
          pageCount: 0,
          currentPage: 1,
          perPage: 10
        }
      };
    },

    computed: {
      displayedUsers() {
        const { currentPage, perPage } = this.meta;

        return this.sortedUsers
                   .slice(
                     (currentPage - 1) * perPage,
                     currentPage * perPage
                   );
      },
      sortedUsers() {
        const { sortModel } = this;
        if ( !Object.entries(sortModel).length ) return this.users;
        const colId = Object.keys(sortModel)[0];
        const sort = Object.values(sortModel)[0];
        let compareFn;

        let dir = sort === 'asc' ? 1 : -1;

        switch ( colId ) {
          case 'active':
            compareFn = (a, b) => (a.active - b.active) * dir;
            break;
          case 'age':
            compareFn = (a, b) => (a.age - b.age) * dir;
            break;
          case 'gender':
            compareFn = (a, b) => ((a.gender === 'female' ? 1 : 0) - (b.gender === 'female' ? 1 : 0)) * dir;
            break;
          case 'lastName':
            compareFn = (a, b) => a.lastName.localeCompare(b.lastName, undefined, { sensitivity: 'base' }) * dir;
            break;
          default:
            compareFn = (a, b) => 0;
            break;
        }

        return this.users
                   .slice(0)
                   .sort(compareFn);
      },
      disabledPreviousBtn() {
        return (this.meta.currentPage - 1) < 1 || this.loading;
      },
      disabledNextBtn() {
        return (this.meta.currentPage + 1) > this.meta.pageCount || this.loading;
      }
    },

    watch: {
      'meta.currentPage'(value) {
        if ( value * this.meta.perPage > this.users.length ) {
          this.fetchUsers(this.meta.original.currentPage + 1);
        }
      }
    },

    created() {
      this.fetchUsers(1);
    },

    methods: {
      onTableSortModelChange(sortModel) {
        this.sortModel = sortModel;
        this.meta.currentPage = 1;
      },
      onRowDeselectHandler({ rowData }) {
        this.selectedUser = null;
      },
      onRowSelectHandler({ rowData }) {
        this.selectedUser = this.users[rowData.$index];
      },
      onRowClickHandler({ rowData }) {
      },

      previousPage() {
        this.meta.currentPage--;
      },

      nextPage() {
        this.meta.currentPage++;
      },

      imgFetchErrorHandler(rowData) {
        const { $index, gender } = rowData;

        this.$set(
          this.users[$index],
          'avatar',
          gender === 'male' ? avatarBlankMale : avatarBlankFemale
        );
      },

      async fetchUsers(page = this.meta.currentPage) {
        this.loading = true;

        let response;
        try {
          response = await (IS_PROD_MODE ? api.fakeFetch : api.fetchUsers)(page);
        } catch ( e ) {
          alert(e.toString());
          return;
        }

        this.users =
          [
            ...this.users,
            ...response.results.map((user, index) => ({
              ...user,
              age: new Date().getFullYear() - new Date(user.dob).getFullYear(),
              $index: this.users.length + index
            }))
          ];

        const { usersCount, pagesCount, resultsCount, usersPerPage, currentPage } = response.meta;

        this.meta.original.perPage = usersPerPage;
        this.meta.original.currentPage = currentPage;
        this.meta.original.pagesCount = pagesCount;

        this.meta.usersCount = usersCount;
        this.meta.pageCount = Math.ceil(usersCount / this.meta.perPage);

        this.loading = false;
      }
    },
    components: {
      TheTable,
      UserDetail
    }
  };
</script>

<style lang="postcss">
	body {
		@apply w-screen h-screen;
	}
</style>
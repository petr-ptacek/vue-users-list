<template>
	<table class="border-collapse border-2 border-gray-800 text-center">
		<caption v-if="captionLabel" class="p-2 font-semibold text-lg">{{ captionLabel }}</caption>
		<thead>
		<tr>
			<th v-for="(colDef, $index) of columnDefs"
			    :key="colDef.colId"
			    :class="{
			      'cursor-pointer': colDef.sortable,
			       hidden: !colDef.visible,
			       'hover:bg-gray-400 hover:text-white': colDef.sortable
			    }"
			    class="border-b-2 font-bold text-lg border-black  text-gray-800"
			    @click="onTableHeadClickHandler({ colDef, index: $index })"
			>
				<div class="flex flex-row px-1 py-2 items-center justify-center">
					<span>{{ colDef.headerName }}</span>
					<span v-if="colDef.sortable && colDef.sort"
					      class="block ml-1 w-5 h-5">
						<span v-show="colDef.sort ==='asc'">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							    <path
									    d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
							</svg>
						</span>
						<span v-show="colDef.sort === 'des'">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							    <path
									    d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
							</svg>
						</span>
					</span>
				</div>
			</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="rowData of tableData"
		    :key="rowData.id"
		    class="cursor-pointer hover:text-white hover:bg-gray-400"
		    :class="{ 'bg-gray-500': selectedRow.id === rowData.id }"
		    @click="onRowClickedHandler(rowData)"
		>
			<td v-for="colDef of columnDefs"
			    :key="colDef.colId"
			    :class="[{ hidden: !colDef.visible }, colDef.classList]"
			    style="height: 55px;"
			>
				<slot name="td"
				      :row-data="rowData"
				      :col-data="rowData[colDef.colId]"
				      :col-id="colDef.colId"
				      :col-def="colDef"
				>
					<span>{{ rowData[colDef.colId] }}</span>
				</slot>
			</td>
		</tr>
		</tbody>
	</table>
</template>

<script>
  import { getNestedObjProp } from '@/utils';

  export default {
    name: 'TheTable',
    data() {
      return {
        selectedRow: { id: null, index: -1, data: null }
      };
    },
    props: {
      captionLabel: { type: String, required: false, default: '' },
      columnDefs: { type: Array, required: true, default: () => [] },
      datasource: { type: Array, required: false, default: () => [] }
    },
    computed: {
      tableData() {
        return this.datasource.map(dataItem => {
          const resultItem = Object.create(null);

          this.columnDefs.forEach(colDef => {
            resultItem[colDef.colId] = getNestedObjProp(dataItem, colDef.field);
          });

          return resultItem;
        });
      }
    },
    methods: {
      onTableHeadClickHandler({ colDef, index }) {
        if ( !colDef.sortable ) return;
        const { sort } = colDef;
        const sortModel = Object.create(null);
        this.columnDefs.forEach(def => def.sort = '');

        switch ( sort ) {
          case 'asc':
            this.$set(this.columnDefs, index, { ...colDef, sort: 'des' });
            sortModel[colDef.colId] = 'des';
            break;
          case 'des':
            this.$set(this.columnDefs, index, { ...colDef, sort: '' });
            // this.sortModel[colDef.colId] = '';
            break;
          default:
            this.$set(this.columnDefs, index, { ...colDef, sort: 'asc' });
            sortModel[colDef.colId] = 'asc';
            break;
        }

        this.$emit('sort-model-change', sortModel);
      },
      onRowClickedHandler(rowData) {
        const isSameRow = this.selectedRow.id === rowData.id;

        this.$emit('on-row-click', { rowData });
        this.$emit(isSameRow ? 'row-deselect' : 'row-select', { rowData });

        this.selectedRow.index = isSameRow ? -1 : rowData.$index;
        this.selectedRow.id = isSameRow ? null : rowData.id;
        this.selectedRow.data = isSameRow ? null : rowData;
      }
    }
  };
</script>
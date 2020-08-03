<template>
	<table class="border-collapse border-2 border-gray-500">
		<caption v-if="captionLabel" class="p-2 font-semibold text-lg">{{ captionLabel }}</caption>
		<thead>
		<tr>
			<th v-for="colDef of columnDefs"
			    :key="colDef.colId"
			    :data-id="colDef.colId"
			    :class="{
			      'cursor-pointer': colDef.sortable,
			       hidden: !colDef.visible,
			       'hover:bg-green-400 hover:text-white': colDef.sortable
			    }"
			    class="border font-bold text-lg border-gray-500 px-3 py-2 text-gray-800">
				{{ colDef.headerName }}
			</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="rowData of tableData"
		    :key="rowData.$uuid"
		    class="cursor-pointer hover:text-white hover:bg-green-300"
		    :class="{ 'bg-green-400': selectedRow.index === rowData.$index }"
		    @click="onRowSelectedHandler(rowData)"
		>
			<td v-for="colDef of columnDefs"
			    :key="colDef.colId"
			    :class="{ hidden: !colDef.visible }"
			    class="border border-gray-500 px-3 py-1"
			>
				<slot name="td"
				      :row-data="rowData"
				      :col-data="rowData[colDef.colId]"
				      :col-id="colDef.colId"
				      :col-def="colDef">
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
        selectedRow: { index: -1, data: null }
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
      onRowSelectedHandler(rowData) {
        if ( this.selectedRow.index === rowData.$index ) return;
        this.selectedRow.index = rowData.$index;
        this.selectedRow.uuid = rowData.$uuid;
        this.selectedRow.data = rowData;
        this.$emit('on-row-selected', { rowData });
      }
    }
  };
</script>
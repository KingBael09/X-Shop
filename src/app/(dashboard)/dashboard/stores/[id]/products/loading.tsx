import { DataTableLoading } from "@/components/data-table/data-table-loading"

export default function ProductsLoading() {
  return (
    <DataTableLoading
      columnCount={6}
      rowCount={5}
      isNewRowCreatable={true}
      isRowsDeletable={true}
    />
  )
}

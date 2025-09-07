import { Skeleton } from "@mui/material";
import type { Column } from '@tanstack/react-table';


const SkeletonTableRowsLoader = ({
  rowsNum,
  columns,
  columnsNum,
  columnSizes,
  getCommonPinningStyles: customGetCommonPinningStyles
}: {
  rowsNum: number,
  columns?: Column<any>[],
  columnsNum?: number,
  columnSizes?: { width: number, minWidth?: number, maxWidth?: number }[],
  getCommonPinningStyles?: (column: Column<any>) => React.CSSProperties
}) => {
  // Use new API with columns if provided, otherwise fall back to old API
  if (columns && customGetCommonPinningStyles) {
    return [...Array(rowsNum)].map((row, index) => (
      <tr key={index}>
        {columns.map((column, colIndex) => {
          const pinningStyles = customGetCommonPinningStyles(column)

          
return (
            <td
              key={colIndex}
              style={{
                ...pinningStyles,
                backgroundColor: column.getIsPinned() ? 'var(--mui-palette-background-paper)' : 'transparent'
              }}
            >
              <Skeleton animation="wave" variant="text" />
            </td>
          )
        })}
      </tr>
    ));
  }

  // Fall back to old API
  return [...Array(rowsNum)].map((row, index) => (
    <tr key={index}>
      {[...Array(columnsNum || 0)].map((col, colIndex) => (
        <td
          key={colIndex}
          style={columnSizes?.[colIndex] ? {
            width: columnSizes[colIndex].width,
            minWidth: columnSizes[colIndex].minWidth,
            maxWidth: columnSizes[colIndex].maxWidth
          } : {}}
        >
          <Skeleton animation="wave" variant="text" />
        </td>
      ))}
    </tr>
  ));
};

export default SkeletonTableRowsLoader

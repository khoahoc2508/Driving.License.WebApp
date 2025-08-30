import { Skeleton } from "@mui/material";
import type { Column } from '@tanstack/react-table';

// Helper function to get pinning styles (same as in Table.tsx)
const getCommonPinningStyles = (column: Column<any>): React.CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  }
}

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
    // Debug: Log columns and pinning info
    console.log('SkeletonTableRowsLoader - Columns:', columns.map(col => ({
      id: col.id,
      isPinned: col.getIsPinned(),
      position: col.getIsPinned()
    })))

    return [...Array(rowsNum)].map((row, index) => (
      <tr key={index}>
        {columns.map((column, colIndex) => {
          const pinningStyles = customGetCommonPinningStyles(column)
          console.log(`Column ${column.id} pinning styles:`, pinningStyles)

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

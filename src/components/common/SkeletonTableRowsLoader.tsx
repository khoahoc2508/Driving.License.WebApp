import { Skeleton } from "@mui/material";

const SkeletonTableRowsLoader = ({ rowsNum, columnsNum, columnSizes }: {
  rowsNum: number,
  columnsNum: number,
  columnSizes?: { width: number, minWidth?: number, maxWidth?: number }[]
}) => {
  return [...Array(rowsNum)].map((row, index) => (
    <tr key={index}>
      {
        [...Array(columnsNum)].map((col, colIndex) => (
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
        ))
      }
    </tr>
  ));
};

export default SkeletonTableRowsLoader

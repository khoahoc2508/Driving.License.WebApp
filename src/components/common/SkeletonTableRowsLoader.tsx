import { Skeleton } from "@mui/material";

const SkeletonTableRowsLoader = ({ rowsNum, columnsNum }: { rowsNum: number, columnsNum: number }) => {
  return [...Array(rowsNum)].map((row, index) => (
    <tr key={index}>
      {
        [...Array(columnsNum)].map((col, colIndex) => (
          <td key={colIndex} ><Skeleton animation="wave" variant="text" /></td>
        ))
      }
    </tr>
  ));
};

export default SkeletonTableRowsLoader

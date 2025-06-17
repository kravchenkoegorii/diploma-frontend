import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ReactNode } from 'react';
import { CgSpinnerAlt } from 'react-icons/cg';
import './index.css';

interface TableComponentProps<T> {
  columns: string[];
  data: T[] | undefined;
  renderRow: (item: T, index: number) => ReactNode;
  emptyMessage: string;
  isLoading?: boolean;
}

const TableComponent = <T,>({
  columns,
  data,
  renderRow,
  emptyMessage,
  isLoading,
}: TableComponentProps<T>) => {
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <CgSpinnerAlt className="animate-spin text-white text-[35px]" />
      </div>
    );
  }

  if (!data || data?.length <= 0) {
    return (
      <div className="flex justify-center max-992px:text-[11px] text-white/60">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      <TableContainer className="scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent dashboard-table">
        <Table className="scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent dashboard-table">
          <TableHead
            className="pb-[200px]"
            sx={{ position: 'sticky', top: 0, zIndex: 999 }}
          >
            <TableRow className="max-992px:!hidden">
              {columns.map((col, index) => (
                <TableCell key={index} className="text-[#dbdbfe]">
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{data?.map(renderRow)}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableComponent;

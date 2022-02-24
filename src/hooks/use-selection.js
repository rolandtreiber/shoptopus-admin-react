import { useState } from 'react';

export const useSelection = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([])

  const handleSelect = (event, rowId) => {
    setSelectedRows((prevSelectedRows) => {
      if (event.target.checked) {
        return [...prevSelectedRows, rowId];
      }

      return prevSelectedRows.filter((selectedRow) => selectedRow !== rowId);
    });
  };

  const handleClearSelected = () => {
    setSelectedRows([]);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
        setSelectedRows(rows.map((row) => row.id));
      return;
    }

    handleClearSelected();
  };

  const mergeSelectableRows = (newRows) => {
    const newRowState = rows.concat(newRows);
    setRows(newRowState)
  }

  return [selectedRows, handleSelect, handleSelectAll, setRows, mergeSelectableRows];
};

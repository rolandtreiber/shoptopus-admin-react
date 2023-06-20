import React, {useEffect} from "react";
import {Box, Button} from "@material-ui/core";
import {TreeItem, TreeView} from "@material-ui/lab";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {useLanguage} from "../../hooks/use-language";
import TreeItemContent from "./tree-item-content";

const CategoryTreeSelect = ({categories, selection = [], setSelection}) => {
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState(selection);
  const {getLang} = useLanguage()

  // console.log(categories)
  const handleToggle = (event, nodeIds) => {
    if (event.target.closest(".MuiTreeItem-iconContainer")) {
      setExpanded(nodeIds);
    }
  };

  useEffect(() => {
    setSelection(selected)
  }, [selected])

  const autoSelectParents = (selectedIds) => {
    const allCategories = flat(categories)
    let updated = 0
    do {
      updated = 0
      selectedIds.forEach((id) => {
          const c = allCategories.find(a => a.id === id)
          if (c && c.parent_id) {
            if (selectedIds.indexOf(c.parent_id) === -1) {
              selectedIds.push(c.parent_id)
              updated++
            }
          }
        }
      )
    } while (updated > 0)
    return selectedIds
  }

  const handleSelect = (event, nodeIds) => {
    setSelected(autoSelectParents(nodeIds));
  };

  const flat = (input, idOnly = false) => {
    let result = [];
    input.forEach(function (a) {
      if (Array.isArray(a.children)) {
        idOnly ? result.push(a.id) : result.push(a);
        result = result.concat(flat(a.children, idOnly));
      }
    });
    return result;
  }

  const handleExpandClick = () => {

    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? flat(categories, true) : [],
    );
  };

  const handleSelectClick = () => {
    setSelected((oldSelected) =>
      oldSelected.length === 0 ? flat(categories, true) : [],
    );
  };

  const renderTreeItems = (items) => (
    <>
      {items.map(c => (
        <TreeItem ContentComponent={TreeItemContent} value={c.id} key={c.id} nodeId={c.id} label={getLang(c.name)}>
          {c.children.length > 0 && renderTreeItems(c.children)}
        </TreeItem>
      ))}
    </>
  )

  return (
    <Box mb={1} sx={{maxHeight: 270, flexGrow: 1, overflowY: 'auto'}}>
      <Box sx={{mb: 1}}>
        <Button onClick={handleExpandClick}>
          {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
        </Button>
        <Button onClick={handleSelectClick}>
          {selected.length === 0 ? 'Select all' : 'Unselect all'}
        </Button>
      </Box>
      <TreeView
        aria-label="controlled"
        defaultCollapseIcon={<ExpandMoreIcon/>}
        defaultExpandIcon={<ChevronRightIcon/>}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        multiSelect
      >
        {renderTreeItems(categories)}
      </TreeView>
    </Box>
  )
}

export default CategoryTreeSelect
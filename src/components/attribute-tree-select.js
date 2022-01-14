import React, {useEffect} from "react";
import {Box, Button, IconButton, Typography} from "@material-ui/core";
import {TreeItem, TreeView, useTreeItem} from "@material-ui/lab";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {useLanguage} from "../hooks/use-language";
import TreeItemContent from "./tree-item-content";

const AttributeTreeSelect = ({attributes}) => {
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const {getLang} = useLanguage()
  const attributeIds = attributes.map(a => a.id);
  const handleToggle = (event, nodeIds) => {
    if (event.target.closest(".MuiTreeItem-iconContainer")) {
      setExpanded(nodeIds);
    }
  };

  const getAllSelectedAttributes = (nodeIds) => {
    const selectedAttributeIds = nodeIds.filter(value => attributeIds.indexOf(value) !== -1);
    return attributes.filter(a => selectedAttributeIds.includes(a.id));
  }

  const getAllSelectedAttributeOptions = (attribute, nodeIds) => {
    const optionIds = attribute.options.filter(o => o.id).map(o => o.id);
    return nodeIds.filter(value => optionIds.includes(value));
  }

  const isDuplicateOption = (nodeIds) => {
    const selectedAttributes = getAllSelectedAttributes(nodeIds)
    let duplicate = false;
    selectedAttributes.some(a => {
      const selectedOptions = getAllSelectedAttributeOptions(a, nodeIds)
      if (selectedOptions.length > 1) {
        duplicate = true
        return duplicate
      }
    })
    return duplicate
  }

  const autoSelectParents = (selectedIds) => {
    const flatAttributes = flat(attributes)
      selectedIds.forEach((id) => {
          const c = flatAttributes.find(a => a.id === id)
          if (c && c.product_attribute_id) {
            if (selectedIds.indexOf(c.product_attribute_id) === -1) {
              selectedIds.push(c.product_attribute_id)
            }
          }
        }
      )
    return selectedIds
  }

  const handleSelect = (event, nodeIds) => {

    const ids = autoSelectParents(nodeIds)
    if (!isDuplicateOption(ids)) {
      setSelected(ids)
    }
  };

  const flat = (input, idOnly = false) => {
    let result = [];
    input.forEach(function (a) {
      if (Array.isArray(a.options)) {
        idOnly ? result.push(a.id) : result.push(a);
        result = result.concat(a.options);
      }
    });
    return result;
  }

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? attributes.map(a => a.id) : [],
    );
  };

  const handleSelectClick = () => {
    setSelected((oldSelected) =>
      oldSelected.length === 0 ? flat(attributes, true) : [],
    );
  };

  return (
    <Box sx={{height: 270, flexGrow: 1, overflowY: 'auto'}}>
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
        {attributes.map(a => (
          <TreeItem ContentComponent={TreeItemContent} value={a.id} key={a.id} nodeId={a.id} label={getLang(a.name) + ' - ' + a.id}>
            {a.options.length > 0 && a.options.map(o => (
              <TreeItem ContentComponent={TreeItemContent} value={o.id} key={o.id} nodeId={o.id} label={getLang(o.name)}/>
            ))}
          </TreeItem>
        ))}
      </TreeView>
    </Box>
  )
}

export default AttributeTreeSelect
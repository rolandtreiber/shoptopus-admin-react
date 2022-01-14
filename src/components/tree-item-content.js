import React from "react";
import {useTreeItem} from "@material-ui/lab";
import clsx from "clsx";
import {Typography} from "@material-ui/core";

const TreeItemContent = React.forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  return (
    <div
      className={clsx(classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled
      })}
      onMouseDown={preventSelection}
      ref={ref}
    >
      <span onClick={handleExpansion} className={classes.iconContainer}>
        {icon}
      </span>
      <Typography
        onClick={(e) => {
          handleSelection(e)
        }}
        component="span"
        className={classes.label}
      >
        {label}
      </Typography>
    </div>
  );
});

export default TreeItemContent
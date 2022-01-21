import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Trash as TrashIcon} from "../icons/trash";
import {IconButton} from "@material-ui/core";

export function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div style={{
      position: 'relative'
    }}>
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
      <IconButton
        color="primary"
        onClick={() => props.handleDeleteImage(props.id)}
        sx={{
          bottom: 8,
          color: 'text.secondary',
          position: 'absolute',
          right: 8,
        }}
      >
        <TrashIcon/>
      </IconButton>
    </div>
  );
}
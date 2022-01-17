import React, {useEffect, useState} from "react";
import {useLanguage} from "../hooks/use-language";
import {Box, Stack, Chip} from "@material-ui/core";

function Inline(props) {
  return null;
}

const TagPicker = ({tags, selection = [], setSelection}) => {
  const {getLang} = useLanguage()
  const [selected, setSelected] = useState(selection)

  const toggleSelection = (id) => {
    const index = selected.indexOf(id)
    if (index !== -1) {
      const selectedCopy = [...selected]
      selectedCopy.splice(selectedCopy.indexOf(id), 1)
      setSelected([...selectedCopy])
    } else {
      setSelected([...selected, id])
    }
  }

  useEffect(() => {
    setSelection(selected)
  }, [selected])

  return (
    <Box sx={{mb: 1}}>
      {tags.map(tag => (
         <Chip key={tag.id} onClick={() => toggleSelection(tag.id)}
               style={{margin: '3px'}}
               label={getLang(tag.name)}
               variant={selected.indexOf(tag.id) === -1 ? "outlined" : "filled"}
               color={selected.indexOf(tag.id) === -1 ? "default" : "primary"}
         />
      ))}
    </Box>
  )
}

export default TagPicker
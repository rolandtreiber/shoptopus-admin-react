import React, {useState} from "react";
import {useLanguage} from "../hooks/use-language";
import {Box, Stack, Chip} from "@material-ui/core";

function Inline(props) {
  return null;
}

const TagPicker = ({tags, selection, onChange}) => {
  const {getLang} = useLanguage()
  const [selected, setSelected] = useState(selection)

  return (
    <Box sx={{mb: 1}}>
      {tags.map(tag => (
         <Chip style={{margin: '3px'}} label={getLang(tag.name)} variant="outlined" />
      ))}
    </Box>

  )
}

export default TagPicker
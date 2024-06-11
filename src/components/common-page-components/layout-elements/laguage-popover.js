import {useContext, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover
} from '@material-ui/core';
import {SettingsContext} from "../../../contexts/settings-context";
import {TrTypography} from "../../common/translated/translated-typography";

export const LanguagePopover = (props) => {
  const { language, onLanguageChange, ...other } = props;
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const {availableLanguages} = useContext(SettingsContext)
  const [languageOptions, setLanguageOptions] = useState({en: {
      icon: '/admin/static/uk_flag.svg',
      label: 'English'
    }})

  useEffect(() => {
    let languages = {}
    Object.keys(availableLanguages).map(key => languages[key] = {
      ...availableLanguages[key],
      icon: '/admin/static/'+key+'_flag.svg'
    })
    setLanguageOptions(languages)
  }, [availableLanguages])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLanguageChange = (newLanguage) => {
    onLanguageChange(newLanguage);
    setOpen(false);
  };

  const selectedOption = languageOptions[language];

  return (
    <>
      <IconButton
        onClick={handleOpen}
        ref={anchorRef}
        {...other}
        id={"selected-language-button-desktop"}
      >
        <Box
          sx={{
            display: 'flex',
            height: 20,
            width: 20,
            '& img': {
              width: '100%'
            }
          }}
        >
          {selectedOption && <img
            alt={selectedOption.label}
            src={selectedOption.icon}
          />}
        </Box>
      </IconButton>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        keepMounted
        id={"language-selector-popover-desktop"}
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 240 }
        }}
      >
        {Object.keys(languageOptions).map((option) => (
          <MenuItem
            onClick={() => handleLanguageChange(option)}
            key={option}
          >
            <ListItemIcon>
              <Box
                sx={{
                  display: 'flex',
                  height: 20,
                  width: 20,
                  '& img': {
                    width: '100%'
                  }
                }}
              >
                {languageOptions[option] && <img
                  alt={languageOptions[option].label}
                  src={languageOptions[option].icon}
                />}
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={(
                <TrTypography
                  color="textPrimary"
                  variant="subtitle2"
                >
                  {languageOptions[option].label}
                </TrTypography>
              )}
            />
          </MenuItem>
        ))}
      </Popover>
    </>
  );
};

LanguagePopover.propTypes = {
  language: PropTypes.string.isRequired,
  onLanguageChange: PropTypes.func.isRequired
};

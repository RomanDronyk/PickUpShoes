const style = {
  width: "100%",

  '.MuiInputBase-root': {
    height: '52px',
    display: 'flex',
    width: '100%',
  
    backgroundColor: 'hsl(0 0% 89.8%)',
    borderRadius: '62px',
    padding: '0 6px',
    fontSize: '16px',
    '&.Mui-focused': {
      borderColor: 'rgba(0, 0, 0, 0.5)', // Напівчорний коли інпут активний
      ".MuiOutlinedInput-notchedOutline": {
        borderColor: 'rgba(0, 0, 0, 0.5)', // Напівчорний коли інпут активний
      }
    },
    '&.Mui-disabled': {
      cursor: 'not-allowed',
      opacity: 0.5
    }
  },
  '.MuiInputBase-input': {
    padding: '0px 20px',
    borderRadius: '62px',
    paddingLeft: '1.5rem',
    paddingTop: '.75rem',
    paddingBottom: '.75rem',
    fontSize: '1.25rem', // Збільшено з 16px
    lineHeight: '1.75rem',
    paddingRight: '1.5rem'
  },
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: 'none', // Напівчорний коли інпут активний
  },
  '.MuiAutocomplete-inputRoot': {
    fontSize: '1.25rem', // Збільшено з 16px
    padding: '0px 20px',

  },
  '.MuiInputLabel-root': {
    color: 'text.secondary'
  }
}
export default style
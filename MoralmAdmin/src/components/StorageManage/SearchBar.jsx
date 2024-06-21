import { useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar({ onSearch }) {
  const [searchId, setSearchId] = useState('');
  const [searchName, setSearchName] = useState('');

  const handleSearchIdChange = (event) => {
    setSearchId(event.target.value);
    onSearch(event.target.value, searchName);
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
    onSearch(searchId, event.target.value);
  };

  return (
    <div className='search-bar'>
      <div className='search-id'>
        <FormControl 
          fullWidth 
          variant="outlined"
          sx={{ 
            m: 1, 
            bgcolor: '#EFEFEF', 
            borderRadius: 10, 
            '& .MuiOutlinedInput-root': {
              height: '4vh',
            }
          }}
        >
          <OutlinedInput
            id="outlined-adornment-amount"
            value={searchId}
            onChange={handleSearchIdChange}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
            placeholder="Search for ID"
          />
        </FormControl>
      </div>

      <div className='search-name'>
        <FormControl
          fullWidth
          sx={{
            m: 1,
            bgcolor: '#EFEFEF',
            borderRadius: 10,
            '& .MuiOutlinedInput-root': {
              height: '4vh',
            }
          }}>
          <OutlinedInput
            id="outlined-adornment-amount"
            value={searchName}
            onChange={handleSearchNameChange}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>}
            placeholder="Search for Batch"
          />
        </FormControl>
      </div>
    </div>
  )
}

export default SearchBar;

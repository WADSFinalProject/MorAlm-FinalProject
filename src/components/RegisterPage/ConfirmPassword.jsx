import '../../styles/Register.css';
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';

const ConfirmPassword = ({ onConfirmPasswordChange }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
      event.preventDefault();
  };

  const handleChange = (event) => {
      setConfirmPassword(event.target.value);
      onConfirmPasswordChange(event.target.value);
  };

  return (
      <div className='passwordRegister'>
          <FormControl 
              sx={{ bgcolor: '#EFEFEF', borderRadius: 10, width: 636 }}
              variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password-confirm" style={{color: '#6A6A6A'}}>Confirm Password</InputLabel>
              <OutlinedInput
                  id="outlined-adornment-password-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleChange}
                  endAdornment={
                      <InputAdornment position="end">
                          <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                          >
                              {showPassword ? <LockOpenOutlinedIcon /> : <LockOutlinedIcon />}
                          </IconButton>
                      </InputAdornment>
                  }
                  label="Confirm Password"
              />
          </FormControl>
      </div>
  );
};

export default ConfirmPassword;
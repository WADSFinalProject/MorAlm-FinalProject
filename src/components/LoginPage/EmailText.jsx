import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import '../../styles/Login.css';

const EmailText = ({ onEmailChange }) => {
    const [email, setEmail] = useState('');

    const handleChange = (event) => {
        setEmail(event.target.value);
        onEmailChange(event.target.value);
    };

    return (
        <div className='textField'>
            <TextField
                id="outlined-basic-email"
                label="Email"
                variant="outlined"
                sx={{
                    bgcolor: '#EFEFEF',
                    borderRadius: 10,
                    width: 450,
                }}
                InputLabelProps={{
                    style: { color: '#6A6A6A' } // Default text color
                }}
                value={email}
                onChange={handleChange}
            />
        </div>
    );
};

export default EmailText;

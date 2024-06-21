import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import '../../styles/Register.css';

const UserName = ({ onNameChange }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    return (
        <div className='textFieldReg'>
            <TextField
                id="outlined-basic-firstname"
                label="First Name"
                variant="outlined"
                sx={{
                    bgcolor: '#EFEFEF',
                    borderRadius: 10,
                    width: 310,
                }}
                InputLabelProps={{
                    style: { color: '#6A6A6A' } // Default text color
                }}
                value={firstName}
                onChange={(e) => {
                    setFirstName(e.target.value);
                    onNameChange(e.target.value, lastName);
                }}
            />

            <TextField
                id="outlined-basic-lastname"
                label="Last Name"
                variant="outlined"
                sx={{
                    bgcolor: '#EFEFEF',
                    borderRadius: 10,
                    width: 310,
                }}
                InputLabelProps={{
                    style: { color: '#6A6A6A' } // Default text color
                }}
                value={lastName}
                onChange={(e) => {
                    setLastName(e.target.value);
                    onNameChange(firstName, e.target.value);
                }}
            />
        </div>
    );
};

export default UserName;

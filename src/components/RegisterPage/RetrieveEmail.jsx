import React from 'react';
import '../../styles/Login.css';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const RetrieveEmail = ({ onSubmit }) => {

    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText('#467E18'),
        width: 636,
        borderRadius: 40,
        backgroundColor: '#467E18',
        '&:hover': {
            backgroundColor: '#274C08',
        },
    }));

    return (
        <div className='regRetrieveButton'>
            <ColorButton 
                variant="contained"
                onClick={onSubmit}
            >
                Retrieve Email
            </ColorButton>
        </div>
    );
};

export default RetrieveEmail;

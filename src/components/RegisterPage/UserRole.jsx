import { useState } from 'react';
import '../../styles/Register.css';
import { TextField, MenuItem } from '@mui/material';

function UserRole({ onRoleChange, onCentraTypeChange }) {
    const [userRole, setUserRole] = useState('XYZ');
    const [centraType, setCentraType] = useState('');

    const roles = [
        { value: 'XYZ', label: 'XYZ' },
        { value: 'Centra', label: 'Centra' },
        { value: 'Harbor', label: 'Harbor' },
        { value: 'Admin', label: 'Admin' },
    ];

    const centra = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
        { value: '7', label: '7' },
        { value: '8', label: '8' },
        { value: '9', label: '9' },
        { value: '10', label: '10' },
        { value: '11', label: '11' },
        { value: '12', label: '12' },
        { value: '13', label: '13' },
        { value: '14', label: '14' },
        { value: '15', label: '15' },
        { value: '16', label: '16' },
        { value: '17', label: '17' },
        { value: '18', label: '18' },
        { value: '19', label: '19' },
        { value: '20', label: '20' },
        { value: '21', label: '21' },
        { value: '22', label: '22' },
        { value: '23', label: '23' },
        { value: '24', label: '24' },
        { value: '25', label: '25' },
        { value: '26', label: '26' },
        { value: '27', label: '27' },
        { value: '28', label: '28' },
        { value: '29', label: '29' },
        { value: '30', label: '30' },
        { value: '31', label: '31' },
        { value: '32', label: '32' },
        { value: '33', label: '33' },
        { value: '34', label: '34' },
        { value: '35', label: '35' },
        { value: '36', label: '36' },
    ];

    const handleRoleChange = (event) => {
        const value = event.target.value;
        setUserRole(value);
        onRoleChange(value); // Pass the role change to the parent component
    };

    const handleCentraTypeChange = (event) => {
        const value = event.target.value;
        setCentraType(value);
        onCentraTypeChange(value); // Pass the Centra type change to the parent component
    };

    return (
        <div className='userRole'>
            <TextField
                id="outlined-select-role-user"
                select
                label="User Role"
                value={userRole}
                onChange={handleRoleChange}
                sx={{ bgcolor: '#EFEFEF', borderRadius: 10, width: 310, height: 54, color: '#6A6A6A' }}
                InputLabelProps={{ style: { color: '#6A6A6A', top: "-0.5vh" } }}
            >
                {roles.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                id="outlined-select-role-centra"
                select
                label="Centra Building"
                value={centraType}
                onChange={handleCentraTypeChange}
                disabled={userRole !== 'Centra'}
                sx={{ bgcolor: '#EFEFEF', borderRadius: 10, width: 310, color: '#6A6A6A' }}
                InputLabelProps={{ style: { color: '#6A6A6A', top: "-0.5vh" } }}
                SelectProps={{
                    MenuProps: {
                        slotProps: {
                            paper: { sx: { maxHeight: 150 } },
                        },
                    },
                }}
            >
                {centra.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    );
}

export default UserRole;

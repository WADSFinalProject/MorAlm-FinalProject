import '../../styles/Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase.js';
import { signInWithEmailAndPassword } from "firebase/auth";
import EmailText from './EmailText.jsx';
import LoginButton from './LoginButton.jsx';
import LoginGreen from './LoginGreen.jsx';
import PasswordText from './PasswordText.jsx';
import Logo from '../../assets/logo.png';
import LogoMobile from '../../assets/logomobile.png';
import RegButton from './RegButton.jsx';
import LoginImage from './LoginImage.jsx';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (email) => {
        setEmail(email);
    };

    const handlePasswordChange = (password) => {
        setPassword(password);
    };

    const handleLogin = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Invalid email format');
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('User logged in successfully!');
            if (email.includes('@admin.com')) {
                navigate('/admin');
            } else if (email.includes('@centra.com')) {
                navigate('/centra');
            } else if (email.includes('@xyz.com')) {
                navigate('/xyz');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in: ' + error.message);
        }
    };

    return (
        <div className='Login'>
            <div className='LoginTextBox'>
                <img src={Logo} className="appLogo" alt="logo" />
                <img src={LogoMobile} className="appLogoMobile" alt="logo" />
                <div className='loginText'>Log In</div>
                <div className='loginTextTwo'>Kindly log in using your credentials</div>
                <EmailText onEmailChange={handleEmailChange} />
                <PasswordText onPasswordChange={handlePasswordChange} />
                <LoginButton onLogin={handleLogin} />
                <RegButton />
            </div>
            <LoginGreen />
            <LoginImage />
        </div>
    );
}

export default Login;

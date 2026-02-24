import React from 'react'
import Header from './Header'
import { AuthProvider, useAuth } from '../helper/AuthContext'
import LoginModal from '../modal/LoginModal';
import RegistrationModal from '../modal/RegistrationModal';
import ConfirmLogoutModal from '../modal/ConfirmLogoutModal';
import AddChildModal from '../modal/AddChildModal';
import { UserProvider } from '../helper/UserContext';
import ForgotPasswordModal from '../modal/ForgotPasswordModal';

function Modals() {
    const { modalState } = useAuth();
    if (modalState === 'login') return <LoginModal />;
    if (modalState === 'register') return <RegistrationModal />;
    if (modalState === 'logout') return <ConfirmLogoutModal />;
    if (modalState === 'addChild') return <AddChildModal />;
    if (modalState === 'forgot') return <ForgotPasswordModal />;
    return null;
}

function Layout({ children }) {
    return (
        <AuthProvider>
            <UserProvider>
                <div className='w-full h-screen flex flex-col'>
                    <Header />
                    <main className='w-screen grow bg-[#EFFBF6] h-full overflow-y-auto'>{children}</main>
                    <Modals />
                </div>
            </UserProvider>
        </AuthProvider>
    )
}

export default Layout
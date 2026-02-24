import { Trophy, LogOut, UserPlus } from 'lucide-react'
import { useAuth } from '../helper/AuthContext';

function Header() {
  const { user, openLogoutModal, openLoginModal, openRegisterModal, openAddChildModal } = useAuth();

  return (
    <header className="w-full bg-[#FCFEFE] border-b border-gray-300 py-4 px-4">
      <div className="  mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="size-8 text-blue-600" />
          <div>
            <h1 className="text-blue-900">SOF Prep Excellence</h1>
            <p className="text-sm text-[#00a63e]">Aiinhome | SPE</p>
          </div>
        </div>
        {user ? (
          <div className='flex items-center gap-4'>
            <span className='text-sm font-semibold text-blue-900'>{user.name}</span>
            {user.role === 'parent' && (
              <button onClick={openAddChildModal} className="flex items-center gap-2 px-2 py-1 rounded-lg border border-blue-300 text-blue-900 cursor-pointer hover:bg-blue-100">
                <UserPlus className="size-4" />
                Add Child
              </button>
            )}
            <button onClick={openLogoutModal} className="flex items-center gap-2 px-2 py-1 rounded-lg border border-gray-300 text-gray-900 cursor-pointer hover:bg-gray-100">
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        ) : (
          <div className='flex gap-2'>
            <button onClick={openLoginModal} className="px-2 py-1 rounded-lg border border-blue-200 text-blue-700 cursor-pointer">
              Login
            </button>
            <button onClick={openRegisterModal} className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              Register Now
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
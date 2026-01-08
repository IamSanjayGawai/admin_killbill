import { useState } from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";




interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();


  const handleLogOut = () => {
    // step 1 remove token from localStorage
    localStorage.removeItem("adminToken");
    // localStorage.removeItem("user");
    setShowDropdown(false);
    navigate("/login");
  }

//   useEffect(() => {
   
//     handleLogOut()      
//   }
// , [])
  // ...



  return (
    <nav className="surface-card border-b surface-divider px-6 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-secondary hover:text-primary"
        >
          <Menu size={24} />
        </button>

        <div className="flex-1 lg:ml-0 ml-4">
          <h2 className="text-xl font-semibold text-primary">FunZo Admin Panel</h2>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-secondary hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 text-secondary hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-[var(--accent-color)] rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <span className="hidden md:block font-medium">Admin User</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 surface-card rounded-lg shadow-lg border surface-divider py-2 z-50">
                <button className="w-full px-4 py-2 text-left text-sm text-secondary hover:bg-gray-100 flex items-center gap-2">
                  <User size={16} />
                  Profile
                </button>
                <button
                  onClick={handleLogOut}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { cartAPI } from '../api/api';
import { Menu, X } from 'lucide-react';
import { FaCartArrowDown } from "react-icons/fa";
// import { MdOutlineLogout } from "react-icons/md";

function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartAPI.get(),
    enabled: !!user && user.role !== 'ADMIN', //  disable for admin
    select: (response) => response.data,
  });

  const cartCount = cartData?.itemCount || 0;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="text-2xl font-bold text-blue-600">
            Irapda LTD
          </Link>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Products
            </Link>

            {user ? (
              <>
                {!user?.isAdmin && (
                  <Link to="/wishlist" className="text-gray-700 hover:text-blue-600">
                    Wishlist
                  </Link>
                )}

                {!user?.isAdmin && (
                  <Link to="/orders" className="text-gray-700 hover:text-blue-600">
                    Orders
                  </Link>
                )}

                {/*  Cart icon with count */}
                {!user?.isAdmin && (
                  <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
                    <FaCartArrowDown size={22} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                {/*  Admin link */}
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin/products"
                    className="text-purple-600 hover:text-purple-800 font-semibold"
                  >
                    Admin
                  </Link>
                )}

                {/*  User Info + Logout */}
                <div className="flex items-center space-x-4">
                  <span className="text-green-700 font-medium">{user.name}</span>
                  <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                  >
                   Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white shadow-md transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col space-y-4 px-6 py-4">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-gray-700 hover:text-blue-600"
          >
            Products
          </Link>

          {user ? (
            <>
              {!user?.isAdmin && (
                <Link
                  to="/cart"
                  onClick={closeMenu}
                  className="text-gray-700 hover:text-blue-600 relative flex items-center gap-2"
                >
                  <FaCartArrowDown size={20} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 left-5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {!user?.isAdmin && (
                <Link
                  to="/wishlist"
                  onClick={closeMenu}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Wishlist
                </Link>
              )}

              {!user?.isAdmin && (
                <Link
                  to="/orders"
                  onClick={closeMenu}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Orders
                </Link>
              )}

              {user.role === 'ADMIN' && (
                <Link
                  to="/admin/products"
                  onClick={closeMenu}
                  className="text-purple-600 hover:text-purple-800 font-semibold"
                >
                  Admin
                </Link>
              )}

              <span className="text-gray-700">{user.name}</span>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

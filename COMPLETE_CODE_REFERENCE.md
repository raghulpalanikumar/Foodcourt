# Complete Updated Code Reference

## Header.jsx (Complete File)

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';
import { useWishlist } from '../context/wishlistContext';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiSearch, FiLogOut, FiX, FiHome, FiPackage } from 'react-icons/fi';
import '../styles/header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileMenu(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="modern-header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="header-logo">
            <span className="logo-icon">🛍️</span>
            <span className="logo-text">Starlit & Co</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="header-search-form">
            <div className="search-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="header-nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <FiHome />
              <span>Home</span>
            </Link>
            <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
              <FiPackage />
              <span>Products</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Wishlist */}
            <Link to="/wishlist" className="action-btn wishlist-btn" title="Wishlist">
              <FiHeart />
              <span className="action-label">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="action-badge">{wishlist.length}</span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="action-btn cart-btn" title="Cart">
              <FiShoppingCart />
              <span className="action-label">Cart</span>
              {getCartItemsCount() > 0 && (
                <span className="action-badge">{getCartItemsCount()}</span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div ref={userMenuRef} className="user-menu-wrapper">
                <button
                  className="action-btn user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <FiUser />
                  <span className="action-label">{user.name}</span>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                    <div className="user-dropdown-body">
                      <Link
                        to="/dashboard"
                        className="dropdown-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FiUser />
                        <span>My Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item logout-item"
                      >
                        <FiLogOut />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">
                  Login
                </Link>
                <Link to="/register" className="btn-register">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="mobile-search-form">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setShowMobileMenu(false)}
            >
              <FiHome />
              <span>Home</span>
            </Link>
            <Link 
              to="/products" 
              className={`mobile-nav-link ${isActive('/products') ? 'active' : ''}`}
              onClick={() => setShowMobileMenu(false)}
            >
              <FiPackage />
              <span>Products</span>
            </Link>
            <Link 
              to="/wishlist" 
              className="mobile-nav-link"
              onClick={() => setShowMobileMenu(false)}
            >
              <FiHeart />
              <span>Wishlist</span>
              {wishlist.length > 0 && (
                <span className="mobile-badge">{wishlist.length}</span>
              )}
            </Link>
            <Link 
              to="/cart" 
              className="mobile-nav-link"
              onClick={() => setShowMobileMenu(false)}
            >
              <FiShoppingCart />
              <span>Cart</span>
              {getCartItemsCount() > 0 && (
                <span className="mobile-badge">{getCartItemsCount()}</span>
              )}
            </Link>
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className="mobile-nav-link"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FiUser />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="mobile-nav-link logout-link"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
```

## Footer.jsx (Complete File)

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiShield,
  FiTruck,
  FiCreditCard
} from 'react-icons/fi';
import '../styles/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* About Section */}
          <div className="footer-column footer-about">
            <div className="footer-brand">
              <span className="footer-logo-icon">🛍️</span>
              <h3 className="footer-brand-name">Starlit & Co</h3>
            </div>
            <p className="footer-description">
              Your trusted online shopping destination for quality products at great prices. 
              We bring you the best deals on electronics, fashion, home essentials, and more.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook" title="Facebook">
                <FiFacebook />
              </a>
              <a href="#" className="social-link" aria-label="Twitter" title="Twitter">
                <FiTwitter />
              </a>
              <a href="#" className="social-link" aria-label="Instagram" title="Instagram">
                <FiInstagram />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn" title="LinkedIn">
                <FiLinkedin />
              </a>
              <a href="#" className="social-link" aria-label="YouTube" title="YouTube">
                <FiYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?sortBy=rating">Best Sellers</Link></li>
              <li><Link to="/products?category=electronics">New Arrivals</Link></li>
              <li><Link to="/wishlist">My Wishlist</Link></li>
              <li><Link to="/dashboard">My Account</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-column">
            <h4 className="footer-heading">Customer Service</h4>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#track">Track Order</a></li>
              <li><a href="#returns">Returns & Refunds</a></li>
              <li><a href="#shipping">Shipping Information</a></li>
              <li><a href="#faq">FAQs</a></li>
              <li><a href="#contact">Contact Support</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="footer-column">
            <h4 className="footer-heading">Policies</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#return-policy">Return Policy</a></li>
              <li><a href="#payment">Payment Policy</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-column">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <FiMapPin className="contact-icon" />
                <span>StarLit & Co, Annagar, Namakkal-637213</span>
              </li>
              <li>
                <FiPhone className="contact-icon" />
                <span>+91 96989 66368</span>
              </li>
              <li>
                <FiMail className="contact-icon" />
                <span>support@starlitco.com</span>
              </li>
            </ul>
            <div className="footer-hours">
              <p className="hours-title">Business Hours</p>
              <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
              <p>Sunday: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="footer-features">
          <div className="feature-item">
            <FiTruck className="feature-icon" />
            <div className="feature-text">
              <strong>Free Shipping</strong>
              <span>On orders over ₹2,500</span>
            </div>
          </div>
          <div className="feature-item">
            <FiShield className="feature-icon" />
            <div className="feature-text">
              <strong>Secure Payment</strong>
              <span>100% protected</span>
            </div>
          </div>
          <div className="feature-item">
            <FiCreditCard className="feature-icon" />
            <div className="feature-text">
              <strong>Easy Returns</strong>
              <span>30-day return policy</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Starlit & Co. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#sitemap">Sitemap</a>
              <span className="separator">•</span>
              <a href="#accessibility">Accessibility</a>
              <span className="separator">•</span>
              <a href="#careers">Careers</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

## Key CSS Classes Reference

### Header Classes:
- `.modern-header` - Main header container
- `.header-logo` - Logo with gradient text
- `.search-wrapper` - Search bar container
- `.nav-link` - Navigation links
- `.action-btn` - Action buttons (cart, wishlist, user)
- `.action-badge` - Notification badges
- `.user-dropdown` - User menu dropdown
- `.mobile-menu` - Mobile navigation menu

### Footer Classes:
- `.modern-footer` - Main footer container
- `.footer-main` - Main content grid
- `.footer-column` - Individual columns
- `.footer-social` - Social media links
- `.footer-links` - Link lists
- `.footer-features` - Features bar
- `.footer-bottom` - Bottom copyright section

## Color Scheme:
- Primary: `#6366f1` (Indigo)
- Secondary: `#8b5cf6` (Purple)
- Accent: `#ef4444` (Red for badges)
- Text: `#1f2937` (Dark gray)
- Background: `#ffffff` (White)
- Border: `#e5e7eb` (Light gray)

## Typography:
- Font Family: 'Inter', sans-serif
- Headings: 600-800 weight
- Body: 400-500 weight
- Links: 500-600 weight

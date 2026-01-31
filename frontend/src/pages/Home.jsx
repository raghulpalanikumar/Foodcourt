import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiHeadphones,
  FiArrowRight
} from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { api } from '../utils/api';
import Carousel from '../components/Carousel';
import Image from '../components/Image';
import '../styles/home.css';
import '../styles/features.css';
import '../styles/categories.css';
import '../styles/featured-products.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await api.getProducts();

        // Get top-rated products as featured
        const featured = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const categories = [
    {
      name: 'Breakfast Special',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=breakfast'
    },
    {
      name: 'Executive Lunch',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=lunch'
    },
    {
      name: 'Snacks & Chats',
      image: 'https://images.unsplash.com/photo-1626132644529-56e96e313b0a?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=snacks'
    },
    {
      name: 'Fresh Juices',
      image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=juices'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Carousel */}
      <Carousel
        slides={[
          {
            image:
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop',
            badge: 'Fresh Daily',
            title: 'Fueling the Engineers of Tomorrow',
            subtitle: 'Delicious, hygienic, and affordable meals served fresh daily at Kongu Engineering College.',
            primaryCta: { href: '/products', label: 'View Today\'s Specials' },
            secondaryCta: { href: '/products?category=lunch', label: 'Lunch Menu' },
          },
          {
            image:
              'https://images.unsplash.com/photo-1601050633647-81a35d37c331?q=80&w=1600&auto=format&fit=crop',
            badge: 'Breakfast Special',
            title: 'Start Your Day with Proper Nutrition',
            subtitle: 'Try our freshly made Idlis, Sambhar, and piping hot Ghee Roast.',
            primaryCta: { href: '/products?category=breakfast', label: 'See Breakfast Menu' },
            secondaryCta: { href: '/products', label: 'Full Menu' },
          },
          {
            image:
              'https://images.unsplash.com/photo-1626777553735-4817833f3c38?q=80&w=1600&auto=format&fit=crop',
            badge: 'Vibrant Atmosphere',
            title: 'The Heart of Campus Life',
            subtitle: 'Relax, refuel, and reconnect with your friends at the KEC Food Court.',
            primaryCta: { href: '/products', label: 'Order Now' },
            secondaryCta: { href: '#newsletter', label: 'Daily Updates' },
          },
        ]}
      />


      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card feature-card-1">
              <div className="feature-icon" style={{ fontSize: '2rem' }}>🥗</div>
              <h3>100% Hygienic</h3>
              <p>Strict quality standards and fresh ingredients used daily</p>
            </div>
            <div className="feature-card feature-card-2">
              <div className="feature-icon" style={{ fontSize: '2rem' }}>⚡</div>
              <h3>Quick Pickup</h3>
              <p>Order online through our portal and skip the long queues</p>
            </div>
            <div className="feature-card feature-card-3">
              <div className="feature-icon" style={{ fontSize: '2rem' }}>🎓</div>
              <h3>Student Pricing</h3>
              <p>Wallet-friendly rates designed for students</p>
            </div>
            <div className="feature-card feature-card-4">
              <div className="feature-icon" style={{ fontSize: '2rem' }}>🕒</div>
              <h3>Convenient Timing</h3>
              <p>Open from early breakfast till late evening snacks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Explore Our Food Zones</h2>
            <p>From traditional South Indian breakfast to quick evening refreshments</p>
          </div>

          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.link}
                className="category-card"
              >
                <div className="category-image-container">
                  <Image
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                    fallback="/assets/no-image-placeholder.svg"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <span className="shop-now">
                    View Menu <FiArrowRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Today's Specials</h2>
            <p>Don't miss out on our chef's daily recommendations</p>
          </div>

          {loading ? (
            <div className="products-loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/products" className="btn-view-all">
              Explore Full Food Menu
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }} className="py-16 text-white">
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          zIndex: 0
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '250px',
          height: '250px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          zIndex: 0
        }}></div>
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ marginBottom: '1rem' }}>Never Miss a Special!</h2>
          <p style={{ marginBottom: '2rem', opacity: 0.9, fontSize: '1.125rem' }} className="mt-2 opacity-90">
            Subscribe to get daily updates on the menu and special festive delicacies.
          </p>
          <form
            style={{ display: 'flex', justifyContent: 'center', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="form-input rounded-md"
              style={{
                flex: 1,
                padding: '0.875rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <button
              type="submit"
              className="btn btn-secondary"
              style={{
                background: 'white',
                color: 'var(--primary)',
                border: 'none',
                padding: '0.875rem 2rem',
                borderRadius: '12px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f9ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
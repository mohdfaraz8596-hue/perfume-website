import { useState } from 'react'
import './App.css'
import toast, { Toaster } from 'react-hot-toast';
  // <-- YEH NAYI LINE ADD KAREIN

function App() {
  // States
  const [view, setView] = useState('home') // 'home', 'cart', 'address', 'payment'
  const [cart, setCart] = useState([])
  const [address, setAddress] = useState({
    fullName: '', mobile: '', house: '', street: '', landmark: '', city: '', state: '', pincode: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('upi')

  // Perfume Data
  const perfumes = [
    { id: 1, name: 'TRIO ROYALE OUD', price: 1500, image: '/perfume1.jpg', description: 'A rich and sophisticated oud fragrance with a warm, luxurious character.' },
    { id: 2, name: 'TRIO NOIR', price: 1200, image: '/perfume2.jpg', description: 'A bold and captivating scent crafted for confidence and timeless elegance.' },
    { id: 3, name: 'TRIO AMBER', price: 1000, image: '/perfume3.jpg', description: 'A warm and sensual fragrance with a refined amber essence.' },
    { id: 4, name: 'TRIO BLUE', price: 1000, image: '/perfume4.jpg', description: 'A fresh and invigorating scent designed for a confident everyday presence.' },
    { id: 5, name: 'TRIO MUSK', price: 1000, image: '/perfume5.jpg', description: 'A smooth and elegant fragrance with a soft, memorable finish.' },
  ]

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryCharge = cart.length > 0 ? 45 : 0
  const totalAmount = subtotal + deliveryCharge

  // Scroll Functions
  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setView('home'); }
  const scrollToShop = () => { const el = document.getElementById('shop'); if (el) el.scrollIntoView({ behavior: 'smooth' }); setView('home'); }
  const scrollToAbout = () => { const el = document.getElementById('about'); if (el) el.scrollIntoView({ behavior: 'smooth' }); setView('home'); }
  const scrollToContact = () => { const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); setView('home'); }

  // Add to Cart
  const addToCart = (perfume) => {
    const existingItem = cart.find(item => item.id === perfume.id);
    
    if (existingItem) {
      // Agar item pehle se hai, toh quantity badha do
      setCart(cart.map(item => 
        item.id === perfume.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      // Agar naya item hai, toh quantity 1 ke saath add karo
      setCart([...cart, { ...perfume, quantity: 1 }]);
    }
    toast.success(`${perfume.name} added to cart!`);
  }
  // Cart se item hatane ke liye
  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
    toast.error("Item removed from cart");
  };
  // Quantity badhane ke liye
  const increaseQuantity = (index) => {
    const newCart = [...cart];
    newCart[index].quantity += 1;
    setCart(newCart);
  };

  // Quantity ghatane ke liye
  const decreaseQuantity = (index) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      setCart(newCart);
    } else {
      // Agar quantity 1 hai aur minus dabaya, toh item remove kar do
      removeFromCart(index);
    }
  };
  // UPI App kholne ke liye
  function openUPIApp() {
    const upiLink = `upi://pay?pa=6287uk@ybl&pn=TRIO &am=${totalAmount}&cu=INR&tn=TRIO Order`;
    window.location.href = upiLink;
  }

  // Address Form Handling
  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }
const handleAddressSubmit = async (e) => {
    e.preventDefault()
    
    // Backend ko address data bhejna
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...address, 
          items: cart, 
          totalAmount: totalAmount, 
          paymentMethod: 'To be selected' 
        })
      });

      if (response.ok) {
        toast.success("Address submitted! Please select a payment method.")
        setView('payment')
      } else {
        toast.error("Failed to save address. Try again.")
      }
    } catch (error) {
      console.error(error);
      toast.error("Server connect nahi ho pa raha. Backend check karein.");
    }
  }

  // Final Order Submit (Payment ke baad)
  const handlePaymentSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...address,
          items: cart,
          totalAmount: totalAmount,
          paymentMethod: paymentMethod.toUpperCase(),
          status: 'Paid via UPI'
        })
      });

      if (response.ok) {
        alert(`Order Placed Successfully! Payment Method: ${paymentMethod.toUpperCase()}`);
        setCart([]);
        setView('home');
      } else {
        alert("Order place karne mein dikkat aayi. Dobara try karein.");
      }
    } catch (error) {
      console.error(error);
      alert("Server se connect nahi ho pa raha. Kya backend chal raha hai?");
    }
  }

  return (
    <div className="app">
      <Toaster position="top-center" />
      {/* Navbar */}
      <nav className="navbar">
        <h1 onClick={scrollToTop}> TRIO — HOUSE OF STYLE</h1>
        <ul>
          <li onClick={scrollToTop}>Home</li>
          <li onClick={scrollToShop}>Shop</li>
          <li onClick={scrollToAbout}>About</li>
          <li onClick={scrollToContact}>Contact</li>
          <li className="cart-icon" onClick={() => setView('cart')}>🛒 Cart ({cart.length})</li>
        </ul>
      </nav>

      {/* ================= HOME PAGE ================= */}
      {view === 'home' && (
        <>
          <header className="hero">
            <h2>TRIO</h2>
            <h3 className="hero-tagline">Three Names. One Signature Scent.</h3>
            <p>Discover a refined collection of premium fragrances created for those who appreciate confidence, elegance, and individuality.</p>
            <p className="hero-sub">Explore our signature scents and find the fragrance that reflects your personality.</p>
            <div className="hero-buttons">
              <button className="hero-btn" onClick={scrollToShop}>SHOP NOW</button>
              <button className="hero-btn outline" onClick={scrollToShop}>EXPLORE COLLECTION</button>
            </div>
          </header>

          <section className="products" id="shop">
            <h2>OUR SIGNATURE COLLECTION</h2>
            <p className="section-subtitle">Discover Your Distinctive Scent</p>
            <div className="product-grid">
              {perfumes.map((perfume) => (
                <div className="product-card" key={perfume.id}>
                  <img src={perfume.image} alt={perfume.name} />
                  <h3>{perfume.name}</h3>
                  <p className="description">{perfume.description}</p>
                  <p className="price">₹{perfume.price}</p>
                  <button onClick={() => addToCart(perfume)}>Add to Cart</button>
                </div>
              ))}
            </div>
          </section>

          <section className="story">
            <h2>THE TRIO STORY</h2>
            <h3 className="story-heading">Crafted with Purpose. Worn with Confidence.</h3>
            <p>TRIO was founded by Faraz, Adil, and Amaan with a shared vision to create distinctive fragrances that leave a lasting impression.</p>
            <p>Every TRIO fragrance is designed to complement your personality, elevate your presence, and become part of your signature style.</p>
          </section>

          <section className="why-trio">
            <h2>WHY TRIO?</h2>
            <ul>
              <li>Distinctive and memorable fragrances</li>
              <li>Refined and elegant packaging</li>
              <li>Carefully selected fragrance profiles</li>
              <li>Designed for everyday wear and special occasions</li>
              <li>Created for individuals who value quality and style</li>
            </ul>
          </section>

          <section className="about" id="about">
            <h2>ABOUT TRIO</h2>
            <h3 className="about-tagline">A Scent That Speaks for You</h3>
            <p>TRIO is a modern fragrance brand founded by Faraz, Adil, and Amaan.</p>
            <p>Born from a shared passion for style, confidence, and self-expression, TRIO creates premium fragrances for people who want to stand out effortlessly.</p>
            <p>From bold oud and deep noir to warm amber, fresh blue, and smooth musk, every scent is designed to match a different mood and become a part of your identity.</p>
            <p className="about-highlight">Because fragrance is not just something you wear.<br />It is the impression you leave behind.</p>
            <p className="about-brand">TRIO</p>
            <p className="about-slogan">Three Names. One Signature.</p>
          </section>

          <section className="contact" id="contact">
            <h2>CONTACT TRIO</h2>
            <h3 className="contact-tagline">We’d Love to Hear from You</h3>
            <p>Have a question about our fragrances, orders, or products? Our team is here to help.</p>
            <p>Whether you need assistance choosing your signature scent or want to know more about TRIO, feel free to get in touch with us.</p>
            <div className="contact-details">
              <h4>GET IN TOUCH</h4>
              <p>Email: trioperfume2@gmail.com</p>
              <p>Phone: +91 6387808596</p>
              <p>WhatsApp: +91 6387808596</p>
              <p>Location: Lucknow, Uttar Pradesh, India</p>
              <h4 className="support-heading">CUSTOMER SUPPORT</h4>
              <p>Monday to Saturday</p>
              <p>10:00 AM – 6:00 PM</p>
            </div>
            <p className="contact-footer-text">Send us a message and we’ll get back to you as soon as possible.</p>
            <p className="about-brand">TRIO</p>
            <p className="about-slogan">Three Names. One Signature Scent.</p>
          </section>

          <section className="final-cta">
            <h2>FIND YOUR SIGNATURE SCENT</h2>
            <p>Your fragrance is more than a scent—it is an expression of who you are.</p>
            <p>Discover the TRIO collection and make every moment unforgettable.</p>
            <button className="hero-btn" onClick={scrollToShop}>SHOP THE COLLECTION</button>
          </section>
        </>
      )}

      {/* ================= CART PAGE ================= */}
      {view === 'cart' && (
        <div className="checkout-page">
          <h2>YOUR CART</h2>
          <div className="cart-container">
            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is currently empty. Start shopping!</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item, index) => (
                    <div className="cart-item" key={index}>
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>₹{item.price} x {item.quantity}</p>
                      </div>
                      
                      {/* Quantity Badhane/Ghatane ke Buttons */}
                      <div className="quantity-controls">
                        <button onClick={() => decreaseQuantity(index)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQuantity(index)}>+</button>
                      </div>

                      {/* Remove Button */}
                      <button className="remove-btn" onClick={() => removeFromCart(index)}>
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
                  <div className="summary-row"><span>Delivery Charge</span><span>₹{deliveryCharge}</span></div>
                  <div className="summary-row total"><span>Total Amount</span><span>₹{totalAmount}</span></div>
                  <button className="hero-btn" onClick={() => setView('address')}>PROCEED TO BUY</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= ADDRESS PAGE ================= */}
      {view === 'address' && (
        <div className="checkout-page">
          <h2>DELIVERY ADDRESS</h2>
          <p className="checkout-subtitle">Please enter your complete address carefully to ensure a smooth and timely delivery.</p>
          <form className="address-form" onSubmit={handleAddressSubmit}>
            <input type="text" name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleAddressChange} required />
            <input type="tel" name="mobile" placeholder="Mobile Number" value={address.mobile} onChange={handleAddressChange} required />
            <input type="text" name="house" placeholder="House/Flat/Shop Number" value={address.house} onChange={handleAddressChange} required />
            <input type="text" name="street" placeholder="Street/Colony/Locality" value={address.street} onChange={handleAddressChange} required />
            <input type="text" name="landmark" placeholder="Landmark" value={address.landmark} onChange={handleAddressChange} />
            <input type="text" name="city" placeholder="City" value={address.city} onChange={handleAddressChange} required />
            <input type="text" name="state" placeholder="State" value={address.state} onChange={handleAddressChange} required />
            <input type="text" name="pincode" placeholder="PIN Code" value={address.pincode} onChange={handleAddressChange} required />
            <button type="submit" className="hero-btn">CONTINUE</button>
          </form>
        </div>
      )}

      {/* ================= PAYMENT PAGE ================= */}
      {view === 'payment' && (
        <div className="checkout-page">
          <h2>PAYMENT OPTIONS</h2>
          <p className="checkout-subtitle">Choose your preferred payment method.</p>
          
          <div className="payment-options">
            <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
              <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
              <div className="payment-text">
                <h4>UPI Payment</h4>
                <p>Pay securely using Google Pay, PhonePe, Paytm, or any UPI app.</p>
              </div>
            </label>

            <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
              <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <div className="payment-text">
                <h4>Cash on Delivery</h4>
                <p>Pay in cash when your order is delivered to your address.</p>
              </div>
            </label>
          </div>

          {/* UPI Payment Details - Only show if UPI is selected */}
          {paymentMethod === 'upi' && (
            <div className="upi-box">
              <p>Pay to: <strong>6287uk@ybl</strong></p>
              <p>Amount: <strong>₹{totalAmount}</strong></p>
              <button className="hero-btn pay-now-btn" onClick={openUPIApp}>
                PAY NOW (Open UPI App)
              </button>
              <p className="upi-note">After paying, click "I HAVE PAID" below.</p>
            </div>
          )}

          <button className="hero-btn" onClick={handlePaymentSubmit}>
            {paymentMethod === 'upi' ? 'I HAVE PAID' : 'CONTINUE TO PAYMENT'}
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <h3>TRIO</h3>
        <p>Three Names. One Signature Scent.</p>
        <p className="creators">Created by Faraz • Adil • Amaan</p>
      </footer>
    </div>
  )
}

export default App
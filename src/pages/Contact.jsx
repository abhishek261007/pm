import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import TabBar from '../components/TabBar';
import OrderIcon from '../components/OrderIcon';

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .contact-root {
    min-height: 100vh;
    background: #F7F6F3;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: 300;
    color: #2C1810;
    -webkit-font-smoothing: antialiased;
  }

  /* Gradient Header */
  .header-block {
    background: linear-gradient(135deg, #8B1A4A, #1B3A5C, #4A8B7C);
    padding: calc(16px + env(safe-area-inset-top, 36px)) 16px 16px;
    border-bottom-left-radius: 28px;
    border-bottom-right-radius: 28px;
  }

  .header-inner {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  .header-titles {
    flex: 1;
    overflow: hidden;
  }

  .header-eyebrow {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 3px;
    color: rgba(255,255,255,0.85);
    margin-bottom: 2px;
  }

  .header-title {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 28px;
    font-weight: 200;
    color: #FFFFFF;
    letter-spacing: -0.5px;
    line-height: 30px;
  }

  .header-cart-btn {
    width: 64px; height: 64px;
    border-radius: 14px;
    background: rgba(255,255,255,0.15);
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    text-decoration: none;
    flex-shrink: 0;
    transition: background 0.2s ease, transform 0.15s ease;
  }
  .header-cart-btn:hover {
    background: rgba(255,255,255,0.22);
  }
  .header-cart-label {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.95);
    line-height: 1;
  }

  /* Page Body */
  .page-body {
    padding: 16px 16px 90px;
    max-width: 600px;
    margin: 0 auto;
  }

  /* Contact Cards */
  .contact-card {
    background: #FFFFFF;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(15,38,64,0.06);
    margin-bottom: 16px;
  }

  .card-title {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 1.4rem;
    font-weight: 200;
    color: #2C1810;
    margin-bottom: 16px;
  }

  .contact-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .contact-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
    background: #F5F0EB;
    border-radius: 12px;
  }

  .contact-icon {
    font-size: 24px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
    border-radius: 10px;
    flex-shrink: 0;
  }

  .contact-content { flex: 1; }

  .contact-label {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #8A7A6B;
    margin-bottom: 4px;
  }

  .contact-value {
    font-size: 14px;
    font-weight: 400;
    color: #2C1810;
    line-height: 1.5;
  }

  .contact-value a {
    color: #1B3A5C;
    text-decoration: none;
  }

  .contact-value a:hover {
    text-decoration: underline;
  }

  .contact-value strong {
    font-weight: 500;
  }

  .faq-section {
    margin-top: 24px;
  }

  .faq-item {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(15,38,64,0.06);
  }

  .faq-question {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #2C1810;
    margin-bottom: 8px;
  }

  .faq-answer {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #8A7A6B;
    line-height: 1.6;
  }

  @media (min-width: 768px) {
    .page-body { padding: 24px 40px 90px; }
  }
`;

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact PM Jewellers — Wholesale Silver Jewellery, Ahmedabad"
        description="Get in touch with PM Jewellers. We're located in Manekchowk, Ahmedabad and ship nationwide. Contact us for silver jewellery wholesale inquiries — silver juda, payal, bangles, rings, earrings, necklace."
        keywords="PM Jewellers contact, silver jewellers Ahmedabad, wholesale silver contact, Manekchowk jewellers, silver jewellery suppliers, PM Jewellers phone, silver jewellery Gujarat"
        url="/contact"
        type="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "url": "https://pmjewellers.com/contact",
          "name": "Contact PM Jewellers",
          "description": "Get in touch with PM Jewellers - Silver jewellery wholesaler in Ahmedabad, Manekchowk",
          "mainEntity": {
            "@type": "Organization",
            "name": "PM Jewellers",
            "telephone": "+919712779146",
            "telephoneAlt": "+919662279707",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Chandidham Complex, 1204/F2, MGH Road",
              "addressLocality": "Old City",
              "addressRegion": "GJ",
              "postalCode": "380001",
              "addressCountry": "IN"
            }
          }
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' }
        ]}
      />
      <style>{styles}</style>
      <div className="contact-root">
        {/* Header */}
        <div className="header-block">
          <div className="header-inner">
            <div className="header-titles">
              <p className="header-eyebrow">Get in touch</p>
              <h1 className="header-title">Contact Us</h1>
            </div>
            <Link className="header-cart-btn" to="/cart">
              <OrderIcon />
              <span className="header-cart-label">My Order</span>
            </Link>
          </div>
        </div>

        {/* Page Body */}
        <div className="page-body">
          {/* Store Information */}
          <div className="contact-card">
            <h2 className="card-title">Visit Our Store</h2>
            <div className="contact-grid">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-content">
                  <p className="contact-label">Address</p>
                  <p className="contact-value">
                    Chandidham Complex, 1204/F2, MGH Road<br />
                    Old City, Manekchowk, Ahmedabad — 380001
                  </p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-content">
                  <p className="contact-label">Shop Phone</p>
                  <p className="contact-value">
                    <a href="tel:+919712779146">
                      <strong>097127 79146</strong>
                    </a>
                  </p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">☎️</div>
                <div className="contact-content">
                  <p className="contact-label">Office Phone</p>
                  <p className="contact-value">
                    <a href="tel:+919662279707">
                      <strong>96622 79707</strong>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="contact-card">
            <h2 className="card-title">Business Hours</h2>
            <div className="faq-item">
              <p className="contact-value">
                <strong>We're open Monday to Saturday:</strong>
              </p>
              <p className="contact-value">
                9:00 AM — 8:00 PM IST
              </p>
            </div>
            <div className="faq-item">
              <p className="contact-value">
                <strong>Sunday:</strong>
              </p>
              <p className="contact-value">
                Closed
              </p>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="faq-section">
            <div className="contact-card">
              <h2 className="card-title">Frequently Asked Questions</h2>
              <div className="faq-item">
                <p className="faq-question">📦 Do you ship nationwide?</p>
                <p className="faq-answer">
                  Yes, we ship to retailers and wholesalers all across India. You can contact us for shipping rates based on your location.
                </p>
              </div>
              <div className="faq-item">
                <p className="faq-question">✍️ Can I order custom designs?</p>
                <p className="faq-answer">
                  Yes, we offer custom design services for bulk orders. Contact our wholesale team to discuss your requirements.
                </p>
              </div>
              <div className="faq-item">
                <p className="faq-question">🎯 What is your minimum order quantity?</p>
                <p className="faq-answer">
                  We accept orders from 1 piece for small retailers. For wholesale pricing and bigger orders, please contact us directly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <TabBar />
      </div>
    </>
  );
}
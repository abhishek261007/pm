import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import TabBar from '../components/TabBar';

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .error-root {
    min-height: 100vh;
    background: #F7F6F3;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: 300;
    color: #2C1810;
    -webkit-font-smoothing: antialiased;
    display: flex;
    flex-direction: column;
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
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    text-align: center;
  }

  /* Error Components */
  .error-code {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 8rem;
    font-weight: 300;
    color: #8B1A4A;
    line-height: 1;
    margin-bottom: 24px;
  }

  .error-title {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 2rem;
    font-weight: 200;
    color: #2C1810;
    margin-bottom: 16px;
  }

  .error-message {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 1rem;
    font-weight: 300;
    color: #8A7A6B;
    max-width: 400px;
    line-height: 1.6;
    margin-bottom: 32px;
  }

  .btn-home {
    display: inline-block;
    padding: 16px 32px;
    background: #8B1A4A;
    color: #FFFFFF;
    text-decoration: none;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    border-radius: 10px;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .btn-home:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    .error-code { font-size: 10rem; }
    .page-body { padding: 24px 40px; }
  }
`;

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Page Not Found — PM Jewellers"
        description="Oops! The page you're looking for doesn't exist on PM Jewellers. Browse our collections or visit our about page."
        keywords="page not found, 404 error, PM Jewellers"
        url="/404"
        noindex={true}
        canonical="/404"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: '404', url: '/404' }
        ]}
      />
      <style>{styles}</style>
      <div className="error-root">
        {/* Header */}
        <div className="header-block">
          <div className="header-inner">
            <div className="header-titles">
              <p className="header-eyebrow">Error</p>
              <h1 className="header-title">Page Not Found</h1>
            </div>
            <Link className="header-cart-btn" to="/">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="header-cart-label">Home</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="page-body">
          <div className="error-code">4✎</div>
          <h2 className="error-title">Oops! Something went wrong</h2>
          <p className="error-message">
            The page you're looking for doesn't exist or has been moved. Check the URL and try again, or visit our home page to explore our collections.
          </p>
          <button className="btn-home" onClick={() => navigate('/')}>
            Return Home
          </button>
        </div>
      </div>
      <TabBar />
    </>
  );
}
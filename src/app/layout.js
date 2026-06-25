import "./globals.css";

export const metadata = {
  title: "MotorBill - Billing Software",
  description: "Advanced billing software for motor companies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <nav className="sidebar">
            <div className="logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '2.5rem', fontWeight: 900, color: '#c2410c', letterSpacing: '1px', lineHeight: 1 }}>
                H<span style={{ color: '#facc15', margin: '0 -4px', fontSize: '2.2rem', textShadow: '1px 1px 0px rgba(0,0,0,0.2)' }}>⚡</span>PE
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
                HORSE POWER ELECTRICAL
              </div>
            </div>
            <ul className="nav-links">
              <li><a href="/">Billing Dashboard</a></li>
              <li><a href="/customers">Customer details fill</a></li>
              <li><a href="/export">Report to excel</a></li>
            </ul>
          </nav>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

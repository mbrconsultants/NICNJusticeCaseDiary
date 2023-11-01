import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav style={{  padding: '10px' }}>
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
        <li style={{ marginRight: '10px' }}>
          <Link to="/dashboard" style={{ color: 'green', textDecoration: 'none' }}>
            Home
          </Link>
        </li>
        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={pathname} style={{ marginRight: '10px' }}>
              {isLast ? (
                <span style={{ green: 'white', fontWeight: 'bold' }}>
                  {pathname}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  style={{ color: 'white', textDecoration: 'none' }}
                >
                  {pathname}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Header;

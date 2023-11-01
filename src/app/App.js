import React, { useContext, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import SettingsPanel from './shared/SettingsPanel';
import Footer from './shared/Footer';
import { withTranslation } from 'react-i18next';
import { Context } from '../auth/Context';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App(props) {
  const { location, i18n } = props;
  const { user } = useContext(Context);
  const isAuthenticated = user !== null;

  const isFullPageLayout = () => {
    const fullPageLayoutRoutes = [
      '/login',
      '/forgetpassword'
    ];
    return fullPageLayoutRoutes.includes(location.pathname);
  };

  useEffect(() => {
    onRouteChanged();
  }, [location]);

  const onRouteChanged = () => {
    console.log('ROUTE CHANGED');
    const body = document.querySelector('body');
    if (location.pathname === '/layout/RtlLayout') {
      body.classList.add('rtl');
      i18n.changeLanguage('ar');
    } else {
      body.classList.remove('rtl');
      i18n.changeLanguage('en');
    }
    window.scrollTo(0, 0);
    if (isFullPageLayout()) {
      document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
    } else {
      document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
    }
  };

  const navbarComponent = !isFullPageLayout() && isAuthenticated ? <Navbar /> : null;
  const sidebarComponent = !isFullPageLayout() && isAuthenticated ? <Sidebar /> : null;
  const settingsPanelComponent = !isFullPageLayout() && isAuthenticated ? <SettingsPanel /> : null;
  const footerComponent = !isFullPageLayout() && isAuthenticated ? <Footer /> : null;

  return (

    <div className="container-scroller">
      {navbarComponent}
      <div className="container-fluid page-body-wrapper">
        {sidebarComponent}
        <div className="main-panel">
          <div className="content-wrapper">
            <AppRoutes /> 
            {settingsPanelComponent}
          </div>
          <ToastContainer/>
          {footerComponent}
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(withRouter(App));
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from 'State/AuthSlice/LoginSlice';
import { notifications } from '@mantine/notifications';

const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID || '';

// Use the provided Meta logo image
const META_LOGO_URL = 'https://objectstore.e2enetworks.net/caviaarmode/meta-icon.webp';

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: any;
  }
}

function loadFacebookSDK() {
  if (window.FB) return;
  ((d, s, id) => {
    const fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    const js = d.createElement(s) as HTMLScriptElement;
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode?.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
}

interface FacebookLoginButtonProps {
  mode: 'login' | 'register';
}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({ mode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    loadFacebookSDK();
    
    window.fbAsyncInit = function () {
      window.FB?.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v19.0',
      });
      setIsSDKReady(true);
      setIsInitialized(true);
    };
  }, []);

  const handleFBLogin = () => {
    // Check if SDK is loaded and initialized
    if (!window.FB || !isSDKReady || !isInitialized) {
      notifications.show({
        title: 'Meta SDK not ready',
        message: 'Please wait a moment and try again.',
        color: 'red',
      });
      return;
    }

    // Additional check to ensure FB.init() has been called
    if (!window.FB.getLoginStatus) {
      notifications.show({
        title: 'Meta SDK not initialized',
        message: 'Please try again in a moment.',
        color: 'red',
      });
      return;
    }

    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          // Send the access token to your backend
          fetch('/api/auth/facebook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: accessToken }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.token) {
                dispatch(setCredentials({ userToken: data.token, userInfo: data.user }));
                notifications.show({
                  title: 'Login Successful',
                  message: 'Welcome! You have been logged in successfully.',
                  color: 'green',
                });
                navigate('/');
              } else {
                throw new Error(data.message || 'Meta login failed');
              }
            })
            .catch((error) => {
              notifications.show({
                title: 'Login Failed',
                message: error.message || 'Meta login failed. Please try again.',
                color: 'red',
              });
            });
        } else {
          notifications.show({
            title: 'Login Cancelled',
            message: 'Meta login was cancelled or failed.',
            color: 'red',
          });
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  return (
    <button
      type="button"
      onClick={handleFBLogin}
      disabled={!isSDKReady || !isInitialized}
      style={{
        background: '#fff',
        color: '#222',
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        padding: '0 16px 0 24px', // more left padding
        fontWeight: 500,
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        cursor: isSDKReady && isInitialized ? 'pointer' : 'not-allowed',
        width: '100%',
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 0,
        boxSizing: 'border-box',
        transition: 'background 0.2s, border 0.2s',
        letterSpacing: '0.02em',
        opacity: isSDKReady && isInitialized ? 1 : 0.6,
      }}
      onMouseOver={e => {
        if (isSDKReady && isInitialized) {
          e.currentTarget.style.background = '#f5f6fa';
        }
      }}
      onMouseOut={e => {
        if (isSDKReady && isInitialized) {
          e.currentTarget.style.background = '#fff';
        }
      }}
    >
      <img src={META_LOGO_URL} alt="Meta" style={{ width: 24, height: 24, marginRight: 102, marginLeft: -10, objectFit: 'contain' }} />
      {mode === 'login' ? 'Sign in with Meta' : 'Sign up with Meta'}
    </button>
  );
};

export default FacebookLoginButton;
export {}; 
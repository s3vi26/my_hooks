import App from 'next/app';
import Router from 'next/router';
import { Auth0Provider } from 'use-auth0-hooks';
import Layout from '../components/layout';


const onRedirectCallback = appState => {
  if (appState && appState.returnTo) {
    Router.push({
      pathname: appState.returnTo.pathname,
      query: appState.returnTo.query
    })
  }
};

/**
 * When it hasn't been possible to retrieve a new access token.
 * @param {Error} err 
 * @param {AccessTokenRequestOptions} options 
 */
const onAccessTokenError = (err, options) => {
  console.error('Failed to retrieve access token: ', err);
};

/**
 * When signing in fails for some reason, we want to show it here.
 * @param {Error} err 
 */
const onLoginError = (err) => {
  Router.push({
    pathname: '/oops',
    query: {
      message: err.error_description || err.message
    }
  })
};

const onRedirecting = () => {
  return (
    <div>
      <h1>Signing you in</h1>
      <p>
        In order to access this page you will need to sign in.
        Please wait while we redirect you to the login page...
      </p>
    </div>
  );
};

export default class Root extends App {
  render () {
    const { Component, pageProps } = this.props;

    return (
      <Auth0Provider
        domain={process.env.AUTH0_DOMAIN}
        clientId={process.env.AUTH0_CLIENT_ID}
        redirectUri={process.env.REDIRECT_URI}
        onLoginError={onLoginError}
        onAccessTokenError={onAccessTokenError}
        onRedirecting={onRedirecting}
        onRedirectCallback={onRedirectCallback}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </Auth0Provider>
    );
  }
}

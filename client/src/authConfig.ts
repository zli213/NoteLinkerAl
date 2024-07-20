const appServicesAuthTokenUrl = ".auth/me";
const appServicesAuthTokenRefreshUrl = ".auth/refresh";
const appServicesAuthLogoutUrl = ".auth/logout?post_logout_redirect_uri=/";

interface AppServicesToken {
  id_token: string;
  access_token: string;
  user_claims: Record<string, any>;
  expires_on: string;
}

interface AuthSetup {
  useLogin: boolean;
  requireAccessControl: boolean;
  enableUnauthenticatedAccess: boolean;
  msalConfig: {
    auth: {
      clientId: string;
      authority: string;
      redirectUri: string;
      postLogoutRedirectUri: string;
      navigateToLoginRequestUrl: boolean;
    };
    cache: {
      cacheLocation: string;
      storeAuthStateInCookie: boolean;
    };
  };
  loginRequest: {
    scopes: Array<string>;
  };
  tokenRequest: {
    scopes: Array<string>;
  };
}

async function fetchAuthSetup(): Promise<AuthSetup> {
  const response = await fetch("/auth_setup");
  if (!response.ok) {
    throw new Error(`auth setup response was not ok: ${response.status}`);
  }
  return await response.json();
}

const authSetup = await fetchAuthSetup();

export const useLogin = authSetup.useLogin;

export const requireAccessControl = authSetup.requireAccessControl;

export const enableUnauthenticatedAccess =
  authSetup.enableUnauthenticatedAccess;

export const requireLogin =
  requireAccessControl && !enableUnauthenticatedAccess;

export const msalConfig = authSetup.msalConfig;

export const loginRequest = authSetup.loginRequest;

const tokenRequest = authSetup.tokenRequest;

export const getRedirectUri = () => {
  return window.location.origin + authSetup.msalConfig.auth.redirectUri;
};

declare global {
  var cachedAppServicesToken: AppServicesToken | null;
}
globalThis.cachedAppServicesToken = null;

const getAppServicesToken = (): Promise<AppServicesToken | null> => {
  const checkNotExpired = (appServicesToken: AppServicesToken) => {
    const currentDate = new Date();
    const expiresOnDate = new Date(appServicesToken.expires_on);
    return expiresOnDate > currentDate;
  };

  if (
    globalThis.cachedAppServicesToken &&
    checkNotExpired(globalThis.cachedAppServicesToken)
  ) {
    return Promise.resolve(globalThis.cachedAppServicesToken);
  }

  const getAppServicesTokenFromMe: () => Promise<AppServicesToken | null> =
    () => {
      return fetch(appServicesAuthTokenUrl).then((r) => {
        if (r.ok) {
          return r.json().then((json) => {
            if (json.length > 0) {
              return {
                id_token: json[0]["id_token"] as string,
                access_token: json[0]["access_token"] as string,
                user_claims: json[0]["user_claims"].reduce(
                  (acc: Record<string, any>, item: Record<string, any>) => {
                    acc[item.typ] = item.val;
                    return acc;
                  },
                  {}
                ) as Record<string, any>,
                expires_on: json[0]["expires_on"] as string,
              } as AppServicesToken;
            }

            return null;
          });
        }

        return null;
      });
    };

  return getAppServicesTokenFromMe().then((token) => {
    if (token) {
      if (checkNotExpired(token)) {
        globalThis.cachedAppServicesToken = token;
        return token;
      }

      return fetch(appServicesAuthTokenRefreshUrl).then((r) => {
        if (r.ok) {
          return getAppServicesTokenFromMe();
        }
        return null;
      });
    }

    return null;
  });
};

export const isUsingAppServicesLogin = (await getAppServicesToken()) != null;

export const appServicesLogout = () => {
  window.location.href = appServicesAuthLogoutUrl;
};

export const checkLoggedIn = async (): Promise<boolean> => {
  if (!requireAccessControl || enableUnauthenticatedAccess) {
    return Promise.resolve(true); // If unauthenticated access is enabled, consider user logged in.
  }

  const appServicesToken = await getAppServicesToken();
  if (appServicesToken) {
    return true;
  }

  return false;
};

export const getToken = async (): Promise<string | undefined> => {
  if (!requireAccessControl || enableUnauthenticatedAccess) {
    return Promise.resolve("unauthenticated-access-token"); // Return a mock token for unauthenticated access.
  }

  const appServicesToken = await getAppServicesToken();
  if (appServicesToken) {
    return Promise.resolve(appServicesToken.access_token);
  }

  return undefined;
};

export const getUsername = async (): Promise<string | null> => {
  if (!requireAccessControl || enableUnauthenticatedAccess) {
    return Promise.resolve("guest"); // Return a default username for unauthenticated access.
  }

  const appServicesToken = await getAppServicesToken();
  if (appServicesToken?.user_claims) {
    return appServicesToken.user_claims.preferred_username;
  }

  return null;
};

export const getTokenClaims = async (): Promise<
  Record<string, unknown> | undefined
> => {
  if (!requireAccessControl || enableUnauthenticatedAccess) {
    return Promise.resolve({ role: "guest" }); // Return default claims for unauthenticated access.
  }

  const appServicesToken = await getAppServicesToken();
  if (appServicesToken) {
    return appServicesToken.user_claims;
  }

  return undefined;
};

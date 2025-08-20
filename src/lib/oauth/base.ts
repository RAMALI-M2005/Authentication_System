
const GOOGLE_CLIENT_ID = String(process.env.GOOGLE_CLIENT_ID);
const OAUTH_REDIRECT_URL_BASE = process.env.OAUTH_REDIRECT_URL_BASE;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export class OAuthClient {
  private get redirectUrl() {
    return new URL("google", OAUTH_REDIRECT_URL_BASE);
  }

  createOAuthUrl() {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    url.searchParams.set("redirect_uri", this.redirectUrl.toString());
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid email profile");
    url.searchParams.set("access_type", "offline"); // لو عايز refresh_token
    url.searchParams.set("prompt", "consent"); // مهم لو عايز refresh_token
    return url.toString();
  }

  // 👇 هنا بقت تشتغل
  async fetchUser(code: string) {
    const { accessToken, tokenType } = await this.fetchToken(code);

    // طلب ل Google UserInfo API
    const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
    });

    const userData = await res.json();
    if (!res.ok) {
      throw new Error(userData.error || "Failed to fetch user info from Google");
    }

    return {
      email: userData.email,
      name: userData.name,
      firstName:userData.given_name || "",
      lastName:userData.familly_name || "",
      picture: userData.picture,
    };
  }

  private async fetchToken(code: string) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        redirect_uri: this.redirectUrl.toString(),
        grant_type: "authorization_code",
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET!,
      }),
    });

    const rawData = await res.json();

    if (!res.ok) {
      throw new Error(rawData.error || "Failed to fetch token from Google");
    }

    return {
      accessToken: rawData.access_token,
      tokenType: rawData.token_type,
      idToken: rawData.id_token,
      refreshToken: rawData.refresh_token,
    };
  }
}

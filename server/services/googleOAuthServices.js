"strict mode";
require("dotenv").config();
const axios = require("axios");
const qs = require("qs");
const jwt = require("jsonwebtoken");

function getGoogleOAuthUrl(role = "client") {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const state = JSON.stringify({ role });

  const options = {
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "openid",
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar.events",
    ].join(" "),
    state: encodeURIComponent(state),
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

async function getGoogleOAuthToken(code) {
  // creating rootUrl to access token
  const rootUrl = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  };

  // exchanging code for token
  try {
    const res = await axios.post(rootUrl, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}

async function getGoogleUser(id_token, token) {
  const user = jwt.decode(id_token, process.env.JWT_SECRET);
  console.log("user getGoogleUser", user);
  return user;
}

module.exports = { getGoogleOAuthUrl, getGoogleOAuthToken, getGoogleUser };

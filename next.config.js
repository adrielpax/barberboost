/** @type {import('next').NextConfig} */
// next.config.mjs ou next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development", // 🔥 DESATIVA EM DEV
  skipWaiting: true,
});

module.exports = withPWA({
  // suas outras configurações
  reactStrictMode: true,
});

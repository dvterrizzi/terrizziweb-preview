// Build environment. Production builds set SITE_ENV=production; everything else
// (local development, preview.terrizzi.nl) is treated as preview and kept out of search engines.
const production = process.env.SITE_ENV === "production";
const host = production ? "www.terrizzi.nl" : "preview.terrizzi.nl";

export default {
	production,
	host,
	url: `https://${host}`,
};

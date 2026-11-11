export default function (eleventyConfig) {
	// Static files are copied to the output as-is.
	eleventyConfig.addPassthroughCopy({ "assets": "assets" });
	eleventyConfig.addPassthroughCopy({ "images": "images" });
	eleventyConfig.addPassthroughCopy({ "CNAME": "CNAME" });

	// HTML5 UP reference pages, kept as-is (not linked in the nav).
	eleventyConfig.addPassthroughCopy({ "elements.html": "elements.html" });
	eleventyConfig.addPassthroughCopy({ "generic.html": "generic.html" });

	return {
		dir: {
			input: "src",
			includes: "_includes",
			data: "_data",
			output: "_site",
		},
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
	};
}

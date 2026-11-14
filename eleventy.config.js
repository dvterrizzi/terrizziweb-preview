export default function (eleventyConfig) {
	// Static files are copied to the output as-is.
	eleventyConfig.addPassthroughCopy({ "assets": "assets" });
	eleventyConfig.addPassthroughCopy({ "images": "images" });

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

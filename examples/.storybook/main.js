/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    "../code/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    {
      name: "storybook-addon-jsdoc-to-mdx",
      options: {
        folderPaths: ["./code"],
        extensions: ["ts", "js"]
      },
    },
    "@storybook/addon-webpack5-compiler-swc",
    "@chromatic-com/storybook"
  ],

  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {},
    },
  },

  docs: {},
};
export default config;

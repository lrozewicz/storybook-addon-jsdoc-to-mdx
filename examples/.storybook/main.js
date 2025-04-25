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
    "@chromatic-com/storybook"
  ],

  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {
        useSWC: false
      },
    },
  },

  docs: {
    autodocs: true
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    });

    return config;
  },
};
export default config;
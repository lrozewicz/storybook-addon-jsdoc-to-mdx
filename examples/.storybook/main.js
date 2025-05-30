/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    "../code/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],

  addons: ["@storybook/addon-links", "@storybook/addon-onboarding", {
    name: "storybook-addon-jsdoc-to-mdx",
    options: {
      folderPaths: ["./code"],
      extensions: ["ts", "js"]
    },
  }, "@chromatic-com/storybook", "@storybook/addon-docs"],

  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {
        useSWC: false
      },
    },
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
  }
};
export default config;
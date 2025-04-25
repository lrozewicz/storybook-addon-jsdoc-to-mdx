
# Storybook Addon: JSDoc to MDX

<div align="center">
  <img src="./assets/images/logo-min.png" width="104" alt="logo">
  <br/>
</div>
<hr/>

## Description

This Storybook addon automatically scans your project for JavaScript or TypeScript files, extracts JSDoc comments, and generates comprehensive MDX documentation. It integrates seamlessly with Storybook, enhancing your component documentation with detailed insights and examples extracted directly from your source code.

For example, the following TypeScript code:

```typescript
/**
 * Interface representing a person with an optional age property.
 */
interface Person {
    name: string;
    age?: number;
}

/**
 * Function that prints a person's name and optionally age if provided.
 * @param {Person} person The person.
 */
function printPerson(person: Person): void {
    console.log(`Name: ${person.name}`);
    if (person.age !== undefined) {
        console.log(`Age: ${person.age}`);
    }
}
```

will be shown in the Storybook as follows

<img src="./assets/images/storybook.png" alt="Storybook" style="width: 100%; height: auto;">


## Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Configuration](#configuration)
5. [Features](#features)
6. [Future Plans and Development](#future-plans-and-development)
7. [Contribution](#contribution)
8. [License](#license)
9. [Acknowledgments](#acknowledgments)

## Requirements

- Storybook@>=7.0.0 (Confirmed compatibility with Storybook@8.x including the latest 8.6.x versions)
- React, Vue, Angular, or any other framework supported by Storybook

This addon is framework-agnostic and should work with any UI framework that Storybook supports. If you encounter any compatibility issues, please open an issue on GitHub.

## Installation

To install the addon, run the following command in your terminal:

```bash
npm install storybook-addon-jsdoc-to-mdx --save-dev
```

Or if you prefer using Yarn:

```bash
yarn add storybook-addon-jsdoc-to-mdx --dev
```

## Usage

After installation, add the addon to your `.storybook/main.js` configuration file:

### Storybook 7.x

```javascript
module.exports = {
  addons: [
    // other addons
    {
      name: 'storybook-addon-jsdoc-to-mdx',
      options: {
        folderPaths: ['./src/'], // paths to folders with JS/TS code
        extensions: ['ts', 'js'] // file extensions to include
      }
    }
  ]
};
```

### Storybook 8.x (ESM format)

Below is a complete working example of a `.storybook/main.js` configuration from our test project:

```javascript
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
        useSWC: false // Recommended if you encounter issues with SWC
      },
    },
  },

  docs: {
    autodocs: true
  },
  
  // This is optional - only needed if you have issues with JSX processing
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
```

Once configured, start your Storybook as usual with `npm run storybook` or `yarn storybook`. The addon will automatically generate MDX documentation from your JSDoc comments.

### Recommended Project Structure

Here's an example project structure that works well with this addon:

```
your-project/
├── .storybook/
│   ├── main.js          # Your Storybook configuration with the addon
│   └── preview.js
├── src/
│   ├── components/      # Your React/Vue/Angular components
│   └── code/            # Your code with JSDoc comments
│       ├── interfaces/
│       │   └── index.ts # TypeScript interfaces with JSDoc
│       ├── types/
│       │   └── index.ts # Type definitions with JSDoc
│       └── utils/
│           └── index.ts # Utility functions with JSDoc
└── package.json
```

When you run Storybook, the addon will:
1. Scan the directories specified in `folderPaths` 
2. Extract JSDoc comments from `.ts` and `.js` files
3. Generate `.doc.mdx` files in the same location as your source files
4. These MDX files are then automatically displayed in Storybook

## Configuration

The addon can be configured with the following options:

- `folderPaths`: An array of paths to folders containing your source files.
- `extensions`: An array of file extensions to be included in the documentation generation process.

## Features

- **Automatic MDX Generation**: Converts JSDoc comments into MDX files that Storybook can display as documentation.
- **Supports Multiple File Types**: Works with both JavaScript and TypeScript files.
- **Customizable Path and Extension**: You can specify which directories and file types to include.
- **HTML Tag Support**: Safely handles HTML tags within JSDoc comments by automatically escaping them to prevent MDX parsing errors.
- **Complex TypeScript Support**: Properly documents complex TypeScript constructs including interfaces, type aliases, generics, and more.

## Advanced Usage

### HTML tags in JSDoc comments

The addon safely handles HTML tags in your JSDoc comments by automatically escaping them. This means you can use HTML in your documentation without causing MDX parsing errors:

```typescript
/**
 * This function accepts a <div> element and applies styles to it.
 * The <p> tags inside will be formatted according to the theme.
 * @param {HTMLElement} element - The DOM element to style
 */
function styleElement(element: HTMLElement): void {
  // Implementation...
}
```

### TypeScript Support

The addon provides comprehensive support for TypeScript language features:

- Interfaces and Types
- Generics
- Class decorators
- Method overloads
- Optional properties
- Complex nested types

### Auto-regeneration

When you run Storybook, the addon automatically regenerates documentation files whenever your source files change. This ensures your documentation always stays in sync with your code.

## Future Plans and Development

I am always looking to improve and expand the capabilities of my Storybook addon. Some of the features I'm considering for future development include:

- **Custom Documentation Templates**: Allowing users to define their own templates for the generated documentation, giving them more control over the presentation of their JS/TS code in Storybook.
- **AI-powered JSDoc Generation**: Exploring the integration of advanced AI (like Large Language Models) to automatically generate JSDoc comments for your code, making the documentation process even more seamless.
- **Markdown Support in JSDoc**: Enhanced support for Markdown formatting within JSDoc comments.

## Troubleshooting

### HTML Tags in JSDoc Comments

If you see errors like this:

```
Expected a closing tag for `<div>` before the end of `paragraph`
```

Make sure you're using the latest version of this addon which automatically escapes HTML tags in JSDoc comments.

### MDX Files Not Updating

If your MDX documentation isn't updating when you change your source files:

1. Restart Storybook
2. Check that your file paths in the addon configuration are correct
3. Make sure your JSDoc comments follow the standard format

### Webpack Compilation Issues

If you encounter webpack compilation errors when using Storybook 8.x, try disabling SWC in your Storybook configuration:

```javascript
framework: {
  name: "@storybook/react-webpack5",
  options: {
    builder: {
      useSWC: false
    },
  },
},
```

## Acknowledgments

- Thanks to the Storybook community for the continuous support and inspiration.
- Special thanks to everyone who contributed to making this addon better.

## Contribution

Contributions are welcome! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.

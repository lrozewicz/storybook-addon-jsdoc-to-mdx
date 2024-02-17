const { analyzeFolders } = require("./dist/analyzeFolders");

module.exports = {
  // Function to modify Storybook configuration
  managerEntries: (entry = [], options = {}) => {
    // Read the configuration options passed to the preset
    const { folderPaths, extensions } = options;

    // Execute the analyzeFolders function with the read paths
    if (folderPaths && extensions) {
      analyzeFolders(folderPaths, extensions);
    }

    return entry;
  },
};

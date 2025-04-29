const { analyzeFolders } = require("./dist/analyzeFolders");
const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");

module.exports = {
  // Function to modify Storybook configuration
  managerEntries: (entry = [], options = {}) => {
    // Read the configuration options passed to the preset
    const { folderPaths, extensions, outputPath } = options;

    // Set up file watchers for auto-regeneration
    if (folderPaths && extensions) {
      const watchPaths = [];
      folderPaths.forEach(folderPath => {
        extensions.forEach(ext => {
          watchPaths.push(path.join(process.cwd(), folderPath, `**/*.${ext}`));
        });
      });

      // Watch for file changes
      const watcher = chokidar.watch(watchPaths, {
        persistent: true,
        ignoreInitial: true
      });

      watcher.on('change', (changedFilePath) => {
        console.log(`File changed: ${changedFilePath}`);
        const mdxFilePath = changedFilePath.replace(/\.[^/.]+$/, ".doc.mdx");
        
        // Delete the existing MDX file if it exists
        if (fs.existsSync(mdxFilePath)) {
          fs.unlinkSync(mdxFilePath);
        }
        
        // Re-analyze the folder containing the changed file
        analyzeFolders([path.dirname(changedFilePath)], extensions, outputPath);
        console.log(`Regenerated MDX for: ${changedFilePath}`);
      });
      
      console.log('Watching for file changes...');
    }

    // Initial generation
    if (folderPaths && extensions) {
      analyzeFolders(folderPaths, extensions, outputPath);
    }

    return entry;
  },
};
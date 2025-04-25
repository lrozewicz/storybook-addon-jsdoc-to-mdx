import { analyzeFolders } from './analyzeFolders';
import path from 'path';

// Path to examples folder
const examplesPath = path.resolve(__dirname, '../examples/code');

/**
 * Regenerates MDX files for examples
 */
export function regenerateMdxFiles(): void {
  // Regenerate MDX files for examples
  analyzeFolders([examplesPath], ['ts', 'js']);
  console.log('MDX files have been regenerated.');
}

// Execute regeneration when this module is imported directly
regenerateMdxFiles();
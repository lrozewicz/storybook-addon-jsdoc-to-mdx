import path from 'path';
import { analyzeFolders } from './analyzeFolders';
import { regenerateMdxFiles } from './regenerate';

// Mock the analyzeFolders module
jest.mock('./analyzeFolders', () => ({
  analyzeFolders: jest.fn()
}));

// Mock console.log to prevent output during tests
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('regenerateMdxFiles', () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call analyzeFolders with the correct parameters', () => {
    // Call the function directly
    regenerateMdxFiles();
    
    // Assert
    const expectedPath = path.resolve(__dirname, '../examples/code');
    expect(analyzeFolders).toHaveBeenCalledTimes(1);
    expect(analyzeFolders).toHaveBeenCalledWith([expectedPath], ['ts', 'js']);
  });

  it('should log a message when regeneration is complete', () => {
    // Call the function directly
    regenerateMdxFiles();
    
    // Assert
    expect(console.log).toHaveBeenCalledWith('MDX files have been regenerated.');
  });
});
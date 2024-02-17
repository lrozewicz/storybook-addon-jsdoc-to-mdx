import { createMdxContent } from "./mdxContent";
import * as utils from "./utils";

// Mock the utils functions
jest.mock("./utils", () => ({
  formatJsDocComment: jest.fn(),
  removeCommentsFromCode: jest.fn(),
}));

describe("createMdxContent", () => {
  // Reset mock implementations before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create MDX content from JsDoc comments", () => {
    // Mock data
    const jsDocComments = [
      {
        name: "TestFunction",
        type: "Function",
        comment: "This is a test function",
        code: "function test() {} // This is a comment",
      },
    ];

    const pathName = "test/path";

    (utils.formatJsDocComment as jest.Mock).mockImplementation((comment) => `Formatted: ${comment}`);
    (utils.removeCommentsFromCode as jest.Mock).mockImplementation((code) => code.replace(/\/\/.*$/, ""));

    const result = createMdxContent(jsDocComments, pathName);

    expect(result).toContain("TestFunction");
    expect(result).toContain("Formatted: This is a test function");
    expect(result).toContain("function test() {}");
    expect(utils.formatJsDocComment).toHaveBeenCalledTimes(jsDocComments.length);
    expect(utils.removeCommentsFromCode).toHaveBeenCalledTimes(jsDocComments.length);
  });

  it("should handle unnamed JsDoc comments correctly", () => {
    // Mock data with an unnamed comment
    const jsDocComments = [
      {
        name: "Unnamed",
        type: "Variable",
        comment: "This is an unnamed variable",
        code: "let unnamedVar = true; // This is a comment",
      },
    ];

    const pathName = "unnamed/path";

    // Setup mock implementations
    (utils.formatJsDocComment as jest.Mock).mockImplementation((comment) => `Formatted: ${comment}`);
    (utils.removeCommentsFromCode as jest.Mock).mockImplementation((code) => code.replace(/\/\/.*$/, ""));

    const result = createMdxContent(jsDocComments, pathName);

    // Assertions to verify the content for unnamed JsDoc comment
    expect(result).toContain("## \n"); // Since name is "Unnamed", it should not add a name in the markdown header
    expect(result).toContain("**AST Node Type:** *Variable*");
    expect(result).toContain("Formatted: This is an unnamed variable");
    expect(result).toContain("let unnamedVar = true;");
    expect(result).not.toContain("Unnamed"); // Ensure "Unnamed" is not included in the output
    expect(utils.formatJsDocComment).toHaveBeenCalledTimes(jsDocComments.length);
    expect(utils.removeCommentsFromCode).toHaveBeenCalledTimes(jsDocComments.length);
  });

});

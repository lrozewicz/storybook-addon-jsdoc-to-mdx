import { createMdxContent } from "./mdxContent";
import * as utils from "./utils";

// Mock the utils functions for isolated testing
jest.mock("./utils", () => ({
  formatJsDocComment: jest.fn((comment) => `Formatted: ${comment}`),
  removeCommentsFromCode: jest.fn((code) => `Cleaned: ${code}`),
  extractMethodFromCode: jest.fn((code, methodName) => `Extracted: ${methodName}`),
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

    const result = createMdxContent(jsDocComments, pathName);

    expect(result).toContain("TestFunction");
    expect(result).toContain("Formatted: This is a test function");
    expect(result).toContain("Cleaned: function test() {} // This is a comment");
    expect(utils.formatJsDocComment).toHaveBeenCalledTimes(jsDocComments.length);
    expect(utils.removeCommentsFromCode).toHaveBeenCalledTimes(jsDocComments.length);
    expect(utils.extractMethodFromCode).not.toHaveBeenCalled();
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

    const result = createMdxContent(jsDocComments, pathName);

    // Assertions to verify the content for unnamed JsDoc comment
    // No header for unnamed JsDoc comment
    expect(result).toContain("**AST Node Type:** *Variable*");
    expect(result).toContain("Formatted: This is an unnamed variable");
    expect(result).toContain("Cleaned: let unnamedVar = true; // This is a comment");
    expect(result).not.toContain("# Unnamed"); // Ensure "Unnamed" is not included as a heading
    expect(utils.formatJsDocComment).toHaveBeenCalledTimes(jsDocComments.length);
    expect(utils.removeCommentsFromCode).toHaveBeenCalledTimes(jsDocComments.length);
    expect(utils.extractMethodFromCode).not.toHaveBeenCalled();
  });
  
  it("should use extractMethodFromCode for method declarations", () => {
    // Mock data with a method declaration
    const jsDocComments = [
      {
        name: "testMethod",
        type: "MethodDeclaration",
        comment: "This is a test method",
        code: "class Test { testMethod() { return true; } }",
      },
    ];

    const pathName = "test/class";

    const result = createMdxContent(jsDocComments, pathName);

    expect(result).toContain("# testMethod");
    expect(result).toContain("Formatted: This is a test method");
    expect(result).toContain("Extracted: testMethod");
    expect(utils.formatJsDocComment).toHaveBeenCalledTimes(1);
    expect(utils.removeCommentsFromCode).not.toHaveBeenCalled();
    expect(utils.extractMethodFromCode).toHaveBeenCalledTimes(1);
    expect(utils.extractMethodFromCode).toHaveBeenCalledWith(
      "class Test { testMethod() { return true; } }",
      "testMethod"
    );
  });

  it("should handle unnamed method declarations correctly", () => {
    // Mock data with an unnamed method declaration
    const jsDocComments = [
      {
        name: "Unnamed",
        type: "MethodDeclaration",
        comment: "This is an unnamed method",
        code: "class Test { someMethod() { return false; } }",
      },
    ];

    const pathName = "test/class";

    const result = createMdxContent(jsDocComments, pathName);

    expect(result).toContain("**AST Node Type:** *MethodDeclaration*");
    expect(result).toContain("Formatted: This is an unnamed method");
    expect(result).toContain("Extracted: Unnamed");
    expect(result).not.toContain("# Unnamed");
    expect(utils.formatJsDocComment).toHaveBeenCalledTimes(1);
    expect(utils.removeCommentsFromCode).not.toHaveBeenCalled();
    expect(utils.extractMethodFromCode).toHaveBeenCalledTimes(1);
    expect(utils.extractMethodFromCode).toHaveBeenCalledWith(
      "class Test { someMethod() { return false; } }",
      "Unnamed"
    );
  });

  it("should format multiple JsDoc comments correctly", () => {
    // Mock data with multiple comments
    const jsDocComments = [
      {
        name: "TestFunction",
        type: "Function",
        comment: "This is a test function",
        code: "function test() { return 'test'; }",
      },
      {
        name: "testMethod",
        type: "MethodDeclaration",
        comment: "This is a test method",
        code: "class Test { testMethod() { return true; } }",
      },
      {
        name: "Unnamed",
        type: "Variable",
        comment: "This is an unnamed variable",
        code: "let unnamedVar = true;",
      },
    ];

    const pathName = "test/combined";

    const result = createMdxContent(jsDocComments, pathName);

    // Function assertions
    expect(result).toContain("# TestFunction");
    expect(result).toContain("Formatted: This is a test function");
    expect(result).toContain("Cleaned: function test() { return 'test'; }");
    
    // Method assertions
    expect(result).toContain("# testMethod");
    expect(result).toContain("Formatted: This is a test method");
    expect(result).toContain("Extracted: testMethod");
    
    // Unnamed variable assertions
    expect(result).toContain("**AST Node Type:** *Variable*");
    expect(result).toContain("Formatted: This is an unnamed variable");
    expect(result).toContain("Cleaned: let unnamedVar = true;");
    
    // Call count assertions
    expect(utils.formatJsDocComment).toHaveBeenCalledTimes(3);
    expect(utils.removeCommentsFromCode).toHaveBeenCalledTimes(2);
    expect(utils.extractMethodFromCode).toHaveBeenCalledTimes(1);
  });
});

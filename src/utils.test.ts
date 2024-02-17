import { removeCommentsFromCode, findBasePath, getPathName, formatJsDocComment } from "./utils";

describe("removeCommentsFromCode", () => {
  it("should remove comments from code", () => {
    const code = `// this is a comment\nconst a = 5;`;
    expect(removeCommentsFromCode(code)).toBe(`const a = 5;\n`);
  });

  it("should handle code without comments", () => {
    const code = `const a = 5;`;
    expect(removeCommentsFromCode(code)).toBe(`const a = 5;\n`);
  });
});

describe("findBasePath", () => {
  it("should find the base path", () => {
    const filePath = "/user/local/src/app.ts";
    const folderPaths = ["/user/local", "/user/src"];
    expect(findBasePath(filePath, folderPaths)).toBe("/user/local");
  });

  it("should return empty string if no base path is found", () => {
    const filePath = "/user/local/src/app.ts";
    const folderPaths = ["/home", "/app"];
    expect(findBasePath(filePath, folderPaths)).toBe("");
  });
});

describe("getPathName", () => {
  it("should return the correct path for a regular file", () => {
    const filePath = "/user/local/src/utils.ts";
    const baseDir = "/user/local/src";
    expect(getPathName(filePath, baseDir)).toBe("utils");
  });

  it("should handle the index.ts file correctly", () => {
    const filePath = "/user/local/src/index.ts";
    const baseDir = "/user/local";
    expect(getPathName(filePath, baseDir)).toBe("src");
  });

  it("should handle different base directories correctly", () => {
    const filePath = "/user/local/src/utils.ts";
    const baseDir = "/user";
    expect(getPathName(filePath, baseDir)).toBe("local/src/utils");
  });
});

describe("formatJsDocComment", () => {
  it("should format a simple JSDoc comment", () => {
    const comment = `
        /**
         * Simple description.
         */
      `;
    const expected = "Simple description.\n\n```bash\n\n```";
    expect(formatJsDocComment(comment)).toBe(expected);
  });

  it("should handle JSDoc comments with tags", () => {
    const comment = `
        /**
         * Description with tags.
         * @param {string} param1 - an example parameter.
         * @returns {number} - example return value.
         */
      `;
    const expected =
      "Description with tags.\n\n```bash\n@param {string} param1 - an example parameter.\n\n@returns {number} - example return value.\n```";
    expect(formatJsDocComment(comment)).toBe(expected);
  });

  it("should handle comments with extra spaces and lines", () => {
    const comment = `
        /**
         * 
         *   Description with extra spaces and lines.
         *   
         * @param {string} param1
         * 
         */
      `;
    const expected = "Description with extra spaces and lines.\n\n```bash\n@param {string} param1\n```";
    expect(formatJsDocComment(comment)).toBe(expected);
  });

  it("should handle empty JSDoc comments", () => {
    const comment = `/** */`;
    const expected = "\n\n```bash\n\n```";
    expect(formatJsDocComment(comment)).toBe(expected);
  });

  it("should handle JSDoc comments without tags", () => {
    const comment = `
        /**
         * Only a description.
         */
      `;
    const expected = "Only a description.\n\n```bash\n\n```";
    expect(formatJsDocComment(comment)).toBe(expected);
  });

  it("should handle JSDoc comments with only tags", () => {
    const comment = `
        /**
         * @param {string} param1
         * @returns {number}
         */
      `;
    const expected = "\n\n```bash\n@param {string} param1\n\n@returns {number}\n```";
    expect(formatJsDocComment(comment)).toBe(expected);
  });
});

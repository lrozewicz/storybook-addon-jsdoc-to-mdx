import { analyzeFolders, analyzeSourceFile, processNode, generateMdxContent, writeMdxFile } from "./analyzeFolders";
import type { JsDocComment } from "./types/common";
import { Project, SourceFile, Node, SyntaxKind } from "ts-morph";
import * as fs from "fs";
import ts from "typescript";

jest.mock("fs");

jest.mock('typescript', () => ({
  ...jest.requireActual('typescript'),
  createPrinter: jest.fn().mockReturnValue({
    printFile: jest.fn().mockReturnValue('')
  }),
  createSourceFile: jest.fn().mockReturnValue({
    getEnd: jest.fn().mockReturnValue(0),
    getFullText: jest.fn().mockReturnValue(''),
  }),
  ScriptTarget: {
    Latest: jest.fn()
  },
  ScriptKind: {
    TS: jest.fn()
  }
}));


interface MockNode extends Node {
  getParentOrThrow: jest.Mock;
  getName: jest.Mock;
  getKind: jest.Mock;
  getJsDocs: jest.Mock;
  getText: jest.Mock;
  getParent: jest.Mock;
  forEachChild: jest.Mock;
}

// Complementary functions for creating mocks
function createMockSourceFile(filePath: string = "path/to/file.ts") {
  return {
    getFilePath: jest.fn().mockReturnValue(filePath),
    forEachChild: jest.fn(),
  } as unknown as SourceFile;
}
function createMockNode(): MockNode {
  return {
    getKind: jest.fn(),
    getKindName: jest.fn(),
    getJsDocs: jest.fn(() => [{ getFullText: jest.fn().mockReturnValue("Some JSDoc comment") }]),
    getParentOrThrow: jest.fn(),
    getName: jest.fn().mockReturnValue("exampleMethod"),
    getText: jest.fn(),
    forEachChild: jest.fn(),
    getParent: jest.fn(),
  } as unknown as MockNode;
}

// Global test variables
const folderPaths = ["path/to/folder1", "path/to/folder2"];
const extensions = ["ts", "tsx"]; // Assuming tsx is another extension you might be interested in
const mockSourceFile = createMockSourceFile();

// Mock configuration before each test
beforeEach(() => {
  jest.clearAllMocks();
  Project.prototype.addSourceFilesAtPaths = jest.fn();
  Project.prototype.getSourceFiles = jest.fn(() => [mockSourceFile]);
});

describe("analyzeFolders", () => {
  it("should create a new Project and add source files for all extensions", () => {
    analyzeFolders(folderPaths, extensions);

    expect(Project.prototype.addSourceFilesAtPaths).toHaveBeenCalledTimes(folderPaths.length * extensions.length);
    folderPaths.forEach((folderPath) => {
      extensions.forEach((extension) => {
        const expectedPathRegex = new RegExp(folderPath.replace(/\//g, "[\\\\/]") + "[\\\\/].*\\." + extension);
        expect(Project.prototype.addSourceFilesAtPaths).toHaveBeenCalledWith(expect.stringMatching(expectedPathRegex));
      });
    });
    expect(Project.prototype.getSourceFiles).toHaveBeenCalled();
  });
});

describe("analyzeSourceFile", () => {
  it("should process source file correctly", () => {
    analyzeSourceFile(mockSourceFile, folderPaths);

    expect(mockSourceFile.getFilePath).toHaveBeenCalled();
  });
});

describe("generateMdxContent", () => {
  it("should generate MDX content from JSDoc comments", () => {
    const jsDocComments = [
      {
        name: "exampleFunction",
        type: "Function",
        comment: "This is an example function.",
        code: "function exampleFunction() {}",
      },
      {
        name: "anotherFunction",
        type: "Function",
        comment: "This is another example function.",
        code: "function anotherFunction() {}",
      },
    ];

    const content = generateMdxContent(jsDocComments, "example/pathName");
    expect(content).toBeDefined();
    expect(content).toContain("exampleFunction");
    expect(content).toContain("This is an example function.");
    expect(content).toContain("anotherFunction");
    expect(content).toContain("This is another example function.");
  });
});

describe("writeMdxFile", () => {
  it("should write content to a file", () => {
    const content = "Some MDX content";
    const filePath = "path/to/file.doc.mdx";
    writeMdxFile(filePath, content);
    expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, content);
  });
});

describe("processNode", () => {
  it("should collect JSDoc comments from nodes", () => {
    const mockNode = createMockNode();
    mockNode.getKind = jest.fn().mockReturnValue(SyntaxKind.FunctionDeclaration);
    mockNode.getJsDocs.mockReturnValue([
      {
        getFullText: jest.fn().mockReturnValue("This is a test JSDoc comment for a function"),
      },
    ]);

    const jsDocComments: JsDocComment[] = [];
    processNode(mockNode as Node, jsDocComments);

    expect(jsDocComments.length).toBeGreaterThan(0);
    expect(jsDocComments[0].comment).toContain("This is a test JSDoc comment for a function");
  });

  it("should call processNode for each child node", () => {
    mockSourceFile.forEachChild = jest.fn().mockImplementation((callback: (node: Node) => void) => {
      const mockNode = createMockNode();
      callback(mockNode);
    });

    analyzeSourceFile(mockSourceFile, folderPaths);

    expect(mockSourceFile.forEachChild).toHaveBeenCalled();
  });
});

describe("analyzeSourceFile with JSDoc comments", () => {
  it("should generate and write MDX content if JSDoc comments are found", () => {
    // Przykładowe rozszerzenia plików do przetestowania
    const extensions = ["ts", "tsx"];
    extensions.forEach((extension) => {
      const mockFilePath = `path/to/mockFile.${extension}`;
      const mockMdxFilePath = `path/to/mockFile.doc.mdx`;
      const mockBaseDir = "path/to";
      const mockSourceFile = createMockSourceFile(mockFilePath);

      // Konfiguracja mocka, aby symulować obecność komentarzy JSDoc
      mockSourceFile.forEachChild = jest.fn().mockImplementation((callback: (node: ts.Node) => void) => {
        const mockNode = createMockNode();
        mockNode.getKind.mockReturnValue(SyntaxKind.FunctionDeclaration);
        mockNode.getJsDocs.mockReturnValue([
          { getFullText: jest.fn().mockReturnValue("This is a test JSDoc comment for a function") }
        ]);
        callback(mockNode as unknown as ts.Node);
      });

      analyzeSourceFile(mockSourceFile as unknown as SourceFile, [mockBaseDir]);

      // Sprawdzenie, czy fs.writeFileSync zostało wywołane z oczekiwanymi argumentami
      expect(fs.writeFileSync).toHaveBeenCalledWith(mockMdxFilePath, expect.any(String));
    });
  });
});


describe("processNode with MethodDeclaration inside ClassDeclaration", () => {
  it("should get text from parent class for method declaration node", () => {
    const mockParentClassNode = createMockNode();
    mockParentClassNode.getKind.mockReturnValue(SyntaxKind.ClassDeclaration);
    mockParentClassNode.getText.mockReturnValue("class ExampleClass { exampleMethod() {} }");

    const mockMethodNode = createMockNode();
    mockMethodNode.getParentOrThrow.mockReturnValue(mockParentClassNode);
    mockMethodNode.getKind.mockReturnValue(SyntaxKind.MethodDeclaration);
    mockMethodNode.getParent.mockReturnValue(mockParentClassNode);

    // Explicit type for jsDocComments with required 'code'
    const jsDocComments: JsDocComment[] = [];
    processNode(mockMethodNode as unknown as Node, jsDocComments);

    expect(mockParentClassNode.getText).toHaveBeenCalled();
  });
});

describe("processNode with ClassDeclaration", () => {
  it("should call processNode for each child of a class declaration node", () => {
    const mockClassNode = createMockNode();
    mockClassNode.getKind.mockReturnValue(SyntaxKind.ClassDeclaration);

    const mockChildNode = createMockNode();
    mockClassNode.forEachChild.mockImplementation((callback) => {
      callback(mockChildNode);
    });

    const jsDocComments: JsDocComment[] = [];
    processNode(mockClassNode as unknown as Node, jsDocComments);

    expect(mockClassNode.forEachChild).toHaveBeenCalled();
  });
});

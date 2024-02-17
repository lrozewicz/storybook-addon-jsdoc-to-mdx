import { getFunctionName } from "./astAnalysis";
import { Node, SyntaxKind } from "ts-morph";

describe("getFunctionName", () => {
  it("returns the name for a method declaration", () => {
    const mockNode = {
      getName: () => "methodName",
      getKind: () => SyntaxKind.MethodDeclaration,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("methodName");
  });

  it("returns the function name for a function declaration", () => {
    const mockNode = {
      getName: () => "functionName",
      getKind: () => SyntaxKind.FunctionDeclaration,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("functionName");
  });

  it('returns "default" for default exported arrow function', () => {
    const mockNode = {
      getExpression: () => ({
        getName: () => "",
        getKind: () => SyntaxKind.ArrowFunction,
      }),
      getKind: () => SyntaxKind.ExportAssignment,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("default");
  });

  it('returns "default" for anonymous arrow function', () => {
    const mockNode = {
      getName: () => "",
      getKind: () => SyntaxKind.ArrowFunction,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("default");
  });

  it("returns the name for a class declaration", () => {
    const mockNode = {
      getName: () => "MyClass",
      getKind: () => SyntaxKind.ClassDeclaration,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("MyClass");
  });

  it("returns the name for an interface declaration", () => {
    const mockNode = {
      getName: () => "MyInterface",
      getKind: () => SyntaxKind.InterfaceDeclaration,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("MyInterface");
  });

  it("returns the name for an enum declaration", () => {
    const mockNode = {
      getName: () => "MyEnum",
      getKind: () => SyntaxKind.EnumDeclaration,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("MyEnum");
  });

  it("returns the name for a module declaration", () => {
    const mockNode = {
      getName: () => "MyModule",
      getKind: () => SyntaxKind.ModuleDeclaration,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("MyModule");
  });

  it("returns the name for a type alias declaration", () => {
    const mockNode = {
      getName: () => "MyTypeAlias",
      getKind: () => SyntaxKind.TypeAliasDeclaration,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("MyTypeAlias");
  });

  it("returns the name for a variable statement", () => {
    const mockNode = {
      getDeclarations: () => [{ getName: () => "myVariable" }],
      getKind: () => SyntaxKind.VariableStatement,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("myVariable");
  });

  it('returns "FunctionType" for function type with no return type', () => {
    const mockNode = {
      getType: () => ({
        getCallSignatures: () => [
          {
            getReturnType: () => ({ getText: () => "" }),
          },
        ],
      }),
      getKind: () => SyntaxKind.FunctionType,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("FunctionType");
  });

  it("returns the function name for a named function expression in default export", () => {
    const mockNode = {
      getExpression: () => ({
        getName: () => "namedFunction",
        getKind: () => SyntaxKind.FunctionExpression,
      }),
      getKind: () => SyntaxKind.ExportAssignment,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("namedFunction");
  });

  it('returns "Unnamed" for a node with no name', () => {
    const mockNode = {
      getName: () => "",
      getKind: () => SyntaxKind.ClassDeclaration,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("Unnamed");
  });

  it('returns "Unnamed" for a variable statement with no declarations', () => {
    const mockNode = {
      getDeclarations: () => [],
      getKind: () => SyntaxKind.VariableStatement,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("Unnamed");
  });

  it('returns "Unnamed" for a function type with no call signatures', () => {
    const mockNode = {
      getType: () => ({
        getCallSignatures: () => [], // No signatures
      }),
      getKind: () => SyntaxKind.FunctionType,
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("Unnamed");
  });

  it('returns "Unnamed" for an unhandled node kind', () => {
    const mockNode = {
      getKind: () => -1, // Unknown node type
    } as unknown as Node;
    expect(getFunctionName(mockNode)).toBe("Unnamed");
  });
});

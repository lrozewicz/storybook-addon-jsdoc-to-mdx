import {
  SyntaxKind,
  Node,
  ClassDeclaration,
  InterfaceDeclaration,
  EnumDeclaration,
  ModuleDeclaration,
  TypeAliasDeclaration,
} from "ts-morph";

export function getFunctionName(node: Node): string {
  // Try to get a name for each type of node
  const name = Node.isMethodDeclaration(node) && node.getName();
  if (name) {
    return name;
  }

  // Checking for the default function export case
  if (Node.isExportAssignment(node)) {
    const expression = node.getExpression();
    if (Node.isFunctionExpression(expression) || Node.isArrowFunction(expression)) {
      // For anonymous functions exported by default, return 'default'
      return (Node.isFunctionExpression(expression) && expression.getName()) || "default";
    }
  } else if (Node.isFunctionDeclaration(node) || Node.isArrowFunction(node)) {
    // Check for functions and arrow functions
    return (Node.isFunctionDeclaration(node) && node.getName()) || "default";
  }

  switch (node.getKind()) {
    case SyntaxKind.ClassDeclaration:
    case SyntaxKind.InterfaceDeclaration:
    case SyntaxKind.EnumDeclaration:
    case SyntaxKind.ModuleDeclaration:
    case SyntaxKind.TypeAliasDeclaration:
      // Return the name for classes, interfaces, enums, modules, and type aliases
      const namedNode = node as
        | ClassDeclaration
        | InterfaceDeclaration
        | EnumDeclaration
        | ModuleDeclaration
        | TypeAliasDeclaration;
      return namedNode.getName() || "Unnamed";
    case SyntaxKind.VariableStatement:
      // For variable declarations, try to find the name of the first declaration
      const declarations = Node.isVariableStatement(node) && node.getDeclarations();
      if (declarations && declarations.length > 0 && declarations[0].getName()) {
        return declarations[0].getName();
      }
      break;

    case SyntaxKind.FunctionType:
      // For function types, return the return type or "FunctionType"
      const signature = node.getType().getCallSignatures()[0];
      if (signature) {
        return signature.getReturnType().getText() || "FunctionType";
      }
      break;

    default:
      break;
  }

  // Return "Unnamed" if no name has been determined
  return "Unnamed";
}

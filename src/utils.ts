import path from "path";
import ts from "typescript";
import { parse } from "comment-parser";

export function removeCommentsFromCode(code: string): string {
  const printer = ts.createPrinter({ removeComments: true });
  const sourceFile = ts.createSourceFile("temp.ts", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  return printer.printFile(sourceFile);
}

export function findBasePath(filePath: string, folderPaths: string[]): string {
  for (const folderPath of folderPaths) {
    if (filePath.startsWith(folderPath)) {
      return folderPath;
    }
  }
  return "";
}

export function getPathName(filePath: string, baseDir: string): string {
  const relativePath = path.relative(baseDir, filePath);
  const dirName = path.dirname(relativePath);
  const extenstion = path.extname(filePath);
  const baseName = path.basename(relativePath, extenstion);

  if (baseName === "index") {
    return dirName.replace(/\\/g, "/");
  }

  return path.join(dirName, baseName).replace(/\\/g, "/");
}
export function extractMethodFromCode(code: string, methodName: string): string {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  let methodNode: ts.MethodDeclaration | undefined;
  function visit(node: ts.Node) {
    if (
      ts.isMethodDeclaration(node) &&
      node.name &&
      node.name.getText() === methodName
    ) {
      methodNode = node;
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  if (!methodNode) {
    return code;
  }
  const start = methodNode.getStart(sourceFile);
  const end = methodNode.end;
  return code.slice(start, end).trim();
}

function encode(str:string) {
  return str
    .replace(/[-`]/g, '\\$&')   // \- and \`
    .replace(/[{}]/g, '\\$&')   // \{ and \}
    .replace(/</g, '&lt;')      // <
    .replace(/>/g, '&gt;');     // >
}

export function formatJsDocComment(raw: string): string {
  const trimmedRaw = raw.trim();
  // Return plain strings unchanged (non JSDoc comments)
  if (!trimmedRaw.startsWith('/**')) {
    return trimmedRaw;
  }
  // Parse the raw JSDoc comment
  const { description = '', tags = [] } = parse(trimmedRaw)?.[0] || {};

  // Group tags by their `tag` field
  const grouped = tags.reduce((acc, t) => {
    (acc[t.tag] = acc[t.tag] ?? []).push(t);
    return acc;
  }, {} as Record<string, any[]>);

  // Render the JSDoc description as a Markdown block-quote
  const quotedDescription = description
    .trim()
    .split('\n')
    .map(line => `> ${encode(line)}`)
    .join('\n');

  let mdx = quotedDescription + '\n\n';

  // Parameters
  if (grouped.param) {
    const paramsBlock = grouped.param
      .map(t => `- \`${t.name}\` ${t.type ? `*${encode(t.type)}*` : ''} — ${encode(t.description.trim().replace(/^-/g, '').trim())}`)
      .join('\n');
    mdx += `#### Parameter:\n\n${paramsBlock}\n`;
  }

  // Returns
  const returnsGroup = grouped.returns || grouped.return;
  if (returnsGroup) {
    const { type = '', description: retDesc = '' } = returnsGroup[0];
    mdx += `#### Returns:\n${type ? `\`${encode(type)}\`` : ''}  ${encode(retDesc)}\n`;
  }

  // Example
  if (grouped.example) {
    console.log(`:: grouped.example) =`, grouped.example);
    const { description: exDesc = '', name: exName = '' } = grouped.example[0];
    mdx += `#### Example:\n\`\`\`ts\n${exName} ${exDesc}\n\`\`\`\n`;
  }

  // Fallback for other tags
  Object.entries(grouped).forEach(([tagName, tagList]) => {
    if (['param', 'return', 'returns', 'example'].includes(tagName)) return;

    const heading = tagName.charAt(0).toUpperCase() + tagName.slice(1);
    const lines = tagList
      .map(t =>
        t.name
          ? `- \`${t.name}\`${t.type ? ` *${t.type}*` : ''} — ${encode(t.description)}`
          : encode(t.description),
      )
      .join('\n');

    mdx += `#### ${heading}:\n${lines}\n`;
  });

  return mdx.trim();
}

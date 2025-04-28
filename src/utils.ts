import path from "path";
import ts from "typescript";
import { parse, Spec } from "comment-parser";

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
// Escape HTML tags to prevent MDX parsing errors
function escapeHtmlTags(str:string) {
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
  }, {} as Record<string, Spec[]>);

  // Render the JSDoc description as a Markdown block-quote
  const quotedDescription = description
    .trim()
    .split('\n')
    .map(line => `> ${escapeHtmlTags(line)}`)
    .join('\n');

  let mdx = quotedDescription + '\n\n';

  // Parameters
  if (grouped.param) {
    const paramsBlock = grouped.param
      .map(t => `- \`${t.name}\` ${t.type ? `*${escapeHtmlTags(t.type)}*` : ''} — ${escapeHtmlTags(t.description.trim().replace(/^-/g, '').trim())}`)
      .join('\n');
    mdx += `#### Parameter:\n\n${paramsBlock}\n`;
  }

  // Returns
  const returnsGroup = grouped.returns || grouped.return;
  if (returnsGroup) {
    const { type = '', description: retDesc = '' } = returnsGroup[0];
    mdx += `#### Returns:\n${type ? `\`${escapeHtmlTags(type)}\`` : ''}  ${escapeHtmlTags(retDesc)}\n`;
  }

  // Example
  if (grouped.example && grouped.example.length > 0) {
    mdx += `#### Example:\n`
    
    grouped.example.forEach(e => {
      const { description: exDesc = '', name: exName = '', source = [] } = e;
      
      // Prefer raw source tokens because they keep the original line breaks
      const rawLines = source
        .filter(line => typeof line.source === 'string')
        .slice(1,-1)
        .map(line => line.source.replace(/^\s*\*\s?/, '')); // strip leading "* "
      
      // Drop the first line that still contains "@example"
      const codeLines =
        rawLines.length > 1
          ? rawLines                   // use tokens if present
          : exDesc.split('\n');                        // fallback to description
      
      const exampleCode = codeLines.join('\n');
      
      mdx += `\`\`\`ts\n${exampleCode}\n\`\`\`\n`;
    })
  }

  // Fallback for other tags
  Object.entries(grouped).forEach(([tagName, tagList]) => {
    if (['param', 'return', 'returns', 'example'].includes(tagName)) return;

    const heading = tagName.charAt(0).toUpperCase() + tagName.slice(1);
    const lines = tagList
      .map(t =>
        t.name
          ? `- \`${t.name}\`${t.type ? ` *${t.type}*` : ''} — ${escapeHtmlTags(t.description)}`
          : escapeHtmlTags(t.description),
      )
      .join('\n');

    mdx += `#### ${heading}:\n${lines}\n`;
  });

  return mdx.trim();
}


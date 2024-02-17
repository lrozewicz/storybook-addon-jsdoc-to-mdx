import path from "path";
import ts from "typescript";

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

export function formatJsDocComment(comment: string): string {
  // We remove the leading /** and trailing */ as well as whitespace at the ends of the comment
  const trimmedComment = comment.replace(/\/\*\*|\*\/|^\s*\*\/gm|\s*$/g, "").trim();

  // We divide the comment into lines and remove unnecessary whitespace
  const lines = trimmedComment.split("\n").map((line) => line.replace(/^\s*\*\s?/, "").trim());

  // We are looking for the index of the first tag
  const tagsIndex = lines.findIndex((line) => line.startsWith("@"));

  // Handling the case where there are no tags
  if (tagsIndex === -1) {
    return lines.join("\n").trim() + "\n\n```bash\n\n```";
  }

  // We separate the description from the tags
  const description = lines.slice(0, tagsIndex).join("\n").trim();
  const tags = lines.slice(tagsIndex).join("\n").trim().split("@").join("\n@").slice(1);

  return `${description}\n\n\`\`\`bash\n${tags}\n\`\`\``;
}

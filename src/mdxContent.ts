import { formatJsDocComment, removeCommentsFromCode, extractMethodFromCode } from "./utils";
import type { JsDocComment } from "./types/common";

export function createMdxContent(jsDocComments: JsDocComment[], pathName: string): string {
  let mdxContent = ``;

  jsDocComments.forEach((comment: JsDocComment) => {
    if (comment.name != "Unnamed") {
      mdxContent += `# ${comment.name}\n`;
      mdxContent += `\`${pathName}\`\n`;
      mdxContent += `**AST Node Type:** *${comment.type}*\n\n`;
      mdxContent += formatJsDocComment(comment.comment) + "\n\n";
      mdxContent += `#### Surse Code:\n\n`;
      const codeSnippet =
        comment.type === "MethodDeclaration"
          ? extractMethodFromCode(comment.code, comment.name)
          : removeCommentsFromCode(comment.code);
      mdxContent += "```ts\n" + codeSnippet + "\n```\n\n";
    } else {
      mdxContent += `**AST Node Type:** *${comment.type}*\n`;
      mdxContent += formatJsDocComment(comment.comment) + "\n\n";
      mdxContent += `#### Surse Code:\n\n`;
      const codeSnippet =
        comment.type === "MethodDeclaration"
          ? extractMethodFromCode(comment.code, comment.name)
          : removeCommentsFromCode(comment.code);
      mdxContent += "```ts\n" + codeSnippet + "\n```\n\n";
    }
  });

  return mdxContent;
}

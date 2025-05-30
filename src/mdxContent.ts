import { formatJsDocComment, removeCommentsFromCode, extractMethodFromCode } from "./utils";
import type { JsDocComment } from "./types/common";

export function createMdxContent(jsDocComments: JsDocComment[], pathName: string): string {
  let mdxContent = `import { Meta } from '@storybook/addon-docs/blocks';\n\n<Meta title="${pathName}" />\n\n`;

  jsDocComments.forEach((comment: JsDocComment) => {
    if (comment.name != "Unnamed") {
      mdxContent += `# ${comment.name}\n\n`;
      mdxContent += `\`${pathName}\`\n`;
      mdxContent += `**AST Node Type:** *${comment.type}*\n\n`;
      mdxContent += formatJsDocComment(comment.comment) + "\n\n";
      mdxContent += `#### Source Code:\n\n`;
      const codeSnippet =
        comment.type === "MethodDeclaration"
          ? extractMethodFromCode(comment.code, comment.name)
          : removeCommentsFromCode(comment.code);
      mdxContent += "```ts\n" + codeSnippet + "\n```\n\n";
    } else {
      mdxContent += `----- \n`;
      mdxContent += `\`${pathName}\`\n`;
      mdxContent += `**AST Node Type:** *${comment.type}*\n`;
      mdxContent += formatJsDocComment(comment.comment) + "\n\n";
      mdxContent += `#### Source Code:\n\n`;
      const codeSnippet =
        comment.type === "MethodDeclaration"
          ? extractMethodFromCode(comment.code, comment.name)
          : removeCommentsFromCode(comment.code);
      mdxContent += "```ts\n" + codeSnippet + "\n```\n\n";
    }
  });

  return mdxContent;
}
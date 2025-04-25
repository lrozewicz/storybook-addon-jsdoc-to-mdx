import { formatJsDocComment, removeCommentsFromCode } from "./utils";
import type { JsDocComment } from "./types/common";

export function createMdxContent(jsDocComments: JsDocComment[], pathName: string): string {
  let mdxContent = `import { Meta } from '@storybook/blocks';\n\n<Meta title="${pathName}" />\n\n`;

  jsDocComments.forEach((comment: JsDocComment) => {
    if (comment.name != "Unnamed") {
      mdxContent += `## ${comment.name}\n`;
      mdxContent += `\`${pathName}\`\n\n`;
      mdxContent += `**AST Node Type:** *${comment.type}*\n\n`;
      mdxContent += `#### JSDoc annotations:\n\n`;
      mdxContent += formatJsDocComment(comment.comment) + "\n\n";
      mdxContent += `#### Code:\n\n`;
      mdxContent += "```ts\n" + removeCommentsFromCode(comment.code) + "\n```\n\n";
    } else {
        mdxContent += `## \n`;
        mdxContent += `**AST Node Type:** *${comment.type}*\n\n`;
        mdxContent += `#### JSDoc annotations:\n\n`;
        mdxContent += formatJsDocComment(comment.comment) + "\n\n";
        mdxContent += `#### Code:\n\n`;
        mdxContent += "```ts\n" + removeCommentsFromCode(comment.code) + "\n```\n\n";
    }

  });

  return mdxContent;
}
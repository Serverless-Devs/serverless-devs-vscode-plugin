import * as vscode from "vscode";
import * as fs from "fs";

const serviceDecorationTypes: vscode.TextEditorDecorationType[] =
  createDecorationTypesByOpacity({ r: 255, g: 255, b: 64 }, 0.3, 0.01, 0.03);

export async function goToFile(filePath: string, flowName?: string) {
  const document = await vscode.workspace.openTextDocument(
    vscode.Uri.file(filePath)
  );
  const editor = await vscode.window.showTextDocument(document, {
    preserveFocus: true,
    preview: true,
  });
  if (!flowName) return;
  const templateContent = fs.readFileSync(filePath, "utf8");
  const templateContentLines = templateContent.split("\n");
  let lineNumber = 0;
  let flowFound = false;
  for (const line of templateContentLines) {
    if (line.trim().indexOf(flowName + ":") >= 0) {
      flowFound = true;
      break;
    }
    lineNumber++;
  }
  lineNumber = flowFound ? lineNumber : 0;
  const cursorPosition = new vscode.Position(lineNumber, 0);
  editor.selections = [new vscode.Selection(cursorPosition, cursorPosition)];
  editor.revealRange(
    new vscode.Range(cursorPosition, new vscode.Position(lineNumber + 10, 0))
  );
  if (flowFound) {
    const endLine = findBlockEndLine(document, cursorPosition);
    const decorationRange = new vscode.Range(
      new vscode.Position(lineNumber, 0),
      new vscode.Position(endLine + 1, 0)
    );
    editor.setDecorations(serviceDecorationTypes[0], [decorationRange]);
    decorateEditor(editor, decorationRange, serviceDecorationTypes);
  }
}

export function findBlockEndLine(
  document: vscode.TextDocument,
  position: vscode.Position
): number {
  let lineNumber = position.line;
  let lineTxt = document.lineAt(position.line).text;
  const spaceCnt = countLeadingSpace(lineTxt);
  let cnt = spaceCnt;
  let isStart = true;
  while (cnt > spaceCnt || isStart) {
    isStart = false;
    if (++lineNumber >= document.lineCount) {
      break;
    }
    lineTxt = document.lineAt(lineNumber).text;
    cnt = countLeadingSpace(lineTxt);
  }
  return lineNumber - 1;
}

export function countLeadingSpace(str: string) {
  let preSpaceCnt = 0;
  for (const ch of str) {
    if (ch === " ") {
      preSpaceCnt++;
    } else {
      break;
    }
  }
  return preSpaceCnt;
}

export function createDecorationTypesByOpacity(
  rgb: { r: number; g: number; b: number },
  opacityStart: number,
  opacityEnd: number,
  step: number
) {
  const result: vscode.TextEditorDecorationType[] = [];
  if (opacityStart > opacityEnd) {
    let tmp = opacityEnd;
    opacityEnd = opacityStart;
    opacityStart = tmp;
  }
  for (let i = opacityStart; i <= opacityEnd; i += step) {
    result.push(
      vscode.window.createTextEditorDecorationType({
        cursor: "crosshair",
        backgroundColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${i})`,
      })
    );
  }
  return result.reverse();
}

export function decorateEditor(
  editor: vscode.TextEditor,
  range: vscode.Range,
  decorationTypes: vscode.TextEditorDecorationType[]
) {
  if (!editor || !decorationTypes || !decorationTypes.length) {
    return;
  }
  editor.setDecorations(decorationTypes[0], [range]);
  let decorationTypeIndex = 1;
  const doDecorate = () => {
    editor.setDecorations(decorationTypes[decorationTypeIndex - 1], []);
    if (decorationTypeIndex < decorationTypes.length) {
      editor.setDecorations(decorationTypes[decorationTypeIndex], [range]);
      decorationTypeIndex++;
      setTimeout(() => {
        doDecorate();
      }, 100);
    }
  };
  doDecorate();
}

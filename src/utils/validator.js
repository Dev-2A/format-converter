import yaml from "js-yaml";
import * as TOML from "smol-toml";

/**
 * 입력 문자열의 문법을 검증하고 에러 위치를 반환
 * @returns {{ valid: boolean, errors: Array<{ line: number, column: number, message: string }> }}
 */
export function validate(input, format) {
  if (!input.trim()) {
    return { valid: true, errors: [] };
  }

  switch (format) {
    case "json":
      return validateJSON(input);
    case "yaml":
      return validateYAML(input);
    case "toml":
      return validateTOML(input);
    default:
      return {
        valid: false,
        errors: [{ line: 1, column: 1, message: `알 수 없는 포맷: ${format}` }],
      };
  }
}

function validateJSON(input) {
  try {
    JSON.parse(input);
    return { valid: true, errors: [] };
  } catch (e) {
    // JSON 에러 메시지에서 위치 추출 시도
    const posMatch = e.message.match(/position\s+(\d+)/i);
    let line = 1;
    let column = 1;

    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = input.substring(0, pos).split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      valid: false,
      errors: [{ line, column, message: e.message }],
    };
  }
}

function validateYAML(input) {
  try {
    yaml.load(input);
    return { valid: true, errors: [] };
  } catch (e) {
    const line = e.mark?.line ? e.mark.line + 1 : 1;
    const column = e.mark?.column ? e.mark.column + 1 : 1;

    return {
      valid: false,
      errors: [{ line, column, message: e.reason || e.message }],
    };
  }
}

function validateTOML(input) {
  try {
    TOML.parse(input);
    return { valid: true, errors: [] };
  } catch (e) {
    // smol-toml 에러에서 라인 번호 추출 시도
    const lineMatch = e.message.match(/(\d+):/);
    const line = lineMatch ? parseInt(lineMatch[1], 10) : 1;

    return {
      valid: false,
      errors: [{ line, column: 1, message: e.message }],
    };
  }
}

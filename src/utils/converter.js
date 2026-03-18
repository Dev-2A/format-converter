import yaml from "js-yaml";
import * as TOML from "smol-toml";

/**
 * 포맷 자동 감지
 */
export function detectFormat(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // JSON: { 또는 [ 로 시작하고 파싱 성공
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {
      // JSON처럼 보이지만 파싱 실패
    }
  }

  // TOML: [section] 헤더 또는 key = value 패턴
  const tomlPattern = /^(\[[\w.-]+\]|[\w.-]+\s*=)/m;
  if (tomlPattern.test(trimmed)) {
    try {
      TOML.parse(trimmed);
      return "toml";
    } catch {
      // TOML처럼 보이지만 파싱 실패
    }
  }

  // YAML: 나머지
  try {
    const result = yaml.load(trimmed);
    if (typeof result === "object" && result !== null) {
      return "yaml";
    }
  } catch {
    // YAML도 아님
  }

  return null;
}

/**
 * 입력 문자열을 파싱하여 JS 객체로 변환
 */
export function parse(input, format) {
  switch (format) {
    case "json":
      return JSON.parse(input);
    case "yaml": {
      const result = yaml.load(input);
      if (result === undefined || result === null) {
        throw new Error("YAML 파싱 결과가 비어있습니다");
      }
      return result;
    }
    case "toml":
      return TOML.parse(input);
    default:
      throw new Error(`지원하지 않는 입력 포맷: ${format}`);
  }
}

/**
 * TOML 직렬화를 위한 전처리
 */
function sanitizeForToml(obj) {
  if (Array.isArray(obj)) {
    return { items: obj.map(sanitizeForToml) };
  }
  if (obj === null || obj === undefined) {
    return "";
  }
  if (typeof obj !== "object") {
    return obj;
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      result[key] = "";
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        item === null || item === undefined
          ? ""
          : typeof item === "object"
            ? sanitizeForToml(item)
            : item,
      );
    } else if (typeof value === "object") {
      result[key] = sanitizeForToml(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * JS 객체를 지정 포맷의 문자열로 직렬화
 */
export function stringify(obj, format) {
  switch (format) {
    case "json":
      return JSON.stringify(obj, null, 2);
    case "yaml":
      return yaml.dump(obj, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: false,
      });
    case "toml": {
      const sanitized = sanitizeForToml(obj);
      return TOML.stringify(sanitized);
    }
    default:
      throw new Error(`지원하지 않는 출력 포맷: ${format}`);
  }
}

/**
 * 변환 메인 함수 (resolvedInputFormat을 사용)
 */
export function convert(input, inputFormat, outputFormat) {
  if (!input.trim()) {
    return { success: true, output: "", error: null };
  }

  try {
    const obj = parse(input, inputFormat);
    const output = stringify(obj, outputFormat);
    return { success: true, output, error: null };
  } catch (e) {
    return { success: false, output: "", error: e.message };
  }
}

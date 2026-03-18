import yaml from "js-yaml";

/**
 * 입력 문자열을 파싱하여 JS 객체로 변환
 */
export function parse(input, format) {
  switch (format) {
    case "json":
      return JSON.parse(input);
    case "yaml":
      return yaml.load(input);
    default:
      throw new Error(`지원하지 않는 입력 포맷: ${format}`);
  }
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
    default:
      throw new Error(`지원하지 않는 출력 포맷: ${format}`);
  }
}

/**
 * 변환 메인 함수
 * @returns {{ success: boolean, output: string, error: string | null }}
 */
export function convert(input, inputFormat, outputFormat) {
  // 같은 포맷이면 정렬만 해서 반환
  if (inputFormat === outputFormat) {
    try {
      const obj = parse(input, inputFormat);
      return {
        success: true,
        output: stringify(obj, outputFormat),
        error: null,
      };
    } catch (e) {
      return { success: false, output: "", error: e.message };
    }
  }

  try {
    const obj = parse(input, inputFormat);
    const output = stringify(obj, outputFormat);
    return { success: true, output, error: null };
  } catch (e) {
    return { success: false, output: "", error: e.message };
  }
}

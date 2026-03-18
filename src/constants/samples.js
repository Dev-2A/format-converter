export const SAMPLE_JSON = `{
  "name": "format-converter",
  "version": "0.1.0",
  "description": "JSON, YAML, TOML 만능 변환기",
  "features": [
    "실시간 변환",
    "문법 검증",
    "diff 뷰"
  ],
  "author": {
    "name": "Dev-2A",
    "github": "https://github.com/Dev-2A"
  }
}`;

export const SAMPLE_YAML = `name: format-converter
version: "0.1.0"
description: JSON, YAML, TOML 만능 변환기
features:
  - 실시간 변환
  - 문법 검증
  - diff 뷰
author:
  name: Dev-2A
  github: https://github.com/Dev-2A`;

export const SAMPLE_TOML = `name = "format-converter"
version = "0.1.0"
description = "JSON, YAML, TOML 만능 변환기"
features = ["실시간 변환", "문법 검증", "diff 뷰"]

[author]
name = "Dev-2A"
github = "https://github.com/Dev-2A"`;

export const SAMPLES = {
  json: SAMPLE_JSON,
  yaml: SAMPLE_YAML,
  toml: SAMPLE_TOML,
};
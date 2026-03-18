import { useState, useEffect, useCallback, useMemo } from "react";
import { convert, detectFormat } from "../utils/converter";
import { validate } from "../utils/validator";
import { SAMPLES } from "../constants/samples";

export default function useConverter() {
  const [inputValue, setInputValue] = useState(SAMPLES.json);
  const [inputFormat, setInputFormat] = useState("auto");
  const [outputFormat, setOutputFormat] = useState("yaml");
  const [outputValue, setOutputValue] = useState("");
  const [error, setError] = useState(null);
  const [inputErrors, setInputErrors] = useState([]);

  // Diff 모드
  const [diffMode, setDiffMode] = useState(false);
  const [diffOriginal, setDiffOriginal] = useState("");
  const [diffModified, setDiffModified] = useState("");

  // auto일 때 실제 감지된 포맷
  const resolvedInputFormat = useMemo(() => {
    if (inputFormat !== "auto") return inputFormat;
    if (!inputValue.trim()) return "json";
    return detectFormat(inputValue) || "json";
  }, [inputFormat, inputValue]);

  // 문법 검증 + 변환 실행
  const runConvert = useCallback(() => {
    if (!inputValue.trim()) {
      setOutputValue("");
      setError(null);
      setInputErrors([]);
      return;
    }

    let effectiveOutputFormat = outputFormat;
    if (resolvedInputFormat === outputFormat) {
      const formats = ["json", "yaml", "toml"];
      effectiveOutputFormat =
        formats.find((f) => f !== resolvedInputFormat) || "json";
    }

    const validation = validate(inputValue, resolvedInputFormat);
    setInputErrors(validation.errors);

    if (!validation.valid) {
      setOutputValue("");
      setError(validation.errors[0]?.message || "문법 오류");
      return;
    }

    const result = convert(
      inputValue,
      resolvedInputFormat,
      effectiveOutputFormat,
    );
    if (result.success) {
      setOutputValue(result.output);
      setError(null);
    } else {
      setOutputValue("");
      setError(result.error);
    }
  }, [inputValue, resolvedInputFormat, outputFormat]);

  // 디바운스 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      runConvert();
    }, 200);
    return () => clearTimeout(timer);
  }, [runConvert]);

  // 입력 포맷 변경
  const handleInputFormatChange = (fmt) => {
    setInputFormat(fmt);
    if (fmt !== "auto" && fmt === outputFormat) {
      const formats = ["json", "yaml", "toml"];
      const other = formats.find((f) => f !== fmt);
      setOutputFormat(other);
    }
  };

  // 출력 포맷 변경
  const handleOutputFormatChange = (fmt) => {
    setOutputFormat(fmt);
    if (fmt === resolvedInputFormat && inputFormat !== "auto") {
      const formats = ["json", "yaml", "toml"];
      const other = formats.find((f) => f !== fmt);
      setInputFormat(other);
    }
  };

  // 좌우 스왑
  const swap = () => {
    setInputValue(outputValue);
    setInputFormat(outputFormat);
    setOutputFormat(resolvedInputFormat);
  };

  // 샘플 데이터 로드
  const loadSample = () => {
    const fmt = resolvedInputFormat;
    setInputValue(SAMPLES[fmt] || SAMPLES.json);
  };

  // Diff 모드 토글
  const toggleDiff = () => {
    if (!diffMode) {
      // Diff 모드 진입: 현재 입력/출력을 스냅샷
      setDiffOriginal(inputValue);
      setDiffModified(outputValue);
    }
    setDiffMode(!diffMode);
  };

  return {
    inputValue,
    setInputValue,
    inputFormat,
    resolvedInputFormat,
    outputFormat,
    outputValue,
    error,
    inputErrors,
    handleInputFormatChange,
    handleOutputFormatChange,
    swap,
    loadSample,
    diffMode,
    diffOriginal,
    diffModified,
    toggleDiff,
  };
}

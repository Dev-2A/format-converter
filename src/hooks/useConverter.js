import { useState, useEffect, useCallback } from "react";
import { convert } from "../utils/converter";
import { SAMPLES } from "../constants/samples";

export default function useConverter(initialInput = "") {
  const [inputValue, setInputValue] = useState(initialInput);
  const [inputFormat, setInputFormat] = useState("json");
  const [outputFormat, setOutputFormat] = useState("yaml");
  const [outputValue, setOutputValue] = useState("");
  const [error, setError] = useState(null);

  // 변환 실행
  const runConvert = useCallback(() => {
    if (!inputValue.trim()) {
      setOutputValue("");
      setError(null);
      return;
    }

    const result = convert(inputValue, inputFormat, outputFormat);
    if (result.success) {
      setOutputValue(result.output);
      setError(null);
    } else {
      setOutputValue("");
      setError(result.error);
    }
  }, [inputValue, inputFormat, outputFormat]);

  // 입력값 또는 포맷 변경 시 자동 변환 (디바운스 200ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      runConvert();
    }, 200);
    return () => clearTimeout(timer);
  }, [runConvert]);

  // 입력 포맷 변경 시 샘플 로드 + 출력 포맷 충돌 방지
  const handleInputFormatChange = (fmt) => {
    setInputFormat(fmt);
    if (fmt === outputFormat) {
      const formats = ["json", "yaml", "toml"];
      const other = formats.find((f) => f !== fmt);
      setOutputFormat(other);
    }
  };

  const handleOutputFormatChange = (fmt) => {
    setOutputFormat(fmt);
    if (fmt === inputFormat) {
      const formats = ["json", "yaml", "toml"];
      const other = formats.find((f) => f !== fmt);
      setInputFormat(other);
    }
  };

  // 좌우 스왑
  const swap = () => {
    setInputValue(outputValue);
    setInputFormat(outputFormat);
    setOutputFormat(inputFormat);
  };

  // 샘플 데이터 로드
  const loadSample = () => {
    setInputValue(SAMPLES[inputFormat]);
  };

  return {
    inputValue,
    setInputValue,
    inputFormat,
    outputFormat,
    outputValue,
    error,
    handleInputFormatChange,
    handleOutputFormatChange,
    swap,
    loadSample,
  };
}

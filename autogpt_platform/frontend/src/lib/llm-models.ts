export const LLM_MODEL_TITLE = "LLM Model";

const DOMESTIC_LLM_PREFIXES = [
  "deepseek/",
  "qwen/",
  "moonshotai/",
  "zhipuai/",
];

const DOMESTIC_LLM_KEYWORDS = ["deepseek", "qwen", "kimi", "zhipu", "glm"];

export const isLlmModelSchema = (schema?: { title?: string }) =>
  schema?.title === LLM_MODEL_TITLE;

export const isDomesticLlmModel = (value: string) => {
  const normalized = value.toLowerCase();
  return (
    DOMESTIC_LLM_PREFIXES.some((prefix) => normalized.startsWith(prefix)) ||
    DOMESTIC_LLM_KEYWORDS.some((keyword) => normalized.includes(keyword))
  );
};

export type LlmSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

const DISABLED_SUFFIX = " (blocked)";

export const toDomesticLlmOptions = (
  options: LlmSelectOption[],
  currentValue?: string,
) => {
  const filtered = options.filter((option) =>
    isDomesticLlmModel(option.value),
  );

  if (
    currentValue &&
    !filtered.some((option) => option.value === currentValue)
  ) {
    const currentOption = options.find(
      (option) => option.value === currentValue,
    );
    if (currentOption) {
      filtered.unshift({
        ...currentOption,
        label: `${currentOption.label}${DISABLED_SUFFIX}`,
        disabled: true,
      });
    }
  }

  return filtered;
};

export const toDomesticLlmOptionsFromValues = (
  values: string[],
  toLabel: (value: string) => string,
  currentValue?: string,
) => {
  const filtered = values
    .filter((value) => value)
    .filter((value) => isDomesticLlmModel(value))
    .map((value) => ({
      value,
      label: toLabel(value),
      disabled: false,
    }));

  if (
    currentValue &&
    values.includes(currentValue) &&
    !filtered.some((option) => option.value === currentValue)
  ) {
    filtered.unshift({
      value: currentValue,
      label: `${toLabel(currentValue)}${DISABLED_SUFFIX}`,
      disabled: true,
    });
  }

  return filtered;
};

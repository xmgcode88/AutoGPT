"""Configuration management for chat system."""

import os
from pathlib import Path

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[4] / ".env"


class ChatConfig(BaseSettings):
    """Configuration for the chat system."""

    model_config = SettingsConfigDict(
        env_prefix="CHAT_",
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # OpenAI API Configuration
    model: str | None = Field(
        default=None, description="Default model to use"
    )
    api_key: str | None = Field(default=None, description="OpenAI API key")
    base_url: str | None = Field(
        default="https://openrouter.ai/api/v1",
        description="Base URL for API (e.g., for OpenRouter)",
    )

    # Session TTL Configuration - 12 hours
    session_ttl: int = Field(default=43200, description="Session TTL in seconds")

    # System Prompt Configuration
    system_prompt_path: str = Field(
        default="prompts/chat_system.md",
        description="Path to system prompt file relative to chat module",
    )

    # Streaming Configuration
    max_context_messages: int = Field(
        default=50, ge=1, le=200, description="Maximum context messages"
    )

    stream_timeout: int = Field(default=300, description="Stream timeout in seconds")
    max_retries: int = Field(default=3, description="Maximum number of retries")
    max_agent_runs: int = Field(default=3, description="Maximum number of agent runs")
    max_agent_schedules: int = Field(
        default=3, description="Maximum number of agent schedules"
    )

    @field_validator("api_key", mode="before")
    @classmethod
    def get_api_key(cls, v):
        """Get API key from environment if not provided."""
        if v:
            return v

        # Try to get from environment variables
        return (
            os.getenv("DEEPSEEK_API_KEY")
            or os.getenv("OPEN_ROUTER_API_KEY")
            or os.getenv("OPENAI_API_KEY")
        )

    @field_validator("base_url", mode="before")
    @classmethod
    def get_base_url(cls, v):
        """Get base URL from environment if not provided."""
        env_base_url = (
            os.getenv("CHAT_BASE_URL")
            or os.getenv("OPENROUTER_BASE_URL")
            or os.getenv("OPENAI_BASE_URL")
        )

        if env_base_url:
            return env_base_url

        return v or "https://openrouter.ai/api/v1"

    @model_validator(mode="after")
    def ensure_model(self):
        """Ensure a model is selected, preferring env or DeepSeek defaults."""
        if self.model:
            return self

        env_model = (
            os.getenv("CHAT_MODEL")
            or os.getenv("OPENAI_MODEL")
            or os.getenv("OPENROUTER_MODEL")
            or os.getenv("MODEL")
        )

        if env_model:
            self.model = env_model
        elif self.base_url and "deepseek" in self.base_url.lower():
            # Default to DeepSeek reasoning model when pointing at DeepSeek
            self.model = "deepseek-reasoner"
        else:
            self.model = "qwen/qwen3-235b-a22b-2507"

        return self

    def get_system_prompt(self, **template_vars) -> str:
        """Load and render the system prompt from file.

        Args:
            **template_vars: Variables to substitute in the template

        Returns:
            Rendered system prompt string

        """
        # Get the path relative to this module
        module_dir = Path(__file__).parent
        prompt_path = module_dir / self.system_prompt_path

        # Check for .j2 extension first (Jinja2 template)
        j2_path = Path(str(prompt_path) + ".j2")
        if j2_path.exists():
            try:
                from jinja2 import Template

                template = Template(j2_path.read_text())
                return template.render(**template_vars)
            except ImportError:
                # Jinja2 not installed, fall back to reading as plain text
                return j2_path.read_text()

        # Check for markdown file
        if prompt_path.exists():
            content = prompt_path.read_text()

            # Simple variable substitution if Jinja2 is not available
            for key, value in template_vars.items():
                placeholder = f"{{{key}}}"
                content = content.replace(placeholder, str(value))

            return content
        raise FileNotFoundError(f"System prompt file not found: {prompt_path}")

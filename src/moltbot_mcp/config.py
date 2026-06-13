"""Configuration for Moltbot MCP."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Moltbot Gateway connection and MCP server settings."""

    model_config = SettingsConfigDict(env_prefix="MOLTBOT_MCP_", env_file=".env")

    gateway_host: str = "127.0.0.1"
    gateway_port: int = 18789
    gateway_token: str | None = None
    moltbook_api_key: str | None = None
    use_ws: bool = True

    @property
    def gateway_ws_url(self) -> str:
        base = "ws" if self.use_ws else "http"
        return f"{base}://{self.gateway_host}:{self.gateway_port}"


settings = Settings()

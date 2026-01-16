# Supabase Docker

This directory contains the Supabase Docker Compose configuration used by the AutoGPT Platform.

## Important (path resolution on Windows / `extends`)

In this repository, `db/docker/docker-compose.yml` is commonly used via `extends` from `autogpt_platform/docker-compose.yml`.
Because of that, several bind-mount paths are written to be resolved from the `autogpt_platform/` project directory.

To avoid accidentally creating wrong host paths (which can turn `*.sql` files into directories and break `supabase-db` init),
run Supabase from the `autogpt_platform/` directory:

```powershell
cd D:\mycode\2026\AutoGPT\autogpt_platform
# Important: keep `docker-compose.yml` as the first `-f` file so the project directory is `autogpt_platform/`.
docker compose -f docker-compose.yml -f db/docker/docker-compose.yml -f db/docker/dev/docker-compose.dev.yml --profile local up -d kong auth db studio meta
```

If you previously ran Compose from inside `autogpt_platform/db/docker`, remove the mistakenly created nested directory:

```powershell
Remove-Item -Recurse -Force D:\mycode\2026\AutoGPT\autogpt_platform\db\docker\db -ErrorAction SilentlyContinue
```

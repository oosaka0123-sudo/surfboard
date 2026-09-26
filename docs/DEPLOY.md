# Production deploy

Production URL: https://surfboard.rss7.net/

Deployment is intentionally manual and non-destructive.

## Required GitHub configuration

Repository secrets:
- `SURFBOARD_FTP_USER`
- `SURFBOARD_FTP_PASSWORD`

Repository variable:
- `SURFBOARD_FTP_DIR`

Do not guess `SURFBOARD_FTP_DIR`. Confirm the document root configured for `surfboard.rss7.net` in Lolipop before setting it.

## Deploy

Run the GitHub Actions workflow:

`Deploy SURFBOARD FINDER to Lolipop`

The workflow:
1. runs `npm run check`
2. builds with `SITE_URL=https://surfboard.rss7.net`
3. verifies required pages and the hero video
4. uploads `dist/` over FTPS without remote deletion
5. checks the live home, diagnosis, boards and method pages

Production deploy is allowed only from `main`.

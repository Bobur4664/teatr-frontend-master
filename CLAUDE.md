# CLAUDE.md

Start with [README.md](README.md): it covers the folders, local setup and checks.

- `frontend/` is the template. `sites/<site>/` overrides it per site, and `scripts/assemble-site.sh` combines them. `sites/kukla/src/` shadows five template files, so shared changes to those files go in both places.

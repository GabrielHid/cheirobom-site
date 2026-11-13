# Instala as skills do projeto em .\.claude\skills (escopo do projeto)
# Rode na raiz do projeto: powershell -ExecutionPolicy Bypass -File .\setup-skills.ps1
# Requer Node.js 18+

$ErrorActionPreference = "Stop"

Write-Host "`n[1/4] Three.js (10 skills: fundamentals, geometry, materials, lighting, textures, animation, loaders, shaders, postprocessing, interaction)"
npx skills add CloudAI-X/threejs-skills --skill '*' --agent claude-code --yes

Write-Host "`n[2/4] web-design-guidelines (Vercel)"
npx skills add vercel-labs/agent-skills --skill web-design-guidelines --agent claude-code --yes

Write-Host "`n[3/4] playwright-cli (Microsoft) + CLI global"
npm install -g @playwright/cli@latest
npx skills add https://github.com/microsoft/playwright-cli --skill playwright-cli --agent claude-code --yes

Write-Host "`n[4/4] awwwards (local, ja incluida no pacote)"
if (Test-Path ".\.claude\skills\awwwards\SKILL.md") { Write-Host "ok" } else { Write-Warning "awwwards nao encontrada em .claude\skills" }

Write-Host "`nSkills instaladas:"
Get-ChildItem ".\.claude\skills" -Directory | Select-Object -ExpandProperty Name
Write-Host "`nReinicie o Claude Code para carregar as skills."

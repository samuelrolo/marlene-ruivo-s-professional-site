# Workflow de Development/Production

## Estrutura de Branches

### `development` (Staging)

- **Propósito**: Branch de desenvolvimento e testes
- **Deploy**: Automático para GitHub Pages quando há push
- **URL**: <https://marleneruivo.pt> (ambiente de staging)
- **Workflow**: `.github/workflows/deploy.yml` faz deploy automático

### `main` (Production)

- **Propósito**: Branch de produção estável
- **Deploy**: Apenas via Pull Request aprovado
- **Proteção**: Requer PR review antes de merge
- **Como atualizar**:
  1. Desenvolver em `development`
  2. Testar no site live
  3. Criar Pull Request de `development` → `main`
  4. Aprovar e fazer merge

## Como Trabalhar

### 1. Fazer Alterações

```bash
# Certifique-se que está em development
git checkout development

# Fazer alterações nos ficheiros
# ...

# Commit e push
git add .
git commit -m "sua mensagem"
git push origin development
```

### 2. Deploy Automático

- O push para `development` dispara automaticamente o deploy
- Verificar em <https://github.com/samuelrolo/marlene-ruivo-s-professional-site/actions>
- Site atualizado em <https://marleneruivo.pt>

### 3. Promover para Production (Main)

```bash
# Via GitHub UI:
1. Ir para https://github.com/samuelrolo/marlene-ruivo-s-professional-site
2. Clicar em "Pull requests" → "New pull request"
3. Base: main ← Compare: development
4. Criar PR, revisar e aprovar
5. Fazer merge

# Ou via CLI:
gh pr create --base main --head development --title "Release: descrição" --body "Alterações..."
```

## Próximo Passo Recomendado

Configurar branch protection em `main` via GitHub:

1. Ir para Settings → Branches → Add branch protection rule
2. Branch name pattern: `main`
3. Ativar: "Require pull request reviews before merging"
4. Ativar: "Require status checks to pass before merging"
5. Save changes

Isto garante que ninguém faz push direto para `main`.

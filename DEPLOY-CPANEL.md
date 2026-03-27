# Deploy no cPanel — ZapCentral (Vite + React)

## Visão geral
- Saída estática: `dist/`
- Envio para: `public_html/` (ou subdomínio/pasta)
- SPA: `.htaccess` com fallback para `index.html` já incluso em `public/.htaccess`

## Passo a passo (root do domínio ou subdomínio)
1. Instale dependências e gere build:
   - `npm ci` (ou `npm install`)
   - `npm run build`
2. Opcional: compacte para envio:
   - `npm run build:zip` → gera `dist.zip`
3. No cPanel:
   - Abra “File Manager”
   - Vá até a raiz do site (`public_html` ou pasta do subdomínio)
   - Envie o conteúdo de `dist/` (ou `dist.zip` e extraia)
4. Confirme que existe um `.htaccess` no destino com o fallback da SPA.

## Deploy em subpasta (ex.: `dominio.com/zapcentral/`)
1. Ajuste a base do Vite:
   - Em `vite.config.ts`, defina `base: '/zapcentral/'`
2. Refaça o build:
   - `npm run build`
3. Faça upload do conteúdo de `dist/` para `public_html/zapcentral/`
4. Garanta um `.htaccess` na pasta da subpasta (o nosso será copiado pois está em `public/.htaccess`).

## Dicas
- Cache: o cPanel/Apache pode cachear arquivos estáticos; recarregue com hard refresh.
- Rotas: com o `.htaccess` de SPA, acessar `/obrigado` diretamente funciona.
- Formulário: caso queira receber leads por e‑mail/API, integre um endpoint (Formspree, Make, Zapier ou script PHP).

## Scripts úteis
- `npm run build` — cria `dist/`
- `npm run build:zip` — gera `dist.zip` pronto para upload
2
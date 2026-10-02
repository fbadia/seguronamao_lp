# Landing page estática do SeguroNaMão servida por nginx na porta 80.
# Build multi-arch (exigido pela ZeroServer):
#   docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/fbadia/seguronamao-lp:<versão> --push .
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY index.html privacidade.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/healthz || exit 1

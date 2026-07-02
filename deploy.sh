#!/usr/bin/env bash

set -Eeuo pipefail

readonly APP_NAME="gamified-bootcamp"
readonly REPO_SSH_URL="git@github.com:deveda799/gamified-bootcamp.git"
readonly REPO_HTTPS_URL="https://github.com/deveda799/gamified-bootcamp.git"
readonly APP_ROOT="/opt/${APP_NAME}"
readonly APP_DIR="${APP_ROOT}/current"
readonly PUBLIC_IP="${PUBLIC_IP:-175.178.174.40}"
readonly NODE_MAJOR="24"

if [[ "${EUID}" -eq 0 ]]; then
  SUDO=()
  DEPLOY_USER="${SUDO_USER:-ubuntu}"
else
  SUDO=(sudo)
  DEPLOY_USER="${USER}"
fi

DEPLOY_HOME="$(getent passwd "${DEPLOY_USER}" | cut -d: -f6)"
readonly DEPLOY_USER DEPLOY_HOME
readonly DEPLOY_KEY="${DEPLOY_HOME}/.ssh/gamified_bootcamp_deploy"
readonly TOKEN_FILE="${DEPLOY_HOME}/.config/gamified-bootcamp/github-token"
readonly GIT_SSH_COMMAND_VALUE="ssh -i ${DEPLOY_KEY} -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
readonly GIT_TOKEN_HELPER='!f() { echo username=x-access-token; echo password=$GITHUB_TOKEN; }; f'

log() {
  printf '\n[%s] %s\n' "$(date '+%H:%M:%S')" "$*"
}

fail() {
  printf '\n[ERROR] %s\n' "$*" >&2
  exit 1
}

run_as_deploy() {
  if [[ "$(id -un)" == "${DEPLOY_USER}" ]]; then
    "$@"
  else
    sudo -u "${DEPLOY_USER}" "$@"
  fi
}

git_with_auth() {
  if [[ -f "${TOKEN_FILE}" ]]; then
    local github_token
    github_token="$(<"${TOKEN_FILE}")"
    [[ -n "${github_token}" ]] || fail "GitHub Token 文件为空：${TOKEN_FILE}"
    run_as_deploy env GITHUB_TOKEN="${github_token}" \
      git -c credential.helper="${GIT_TOKEN_HELPER}" "$@"
  else
    run_as_deploy env GIT_SSH_COMMAND="${GIT_SSH_COMMAND_VALUE}" git "$@"
  fi
}

trap 'fail "部署在第 ${LINENO} 行失败，请保留以上日志。"' ERR

[[ -n "${DEPLOY_HOME}" ]] || fail "找不到部署用户 ${DEPLOY_USER}。"
if [[ ! -f "${TOKEN_FILE}" ]]; then
  [[ -f "${DEPLOY_KEY}" ]] || fail "缺少 GitHub Token 文件或 Deploy Key。"
  [[ -f "${DEPLOY_KEY}.pub" ]] || fail "缺少 Deploy Key 公钥：${DEPLOY_KEY}.pub"
fi

log "安装 Git、Nginx、UFW 和 Node.js ${NODE_MAJOR} LTS"
export DEBIAN_FRONTEND=noninteractive
"${SUDO[@]}" apt-get update
"${SUDO[@]}" apt-get install -y ca-certificates curl gnupg git nginx ufw
"${SUDO[@]}" install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key |
  "${SUDO[@]}" gpg --dearmor --yes -o /etc/apt/keyrings/nodesource.gpg
printf 'deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_%s.x nodistro main\n' "${NODE_MAJOR}" |
  "${SUDO[@]}" tee /etc/apt/sources.list.d/nodesource.list >/dev/null
"${SUDO[@]}" apt-get update
"${SUDO[@]}" apt-get install -y nodejs

node --version | grep -q "^v${NODE_MAJOR}\." ||
  fail "Node.js 安装版本不正确，当前版本：$(node --version)"

log "准备应用目录并从 GitHub 同步 main 分支"
"${SUDO[@]}" install -d -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" "${APP_ROOT}"
"${SUDO[@]}" install -d -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" /var/log/gamified-bootcamp
if [[ -f "${TOKEN_FILE}" ]]; then
  "${SUDO[@]}" chown "${DEPLOY_USER}:${DEPLOY_USER}" "${TOKEN_FILE}"
  "${SUDO[@]}" chmod 600 "${TOKEN_FILE}"
else
  "${SUDO[@]}" chmod 600 "${DEPLOY_KEY}"
fi

if [[ -d "${APP_DIR}/.git" ]]; then
  git_with_auth -C "${APP_DIR}" pull --ff-only origin main
else
  if [[ -f "${TOKEN_FILE}" ]]; then
    git_with_auth clone --branch main --single-branch "${REPO_HTTPS_URL}" "${APP_DIR}"
  else
    git_with_auth clone --branch main --single-branch "${REPO_SSH_URL}" "${APP_DIR}"
  fi
fi

[[ -f "${APP_DIR}/package.json" ]] || fail "GitHub 项目中缺少 package.json。"
[[ -f "${APP_DIR}/pnpm-lock.yaml" ]] || fail "GitHub 项目中缺少 pnpm-lock.yaml。"

PNPM_SPEC="$(node -p "require('${APP_DIR}/package.json').packageManager")"
[[ "${PNPM_SPEC}" == pnpm@* ]] || fail "package.json 中缺少有效的 packageManager。"

log "安装 ${PNPM_SPEC} 和 PM2"
"${SUDO[@]}" npm install --global "${PNPM_SPEC}" pm2

log "安装依赖并构建 Next.js"
run_as_deploy env CI=1 pnpm --dir "${APP_DIR}" install --frozen-lockfile
run_as_deploy pnpm --dir "${APP_DIR}" build

log "使用 PM2 启动应用并配置开机自启动"
run_as_deploy pm2 startOrReload "${APP_DIR}/deploy/ecosystem.config.cjs" --env production
run_as_deploy pm2 save
"${SUDO[@]}" env PATH="${PATH}:/usr/local/bin:/usr/bin" \
  pm2 startup systemd -u "${DEPLOY_USER}" --hp "${DEPLOY_HOME}"
"${SUDO[@]}" systemctl enable "pm2-${DEPLOY_USER}"

log "配置 Nginx 反向代理"
"${SUDO[@]}" tee /etc/nginx/sites-available/gamified-bootcamp >/dev/null <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINX

"${SUDO[@]}" rm -f /etc/nginx/sites-enabled/default
"${SUDO[@]}" ln -sfn /etc/nginx/sites-available/gamified-bootcamp \
  /etc/nginx/sites-enabled/gamified-bootcamp
"${SUDO[@]}" nginx -t
"${SUDO[@]}" systemctl enable --now nginx
"${SUDO[@]}" systemctl reload nginx

log "配置 Ubuntu 防火墙"
"${SUDO[@]}" ufw allow OpenSSH
"${SUDO[@]}" ufw allow 'Nginx Full'
"${SUDO[@]}" ufw --force enable

log "验证 Next.js 和 Nginx"
curl --noproxy '*' --fail --silent --show-error --location \
  --retry 10 --retry-delay 2 http://127.0.0.1:3000/app/home >/dev/null
curl --noproxy '*' --fail --silent --show-error --location \
  --retry 5 --retry-delay 2 http://127.0.0.1/app/home >/dev/null

printf '\n部署成功。\n网站地址：http://%s/app/home\n' "${PUBLIC_IP}"

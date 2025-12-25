@echo off
setlocal
REM 根目录定位为本脚本所在目录
cd /d "%~dp0"

REM 避免某些依赖的额外下载（可选）
set "PUPPETEER_SKIP_DOWNLOAD=1"

REM 强制 npm 使用 cmd 作为脚本 shell，规避 PowerShell 包装问题
npm config set script-shell "%ComSpec%"

REM 使用国内镜像以提升安装速度，可按需移除
npm install --registry=https://registry.npmmirror.com

REM 启动 8000 端口
npm run dev:8000

endlocal


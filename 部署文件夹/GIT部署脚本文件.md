# GIT部署脚本文件

## 1. 文档说明
本文档包含高铁站节能降耗演示系统的GIT部署脚本，用于自动化完成系统的部署、更新和回滚操作，确保部署过程的一致性和可靠性。

## 2. 部署环境要求

### 2.1 服务器环境
- 操作系统：CentOS 7.x / Ubuntu 18.04+ / Windows Server 2016+
- Web服务器：Nginx 1.16+ / Apache 2.4+
- Node.js版本：16.x LTS
- Git版本：2.17+
- 数据库：无（前端演示系统，数据存储在浏览器本地）

### 2.2 网络环境
- 服务器需能访问外部GIT仓库
- 服务器需开放HTTP/HTTPS端口（默认80/443）
- 客户端需能访问服务器的HTTP/HTTPS端口

## 3. 部署脚本

### 3.1 Linux环境部署脚本
```bash
#!/bin/bash

# 部署配置
DEPLOY_DIR="/var/www/energy-saving-demo"  # 部署目录
GIT_REPO="git@github.com:your-org/energy-saving-demo.git"  # GIT仓库地址
BRANCH="main"  # 部署分支
BACKUP_DIR="/var/www/energy-saving-demo-backups"  # 备份目录
TIMESTAMP=$(date +"%Y%m%d%H%M%S")  # 当前时间戳

# 颜色输出函数
echo_color() {
    case "$1" in
        "red") echo -e "\033[31m$2\033[0m" ;;
        "green") echo -e "\033[32m$2\033[0m" ;;
        "yellow") echo -e "\033[33m$2\033[0m" ;;
        "blue") echo -e "\033[34m$2\033[0m" ;;
        *) echo "$2" ;;
    esac
}

# 检查Git是否安装
if ! command -v git &> /dev/null; then
    echo_color red "Git未安装，正在安装..."
    sudo yum install git -y || sudo apt-get install git -y
    if [ $? -ne 0 ]; then
        echo_color red "Git安装失败，退出部署"
        exit 1
    fi
fi

echo_color blue "开始部署高铁站节能降耗演示系统..."

# 1. 备份当前版本
if [ -d "$DEPLOY_DIR" ]; then
    echo_color yellow "正在备份当前版本到 $BACKUP_DIR/backup-$TIMESTAMP..."
    mkdir -p "$BACKUP_DIR"
    cp -r "$DEPLOY_DIR" "$BACKUP_DIR/backup-$TIMESTAMP"
    if [ $? -ne 0 ]; then
        echo_color red "备份失败，退出部署"
        exit 1
    fi
    echo_color green "备份完成"
fi

# 2. 克隆或更新代码库
if [ -d "$DEPLOY_DIR" ]; then
    echo_color yellow "更新代码库..."
    cd "$DEPLOY_DIR"
    git checkout $BRANCH
    git pull origin $BRANCH
    if [ $? -ne 0 ]; then
        echo_color red "代码更新失败，退出部署"
        exit 1
    fi
else
    echo_color yellow "克隆代码库到 $DEPLOY_DIR..."
    git clone -b $BRANCH $GIT_REPO "$DEPLOY_DIR"
    if [ $? -ne 0 ]; then
        echo_color red "代码克隆失败，退出部署"
        exit 1
    fi
fi

echo_color green "代码同步完成"

# 3. 安装依赖
cd "$DEPLOY_DIR"
echo_color yellow "安装项目依赖..."
npm install --production
if [ $? -ne 0 ]; then
    echo_color red "依赖安装失败，退出部署"
    exit 1
fi

echo_color green "依赖安装完成"

# 4. 构建项目
echo_color yellow "构建项目..."
npm run build
if [ $? -ne 0 ]; then
    echo_color red "项目构建失败，退出部署"
    exit 1
fi

echo_color green "项目构建完成"

# 5. 配置Web服务器
if command -v nginx &> /dev/null; then
    echo_color yellow "配置Nginx..."
    # 创建Nginx配置文件
    cat > /etc/nginx/conf.d/energy-saving-demo.conf << EOF
server {
    listen 80;
    server_name your-domain.com;
    root $DEPLOY_DIR/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    # 测试Nginx配置并重启
    nginx -t
    if [ $? -eq 0 ]; then
        systemctl restart nginx
        echo_color green "Nginx配置完成并重启成功"
    else
        echo_color red "Nginx配置错误，请检查配置文件"
        exit 1
    fi
elif command -v apache2 &> /dev/null; then
    echo_color yellow "配置Apache..."
    # 创建Apache虚拟主机配置
    cat > /etc/apache2/sites-available/energy-saving-demo.conf << EOF
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot $DEPLOY_DIR/dist
    
    <Directory $DEPLOY_DIR/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # 支持单页应用路由
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # 静态文件缓存
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
        Header set Cache-Control "max-age=31536000, public, immutable"
    </FilesMatch>
</VirtualHost>
EOF
    
    # 启用虚拟主机并重启Apache
    a2ensite energy-saving-demo.conf
    a2enmod rewrite headers
    systemctl restart apache2
    echo_color green "Apache配置完成并重启成功"
else
    echo_color yellow "未检测到Nginx或Apache，跳过Web服务器配置"
fi

# 6. 清理旧备份
echo_color yellow "清理30天前的备份..."
find "$BACKUP_DIR" -name "backup-*" -type d -mtime +30 -exec rm -rf {} \;
echo_color green "旧备份清理完成"

echo_color green "\n高铁站节能降耗演示系统部署完成！"
echo_color blue "访问地址: http://your-domain.com"

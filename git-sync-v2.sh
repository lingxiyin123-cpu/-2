#!/bin/bash

echo "======================================"
echo "   开始同步到GitHub"
echo "======================================"
echo ""

# 配置git用户信息
git config --global user.name "lingxiyin123"
git config --global user.email "lingxiyin123@gmail.com"

echo "✓ Git用户配置完成"
echo ""

# 进入测试目录
cd ~/Desktop/AI合集/测试

# 初始化git仓库
if [ ! -d ".git" ]; then
  git init
  echo "✓ Git仓库初始化完成"
else
  echo "✓ Git仓库已存在，跳过初始化"
fi
echo ""

# 检查远程仓库
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$REMOTE_URL" ]; then
  git remote add origin git@github.com:lingxiyin123-cpu/-2.git
  echo "✓ 远程仓库已添加: git@github.com:lingxiyin123-cpu/-2.git"
elif [ "$REMOTE_URL" != "git@github.com:lingxiyin123-cpu/-2.git" ]; then
  git remote set-url origin git@github.com:lingxiyin123-cpu/-2.git
  echo "✓ 远程仓库地址已更新"
else
  echo "✓ 远程仓库配置正确"
fi
echo ""

# 添加所有文件
git add .
echo "✓ 文件已添加到暂存区"
echo ""

# 创建提交
git commit -m "添加RPI关系人格指数测试H5应用和GitHub Pages配置"
echo "✓ 提交创建完成"
echo ""

# 推送到远程
echo "======================================"
echo "   正在推送到远程仓库..."
echo "======================================"
echo ""

git push -u origin master

echo ""
if [ $? -eq 0 ]; then
  echo "======================================"
  echo "   ✓ 推送成功！"
  echo "======================================"
  echo ""
  echo "下一步："
  echo "1. 访问 https://github.com/lingxiyin123-cpu/-2/settings/pages"
  echo "2. 在 'GitHub Pages' 部分，Source 选择 'Deploy from a branch'"
  echo "3. Branch 选择 'master'，Folder 选择 '/ (root)'"
  echo "4. 点击 Save 按钮"
  echo ""
  echo "部署完成后访问："
  echo "https://lingxiyin123-cpu.github.io/-2/"
  echo ""
else
  echo "======================================"
  echo "   ✗ 推送失败"
  echo "======================================"
  echo ""
  echo "可能的原因："
  echo "1. SSH密钥未配置到GitHub"
  echo "2. 网络连接问题"
  echo "3. 仓库不存在或无权限"
  echo ""
  echo "请检查后重试"
fi

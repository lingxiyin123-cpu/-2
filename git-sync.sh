#!/bin/bash

# 配置git用户信息
git config --global user.name "lingxiyin123"
git config --global user.email "lingxiyin123@gmail.com"

echo "✓ Git配置完成"

# 进入测试目录
cd ~/Desktop/AI合集/测试

# 初始化git仓库（如果还没有）
if [ ! -d ".git" ]; then
  git init
  echo "✓ Git仓库初始化完成"
else
  echo "✓ Git仓库已存在"
fi

# 添加所有文件
git add .
echo "✓ 文件已添加到暂存区"

# 创建提交
git commit -m "添加RPI关系人格指数测试H5应用"
echo "✓ 提交创建完成"

# 检查远程仓库
if git remote get-url origin > /dev/null 2>&1; then
  echo "✓ 远程仓库已配置"
else
  git remote add origin git@github.com:lingxiyin123-cpu/-2.git
  echo "✓ 远程仓库已添加"
fi

# 推送到远程
echo "正在推送到远程仓库..."
git push -u origin master

if [ $? -eq 0 ]; then
  echo ""
  echo "============================================="
  echo "✓ 推送成功！"
  echo "============================================="
  echo ""
  echo "访问地址："
  echo "https://lingxiyin123-cpu.github.io/-2/"
  echo ""
  echo "如需启用GitHub Pages，访问："
  echo "https://github.com/lingxiyin123-cpu/-2/settings/pages"
else
  echo ""
  echo "============================================="
  echo "✗ 推送失败"
  echo "============================================="
  echo "请检查SSH密钥配置或网络连接"
fi

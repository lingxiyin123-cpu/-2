#!/usr/bin/env python3
import subprocess
import os
import sys

# 切换到测试目录
os.chdir('/Users/zhongxing/Desktop/AI合集/测试')

commands = [
    ['git', 'config', '--global', 'user.name', 'lingxiyin123'],
    ['git', 'config', '--global', 'user.email', 'lingxiyin123@gmail.com'],
    ['git', 'init'],
    ['git', 'add', '.'],
    ['git', 'commit', '-m', '添加RPI关系人格指数测试H5应用'],
    ['git', 'remote', 'add', 'origin', 'git@github.com:lingxiyin123-cpu/-2.git'],
    ['git', 'push', '-u', 'origin', 'master']
]

for i, cmd in enumerate(commands, 1):
    print(f"[{i}/{len(commands)}] 执行: {' '.join(cmd)}")
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"  ✓ 成功")
        else:
            print(f"  ✗ 失败")
            print(f"  错误: {result.stderr}")
            if i < len(commands) - 1:
                print("\n是否继续执行？(y/n)")
                if input().lower() != 'y':
                    sys.exit(1)
    except Exception as e:
        print(f"  ✗ 异常: {e}")
        if i < len(commands) - 1:
            print("\n是否继续执行？(y/n)")
            if input().lower() != 'y':
                sys.exit(1)
    print()

print("\n" + "="*50)
print("推送完成！")
print("="*50)
print("\n下一步操作：")
print("1. 访问: https://github.com/lingxiyin123-cpu/-2/settings/pages")
print("2. 在 'GitHub Pages' 部分，Source 选择 'Deploy from a branch'")
print("3. Branch 选择 'master'，Folder 选择 '/ (root)'")
print("4. 点击 Save 按钮")
print("\n配置成功后访问:")
print("https://lingxiyin123-cpu.github.io/-2/")

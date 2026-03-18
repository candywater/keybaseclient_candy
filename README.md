## Candy Edit Keybase

### New Features

- feat: "Chat" is the first tab in left side menu
- fix: windows cannot clear red dot even have read message
- feat: add font selection support in Settings - Display - Chat font
- feat: add config to disable upgrade / check upgrade in Settings - Advanced
- doc: add candy edit credit
- fix: change packaging scripts to make them use current folder / can use vs2022 build tool

## Tech Related

### packages

```
scoop install main/mingw
scoop install versions/wixtoolset3
```

### Windows 开发构建与运行（最快）

- 先看官方入口：README.md
- 在仓库的 shared 目录执行：
    * cd .\shared
    * yarn modules
    * yarn build-dev（或 yarn build-prod）
    * yarn start（直接运行桌面端开发版）
- 热更新模式可用：yarn hot-server + yarn start-hot（两个终端）。

### 创建安装包

- 先区分两类：
    * Electron 应用包：在 shared 目录执行 yarn package（产物在 desktop 下的 release 目录，逻辑见 package.desktop.tsx）。
    * Windows MSI 安装包：走 readme.md 的流程。
- 调试版 MSI（免签名）最直接：
    * 安装前置（Go/Node/Yarn/MinGW/VS2015/WiX）
    * cd .\packaging\windows
    * build_debug_installer.cmd
    * 产物位置见 build_debug_installer.cmd（最后输出到 WIXInstallers/KeybaseApps/bin/Debug）

### macOS 安装包制作流程

#### 关键脚本

| 脚本 | 作用 |
|------|------|
| `packaging/build_darwin.sh` | 入口脚本，支持 `amd64` / `arm64` |
| `packaging/prerelease/build_app.sh` | 编译 Go 二进制、拉取依赖 |
| `packaging/desktop/package_darwin.sh` | 打包核心流程 |

#### 打包步骤（`package_darwin.sh` 中的顺序）

```
clean           → 清理临时目录
get_deps        → 下载 keybase/kbfs/kbnm/updater 二进制
package_electron→ 用 Electron 构建 Keybase.app
package_app     → 将 Go 二进制注入 .app/Contents/SharedSupport/bin/
update_plist    → 修改 Info.plist（隐藏 Dock 图标等）
sign            → codesign 签名（需要 Apple Developer ID）
package_dmg     → 用 appdmg 生成 .dmg 安装包
notarize_dmg    → xcrun notarytool 公证（可用 SKIP_NOTARIZE=1 跳过）
create_zip      → ditto 打包为 .zip（用于自动更新）
kbsign          → 用 keybase 签名 zip
save            → 归档输出文件
```

#### 运行命令

```bash
# 默认先进入 packaging 目录
cd packaging

# 构建两个架构（amd64 + arm64）
./build_darwin.sh

# 只构建某一架构，跳过公证、S3 上传
ARCH=arm64 SKIP_NOTARIZE=1 NOS3=1 NOWAIT=1 SKIP_SIGN=1 ./build_darwin.sh
```

#### 前置条件

- Xcode + Apple Developer ID 证书（用于 `codesign`）
- Notary Profile `NOTARY_PROFILE_LOGIN`（用于 `notarytool`，可跳过）
- 使用当前目录作为 `GOPATH`（例如：`export GOPATH=$(pwd)`）
- Node.js / Yarn 已安装
- `go install` 可访问（用于构建 `release` 工具）

### 改版本号

- 主版本号在 version.go:7，直接改 Version = "6.6.1" 为你想要的语义版本。
- 打包读取入口是 version.sh:13-24：非 production 会自动追加时间戳和 commit（形如 -YYYY...+sha）。
- 正式发布脚本会校验版本一致性，见 release.sh:9-56。

### 阻止自动升级（桌面端）

- 定时更新检查是这里启动的： shared/constants/platform-specific/index.desktop.tsx:258。
- 更新检查 RPC 在 shared/constants/config/index.tsx:282-301。
- 真正触发“开始更新”的 RPC 在 index.tsx:347-365。
- 服务端“强制过期”通知入口在 index.desktop.tsx:136-143。

By ai

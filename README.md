## Candy Edit Keybase

### New Features

- feat: "Chat" is the first tab in left side menu
- fix: windows cannot clear red dot even have read message
- feat: add font selection support in Settings - Display - Chat font
- feat: add config to disable upgrade / check upgrade in Settings - 
- doc: add candy edit credit

## Tech Related

### Windows 开发构建与运行（最快）

- 先看官方入口：README.md
- 在仓库的 shared 目录执行：
    * cd H:\git_dirs\keybaseclient_candy\shared
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
    * cd H:\git_dirs\keybaseclient_candy\packaging\windows
    * build_debug_installer.cmd
    * 产物位置见 build_debug_installer.cmd（最后输出到 WIXInstallers/KeybaseApps/bin/Debug）

### 改版本号

- 主版本号在 version.go:7，直接改 Version = "6.6.1" 为你想要的语义版本。
- 打包读取入口是 version.sh:13-24：非 production 会自动追加时间戳和 commit（形如 -YYYY...+sha）。
- 正式发布脚本会校验版本一致性，见 release.sh:9-56。

### 阻止自动升级（桌面端）

- 定时更新检查是这里启动的： index.desktop.tsx:258。
- 更新检查 RPC 在 index.tsx:282-301。
- 真正触发“开始更新”的 RPC 在 index.tsx:347-365。
- 服务端“强制过期”通知入口在 index.desktop.tsx:136-143。

By ai

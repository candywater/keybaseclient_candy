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

By ai
#node-ci

<p>该项目主要功能为流水线自动化部署</p>

1. 实现http连接断开时自动杀死进程，防止进程存在时间过长（linux/win）
2. 实现每个项目的每个命令只能同时运行一个，防止重复操作进程过多
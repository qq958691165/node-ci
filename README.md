# node-ci

<p>该项目主要功能为流水线自动化部署</p>

1. 实现http连接断开时自动杀死进程，防止进程存在时间过长（linux/win）
2. 实现每个项目的每个命令只能同时运行一个，防止重复操作进程过多

## 用法
1. 克隆此项目到要部署的机器
2. 在项目目录中复制.env.example并命名为.env
3. 使用npm install命令进行包安装
4. 更改.env配置文件
5. 参照src/Commands/example.js加入部署时想要执行的命令
6. 使用npm run start进行启动

请求示例
```
[POST] http://127.0.0.1:3000/

key=[ci的key]&project=[项目目录名]&command=[命令]
```

## 注意事项
+ ci请求参数统一json序列化放入命令进程的环境变量````CI_ARGS````中，即命令中可通过环境变量````CI_ARGS````获取

## CI示例文件
1. [ExampleCommand](./src/Commands/example.js)
2. [ExampleCiRequest](./example.sh)
# Webpack4_Express

### 项目介绍
这是一套cli工程，可以快速开发、编译构建和上线运行，是一套完整的前后端一站式解决方案，特点是单命令行、零配置进行开发。

同时，工程中加入了用户输入检查、git分支检查以及友好的日志提示，开发人员可以愉快地开发


### 安装依赖
```
npm install
```

### 使用说明

#### 1. 创建新项目
```
npm run add <module-name>
```

#### 2. 本地运行项目
```
npm run dev <module-name>
```
#### 3. 编译构建
```
npm run build <module-name>
```
[注]: 以上 `<module-name>` 指 `/client/<module-name>`

#### 4. 线上运行
```
npm run serve
```
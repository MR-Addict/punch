<h1>技术部值班笔记👻<img src="https://github.com/MR-Addict/punch/actions/workflows/server.yml/badge.svg?branch=main"/> <img src="https://github.com/MR-Addict/punch/actions/workflows/docker.yml/badge.svg?branch=main"/></h1>

## 1. 预览

![Punch](images/Punch.png)

## 2. 准备数据库

### 2.1 创建新用户

创建新的MySQL用户，用户名为`punch`，密码为`password`：

```sql
CREATE USER 'punch'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```

授予`punch`用户权限：

```sql
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'punch'@'localhost' WITH GRANT OPTION;
```

重置用户权限缓存：

```sql
FLUSH PRIVILEGES;
```

### 2.2 创建新数据库

创建新的数据库，名称为`punch`：

```sql
CREATE DATABASE punch;
```

创建新的Table，名称为`punch`：

```sql
USE punch;

CREATE TABLE `punch`(
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `group` VARCHAR(10) NOT NULL,
    `name` VARCHAR(10) NOT NULL,
    `time` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `notes` VARCHAR(500) NOT NULL
);
```

## 3. 搭建服务器

克隆本文档：

```bash
git clone https://github.com/MR-Addict/punch.git
```

编译docker镜像：

```bash
docker build -t punch .
```

你也可以远程拉取：

```bash
docker pull mraddict063/punch
```

然后重新tag：

```
docker tag mraddict063/punch punch
```

最后启动docker容器：

```bash
docker-compose up -d
```

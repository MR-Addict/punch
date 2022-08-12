<h1>科协技术部值班笔记👻<img src="https://github.com/MR-Addict/punch/actions/workflows/server.yml/badge.svg?branch=main"/>
</h1>

## 1. 预览

|             值班笔记主页             |             值班笔记提交成功页             |
| :----------------------------------: | :----------------------------------------: |
| ![Punch-Home](images/Punch-Home.png) | ![Punch-Success](images/Punch-Success.png) |

> 值班笔记主页：[https://punch.mraddict.top](https://punch.mraddict.top)

## 2. 搭建服务器

克隆本文档：

```bash
git clone https://github.com/MR-Addict/punch.git
```

安装依赖：

```bash
npm install
```

运行脚本：

```bash
node app.js
```

## 3. 准备MySQL

创建新的MySQL用户，用户名为`punch`，密码为`@Punch_password_1234`：

```sql
CREATE USER 'punch'@'localhost' IDENTIFIED WITH mysql_native_password BY '@Punch_password_1234';
```

授予`punch`用户权限：

```sql
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'punch'@'localhost' WITH GRANT OPTION;
```

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

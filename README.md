# 前言

> 该项目是本人在学习`vue`做的全栈项目，目前还在完善阶段，后续会持续更新、维护。

# 学生管理系统

## 1.绪论

### 1.1 项目概述

该系统为学生管理系统，管理员可以管理教师、学生的信息，教师可以发布通告、请假审批。学生可以获取健康表和上报健康表、请假申请、获取通知。

### 1.2 项目意义

发挥计算机的作用，对学生进行规范的管理。

## 2.开发技术和技术介绍

### 2.1 开发技术

前端采用的是`Vue+element-ui`、后端采用的是`Node+express+Mysql`。

## 3.系统设计

### 3.1 功能设计

该系统主要分为三个角色，分别对应不同的功能：

1. 管理员：增删改查老师、学生信息。
2. 老师：发布通知、审批请假条。
3. 学生：查看通知、请假、健康上报

### 3.2 数据库设计

四张表（暂定）：用户表、健康表、请假表、公告表。


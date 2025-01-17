# License

Except as otherwise noted this software is licensed under the
[Orchsym License, Version 1.0]

Licensed under the Orchsym License, Version 1.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    
https://github.com/orchsym/runtime/blob/master/orchsym/LICENSE
    
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


----------------------------
# Version 2.0_11000

版本号：1.7.1-2.0_11000

发布日期：2019-12-06

组件总数：286 (+14)

服务总数：59 (+2)


## 新功能
- 前端改版
- 应用列表管理
- 模板库管理
- 服务管理

## 改进
- QueryRecord组件升级Apache Calcite版本

## 缺陷 
- 编排2.0_09000查看含有中文的流文件内容时显示乱码


----------------------------
# Version 2.0_10000

版本号：1.7.1-2.0_10000

发布日期：2019-11-07

组件总数：286 (+14)

服务总数：59 (+2)


## 新功能
- 前端改版
- 开发接口支持搜索当前模块及子模块
- 开发接口返回应用简短信息
- 支持应用记录创建和修改时间

## 改进
- 数据库连接池服务不支持多版本
- 升级Jackson版本
- Putemail附件名称支持中文
- 删除多个模块时，页面无响应
- 应用重名校验接口

## 缺陷 
- HandleHttpRequest超时触发request被重复处理,额外产一个空流文件
- 应用标签无法设置
- 删除模块队列失败


----------------------------
# Version 2.0_09000

版本号：1.7.1-2.0_09000

发布日期：2019-09-27

组件总数：286 (+14)

服务总数：59 (+2)


## 新功能
- [组件]解析加载配置为属性

## 改进
- 退出跳转地址支持配置

## 缺陷 
- ConvertJSONToSQL组件因oracle目标表结构存在default值，返回报错：Stream has already been closed
- 升级fastjson版本避免OOM
- QueryRecord组件里like语句不支持中文
- math表达式计算失败


----------------------------
# Version 2.0_08000

版本号：1.7.1-2.0_08000

发布日期：2019-08-23

组件总数：284 (+12)

服务总数：59 (+2)


## 新功能
- 表达式语言支持BigDecimal计算
- 前端改版第一阶段
- [组件]开发FilterRecord记录过滤组件
- 支持Usage Data Collector功能

## 改进
- InferAvroSchema将生成的doc字段设置为可选
- 优化XML和JSON互转组件
- PublishAMQP，ConsumeAMQP组件参数需要支持表达式语言

## 缺陷 
- 集群节点依次重启时不能正常恢复集群状态
- 修改打包文件的权限
- restart命令重启后runtime无法启动


----------------------------
# Version 2.0_07000

版本号：1.7.1-2.0_07000

发布日期：2019-07-24

组件总数：288 (+16)

服务总数：59 (+2)


## 新功能
- [组件]开发FilterField字段过滤组件

## 改进
- PutTCP、PutUDP、PutSplunk 参数支持属性变量
- 增强提取属性组件功能
- InvokeHTTP的DELETE不支持接收Body

## 缺陷 
- 文档目录遍历问题
- 升级Groovy解决编码问题
- 平台日志轮滚时,maxHistory 和 totalSizeCap失效
- Log4j安全漏洞修复
- repository库更新或读取出错
- API服务后台swagger请求失败
- EL表达式在属性设置中提示值带序号


----------------------------
# Version 2.0_06001

版本号：1.7.1-2.0_06001

发布日期：2019-07-09

组件总数：287 (+15)

服务总数：60 (+3)


## 缺陷 
- API服务后台swagger请求失败


----------------------------
# Version 2.0_06000

版本号：1.7.1-2.0_06000

发布日期：2019-06-19

组件总数：287 (+15)

服务总数：60 (+3)


## 新功能
- 支持集群模式下登录token共享

## 改进
- 库日志支持详细错误堆栈
- 修改PutDatabaseRecord字段转换默认值
- 增强SignatureProcessor组件支持大文件
- 完成全部组件或控制器翻译

## 缺陷 
- 组件分类不正确
- 数据朔源功能失效
- 单一nar包无法加载导致无法启动
- HandleHttpRequest 请求超时
- flowfile更新失败


----------------------------
# Version 2.0_05000

版本号：1.7.1-2.0_05000

发布日期：2019-05-17

组件总数：287 (+15)

服务总数：60 (+3)


## 新功能
- 模块底层数据增加分类元数据
- PutFile 缺少Append 文件内容选项

## 改进
- 前端支持表达式提示信息
- 数据库组件日志完善
- GetFile组件修改默认为不删除源文件
- 校正表达式语言手册
- 组件翻译第四阶段

## 缺陷 
- Runtime自动刷新请求丢失Token


----------------------------
# Version 2.4.0

版本号：1.7.1-2.4.0

发布日期：2019-04-18

组件总数：287 (+15)

服务总数：60 (+3)

## 新功能
- 创建支持Redis存储失效时间的组件

## 缺陷 
- 平台启用权限认证后flow根权限为只读
- 组件国际化不支持带版本的组件
- HandleHTTPRequest开启API注册功能启动后Method不正确
- 控制器服务应默认启动
- XML和JSON转换组件丢失属性
- 认证用户登录平台后默认不创建账号


----------------------------
# Version 2.3.1

版本号：1.7.1-2.3.1

发布日期：2019-03-12

组件总数：286 (+14)

服务总数：60 (+3)


## 新功能
- 增加表达式语言日期操作函数

## 改进
- 将平台前端JSP转换为HTML
- 组件翻译第二阶段

## 缺陷 
- 组件UpdateAttribute无法在高级设置中添加规则


----------------------------
# Version 2.3.0

版本号：1.7.1-2.3.0

发布日期：2019-02-28

组件总数：286 (+14)

服务总数：60 (+3)


## 新功能
- 分离集群心跳日志到orchsym-cluster.log

## 改进
- PutDistributedMapCache增加支持动态属性设置
- 修改HandleHttpRequest默认端口

## 缺陷
- 组件ExtractAvroToAttributes加载失败
- 删除组件不提示确认信息


----------------------------
# Version 2.2.0

2019新春祝福版

版本号：1.7.1-2.2.0

发布日期：2019-01-30

组件总数：288 (+16)

服务总数：60 (+3)


## 新功能
 - [组件]提供简便的XML与JSON互转组件
 - [组件]提供简便的XML与JSON抽取成属性
 - 升级平台到NiFi 1.7.1正式版

## 改进
 - 支持队列查看文件内容或格式化支持最大行数或record记录数
 - 升级平台中组件Groovy版本
 - HandleHttpRequest 组件将 allowed path 设置为必填项
 - HandleHTTPRequest组件功能增强
 - 提升平台数据存储配置默认值


## 缺陷
 - host:8443/nifi-api/apis 接口报 500 错误
 - [无法全部启动当前模块的所有组件
 - 组件CRON 设置始终无效
 - LogMessage 不能正常处理Flowfile


----------------------------
# Version 2.1.1

版本号：1.7.0-2.1.1

发布日期：2019-01-15

组件总数：287 (+22)

服务总数：53 (+2)


## 缺陷
 - host:8443/nifi-api/apis 接口报 500 错误
 

----------------------------
# Version 2.1.0

圣诞特别版

版本号：1.7.0-2.1.0

发布日期：2018-12-24

组件总数：287 (+22)

服务总数：53 (+2)


## 新功能
 - 组件的国际化语言支持
 - 支持用户切换多语言
 - 删除组件时，提供二次确认功能
 - 一键启动当前模块的ControllerService 
 - 平台支持管理额外依赖包
 - 对于没有输入的部分运行安排设置是0秒的组件，在运行前需提供一警告消息
        
## 改进
 - 当组件执行失败，多次尝试后日志刷爆系统
 - 新用户登录时，创建新用户并设置对应默认权限
 - 缺省的管理员应当拥有所有的用户权限
 - InvokeHTTP启用https(SSL)后，提供忽略认证选项
 - 组件打包时，需要支持可选打包system依赖
 - 修改about对话框，返回实际的版本信息
 - “最大定时器驱动线程数”默认值过小，导致并发失败
 - 平台下载模板功能完善
 - 重构API Service，并直接作为runtime可配置内置功能
 - 菜单名称不显示




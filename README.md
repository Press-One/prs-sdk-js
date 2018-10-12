# 关于 PRESSone 项目
* [PRESSone 官网](https://press.one)
* [PRESSone 白皮书](https://static.press.one/files/PRS_whitepaper_1_0_1_cn.pdf)
* [PRESSone 开发者论坛](https://bbs.onedev.club/)
* [官方SDK 文档及资源](https://github.com/Press-One/Third-Party-APP-SDK)

# 关于 DApp SDK

PRESS.one被设计为基于多种共识基础之上的应用层协议。PRS网络的目标是创建一个去中心的数字内容分发系统。PRESS.one协议帮助开发者连接区块链、各种共识、P2P、云存储等不同的技术，让开发者可以建立自己的去中心应用，这些应用可以在区块链之外保存自己的私有数据，但把需要公开的数据存储在PRS网络上，整个生态系统都可以从这些公开的分享数据中获益。

## DApp

在PRS架构中，DApp是和最终用户接触的部分，大多数普通用户的操作是基于一个或多个DApp组合完成的。第三方开发者、创业者基于PRS协议开发DApp；现有的互联网产品或服务商也可通过接入协议成为PRS网络上的DApp。

目前我们正在开发的PRESS.one网站和 mobile APP，也可以看作PRS网络之上的DApp之一。

每个DApp拥有自己的私有数据和公有数据。其中公有数据，指的是最终将存放在PRS链上，兼容PRS协议的数据。私有数据通常是指敏感的个人信息，这些数据可以在链外存储。链外的隐私数据是一些DApp必须的，但是又没有必要与其他人共享和放到链上存储，这些数据将完全由DApp开发和运营者负责存储，并保证其数据和隐私安全。

Dapp开发者并不需要从头实现PRESSone协议，他们可以通过PRESSone提供的API服务和节点交互。API帮助我们隐藏了底层区块链操作的复杂性，以更友好的方式提供开发者所需的功能。

开发者可以通过API创建DApp,之后PRESS.one用户可以生成一份新密钥对，授权给第三方DApp使用，从而使得DApp拥有创建签名和运行合约的权限。
用户注册PRESS.one帐号时候，会创建出第一对密钥，我们称之为用户根密钥。用户可以使用自己的根密钥签名来授权或吊销第三方密钥。
授权之后的密钥对，和用户在PRESS系统内第一对密钥的权限是相同的。唯一的区别在于，它们生成的时间戳不同。

## SDK

PRESS.one第三方接入SDK，目前包含的开发实例包括以下主要功能：

* DApp，创建、获取以及维护；
* PRESS.one用户授权和取消授权DApp；
* 通过授权秘钥对来签名发布文件。

## 使用步骤

* 开发者注册PRESS.one，获取keystore。(keystore+密码=>私钥)
* 开发者创建DApp，获取 App publish address。
* 创建新的秘钥对(包括 private key, public key, publish address)。
* PRESS.one将新创建的秘钥对授权给 DApp 使用。
* 授权成功之后，即可通过新的秘钥对来签名发布文件。

## 示例使用方法

* 具体的每个步骤，都在`/cases`目录有实现参考；
* 所有加密，签名，运算所需要的函数，都在`/utility.js`文件中可以找到参考实现。
* [开发文档](https://github.com/Press-One/Third-Party-APP-SDK/wiki)

## Tips

本SDK还相当早期，期间我们会不断更新实例和注释，帮助大家理解接入的细节，欢迎隔一段时间之后重新回来看看。


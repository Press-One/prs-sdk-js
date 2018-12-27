## PRESS.one 简介

PRESSone的目标是创建基于区块链的数字内容交易及分发网络:

- 利用区块链经济、确权信息和交易历史的链上存证、可灵活自定义的轻合约、分布式存储机制等，推动交易模式的革新，改变现有的数字内容生产/授权/分发/销售方式。
- 借助新型的信任机制、组织形式和驱动模式，重塑内容生产者/传播者/消费者之间的关系。
- 创建可跨越多种共识的应用层协议（PRS协议）。通过组合不同共识、公链、去中心存储和中心化云存储等资源，构建一套透明、高效、平等的开放架构，允许任何人基于PRS协议与开放的数据去创建应用，探索自己的商业模式，发展创新。

更多内容请查看项目白皮书: [中文版](https://static.press.one/files/PRS_whitepaper_1_0_1_cn.pdf) 、 [英文版](https://static.press.one/files/PRS_Whitepape_1_0_en.pdf)

## PRS DApp 简介

DApp 是 *decentralized application* 的缩写，即去中心化应用。

在 PRS 架构中，DApp 是和最终用户接触的部分，大多数普通用户的操作是基于一个或多个 DApp 组合完成的。第三方开发者、创业者基于 PRS 协议开发 DApp ；现有的互联网产品或服务商也可通过接入协议成为 PRS 网络上的 DApp。

目前我们正在开发的 PRESS.one 网站和 Mobile APP，也可以看作 PRS 网络之上的 DApp 之一。

每个 DApp 拥有自己的私有数据和公有数据。其中公有数据，指的是最终将存放在 PRS 链上，兼容 PRS 协议的数据。私有数据通常是指敏感的个人信息，这些数据可以在链外存储。链外的隐私数据是一些 DApp 必须的，但是又没有必要与其他人共享和放到链上存储，这些数据将完全由 DApp 开发和运营者负责存储，并保证其数据和隐私安全。

DApp 开发者并不需要从头实现 PRESSone 协议，开发者可以通过 PRESSone 提供的 API 服务和节点交互。API 帮助我们隐藏了底层区块链操作的复杂性，以更友好的方式提供开发者所需的功能。我们推荐开发者使用 PRS API 来开发自己的 DApp。

## PRS 社区

- [Twitter](https://twitter.com/PRESSoneHQ)
- [微信公众号](https://mp.weixin.qq.com/s/C7yPdlEP5OVhbfWLtOBGTQ)
- [开发者论坛](https://bbs.onedev.club)
- [Medium](https://medium.com/@pressone/)

## 如何使用?

### 主要功能

1. DApp 的创建以及维护。
2. 用户对 DApp 授权/取消授权。
3. 使用授权秘钥签名发布文件。
4. 合约创建、合约绑定、合约购买。

### 使用步骤

1. 注册开发者账号。
2. 创建 DApp。
3. DApp 创建新的密钥对(包括 private key, public key, publish address)。
4. 让 PRS 用户，通过数字签名的方式，给步骤(3)中创建新的密钥对进行授权， 使新的密钥对拥有签名和提交交易，提交合约的能力。
5. 使用新的密钥对来签名发布文件以及创建合约。
  
### 示例使用方法

* 具体的每个步骤，都在`/cases`目录有实现参考；
* 所有加密，签名，运算所需要的函数，都在`/utility.js`文件中可以找到参考实现。
* [开发文档](https://developer.press.one)

### Tips

目前 SDK 还相当早期，我们会不断更新实例和注释，帮助大家理解接入的细节。同时会根据开发者的需求，包装开放新的 API。


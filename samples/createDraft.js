const PRS = require('prs-lib');

let demo = async function () {
  try {
    // 通过 Web 授权获取对应的 authAddress 和 token，可参考 ./examples/webAuth.js。
    const authAddress = '';
    const token = '';

    // 初始化 client
    const client = new PRS({ env: 'env', debug: true, address: authAddress, token: token });

    // 目前 PRS 支持创建文本草稿
    let draft = {
      title: `draft title ${String(Date.now())}`,
      content: `draft content ${String(Date.now())}`,
      mimeType: 'text/plain'
    }
    const draftRes = await client.draft.create(draft);
    const draftId = draftRes.body.draftId;

    // 根据 id 更新草稿内容
    let draftNew = {
      title: `draft update title ${String(Date.now())}`,
      content: `draft update content ${String(Date.now())}`,
      mimeType: 'text/plain'
    }
    await client.draft.update(draftId, draftNew);

    // 根据 id 获取草稿
    const res = await client.draft.getById(draftId);
    console.log(res.body);


  } catch (err) {
  }
}

demo();
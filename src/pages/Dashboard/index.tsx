import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { ResponsiveGrid, Input, Button, Select,Message } from '@alifd/next';
import { request } from 'ice';
import crypto from 'crypto-js';

const { Cell } = ResponsiveGrid;
const { Option } = Select;

const list = [
  {
    value: 0,
    type: 'I 级',
    title: '中文-英文-日文-中文',
    method: ['zh en', 'en jp', 'jp zh'],
  },
  {
    value: 1,
    type: 'II 级',
    title: '中文-英文-日文-德文-意大利语-中文',
    method: ['zh en', 'en jp', 'jp de', 'de it', 'it zh'],
  },
  {
    value: 2,
    type: 'III 级',
    title: '中文-英文-日文-德文-意大利语-波兰语-葡萄牙语-中文',
    method: ['zh en', 'en jp', 'jp de', 'de it', 'it pl', 'pl pt', 'pt zh'],
  },
];

async function translate(q: string, from: string, to: string,appid:string,password:string) {
  const salt = Math.floor(Math.random() * 10000000000);
  const sign = crypto.MD5(appid + q + salt + password).toString();
  console.log(salt, sign);
  return await request.get(
    `/api/trans/vip/translate?q=${q}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
}
const Dashboard = () => {
  const [grade, setGrade] = React.useState(0);
  const [appid,setAppid] = React.useState('');
  const [password,setPassword] = React.useState('');
  const [text,setText] = React.useState('');
  const [trans,setTrans] = React.useState('');
  useEffect(()=>{
    setAppid(localStorage.getItem('appid')||'');
    setPassword(localStorage.getItem('password')||'')
  });
  const changeAppid = (value)=>{
    setAppid(value);
    localStorage.setItem('appid',value)
  }
  const changePassword = (value)=>{
    setPassword(value);
    localStorage.setItem('password',value)
  }
  const submit = () => {
    Message.success("提交成功!")
    const { method } = list[grade];
    (async function () {
      for (let i = 0; i < method.length; i++) {
        const mode = method[i].split(' ');
        const res = await translate(text, mode[0], mode[1],appid,password);
        console.log(res)
        setText(res.trans_result[0].dst)
      }
    })();
  };
  const copy = ()=>{
    const input = document.getElementById('input');
    input?.select();
    document.execCommand("copy");
    Message.success('复制成功!');
  }
  return (
    <ResponsiveGrid>
      <Cell colSpan={2} className={styles.list}>
        <span className={styles.span}>appId</span>
        <Input className={styles.input} defaultValue={localStorage.getItem('appid')||''} onChange={(value)=>{changeAppid(value)}} />
      </Cell>
      <Cell colSpan={2} className={styles.list}>
        <span className={styles.span}>密钥</span>
        <Input className={styles.input} defaultValue={localStorage.getItem('appid')||''} onChange = {(value)=>{changePassword(value)}} />
      </Cell>
      <Cell colSpan={6} className={styles.list}>
        <span className={styles.span}>请选择降重级别</span>
        <Select defaultValue="I" className={styles.select} onChange={(value) => setGrade(value)}>
          {
            list.map((item, index) => {
              return <Option value={item.value} key={index} >{item.type}</Option>;
            })
          }
        </Select>
        <span className={styles.span} style={{ color: 'gray' }}>{list[grade].title}</span>
      </Cell>
      <Cell colSpan={2} className={styles.list}>
        <a className={styles.link} target="_blank" href="https://api.fanyi.baidu.com/api/trans/product/apichoose" rel="noreferrer">没有百度翻译权限?点此获取</a>
      </Cell>
      <Cell colSpan={6} className={styles.list}>
        <span className={styles.span}>原文</span>
        <Input.TextArea className={styles.textarea} rows={20} onChange={(value)=>{setTrans(value);setText(value);}} />
      </Cell>
      <Cell colSpan={6} className={styles.list}>
        <span className={styles.span}>降重</span>
        <Input.TextArea className={styles.textarea} rows={20} value={text} id='input'/>
      </Cell>
      <Cell colSpan={6} className={styles.list}>
        <Button size="large" type="secondary" onClick={submit}>提交降重</Button>
      </Cell>
      <Cell colSpan={6} className={styles.list}>
        <Button size="large" type="secondary" onClick={copy}>一键复制</Button>
      </Cell>
    </ResponsiveGrid>
  );
};

export default Dashboard;

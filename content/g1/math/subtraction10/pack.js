window.KA_PACK={
id:"g1_math_subtraction10",
title:"一年級數學 RPG",
gradeLabel:"1年級",
subjectLabel:"數學",
unitLabel:"10以內減法",
mobName:"減法蝙蝠",
mobIcon:"🦇",
bossName:"減法魔王",
bossIcon:"👹",
ticketCost:3,
generators:{
normal:({rand})=>{
  let a,b;
  do{a=rand(1,10);b=rand(0,a)}while(a-b<0);
  return{
    label:"⚔️ 普攻",
    prompt:`${a} - ${b} = ?`,
    inputs:[{kind:"number",key:"x"}],
    check:v=>Number(v.x)===a-b
  }
},
magic:({rand})=>{
  const variant=rand(1,3);
  let a,b,c;
  if(variant===1){
    a=rand(1,10);b=rand(0,a);c=a-b;
    return{
      label:"✨ 魔法",
      prompt:`${a} - [?] = ${c}`,
      inputs:[{kind:"number",key:"x"}],
      check:v=>Number(v.x)===b
    }
  }
  if(variant===2){
    a=rand(1,10);b=rand(0,a);c=a-b;
    return{
      label:"✨ 魔法",
      prompt:`[?] - ${b} = ${c}`,
      inputs:[{kind:"number",key:"x"}],
      check:v=>Number(v.x)===a
    }
  }
  // 運算符號選擇，不用下拉
  do{a=rand(1,9);b=rand(0,9)}while(a+b>10);
  const useMinus=Math.random()<0.5;
  c=useMinus ? a-b : a+b;
  if(useMinus && c<0){ const t=a;a=b;b=t;c=a-b; }
  return{
    label:"✨ 魔法",
    prompt:`${a} [?] ${b} = ${c}`,
    inputs:[{kind:"choice",key:"op",options:[["+","＋"],["-","－"]]}],
    check:v=>v.op==="+" ? a+b===c : a-b===c
  }
},
defense:({rand})=>{
  let a,b;
  do{a=rand(1,10);b=rand(0,a)}while(a-b<0);
  const real=a-b, ok=Math.random()<0.5;
  let shown=real;
  if(!ok){ do{shown=rand(0,10)}while(shown===real); }
  return{
    label:"🛡️ 防禦",
    prompt:`${a} - ${b} = ${shown}`,
    inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],
    check:v=>(v.x==="yes")===ok
  }
},
ultimate:({rand})=>{
  const target=rand(0,8);
  return{
    label:"🔥 必殺",
    prompt:`找出兩種不同方法得到 ${target}`,
    inputs:[
      {kind:"number",key:"a1"},{kind:"number",key:"b1"},
      {kind:"number",key:"a2"},{kind:"number",key:"b2"}
    ],
    check:v=>{
      const a=+v.a1,b=+v.b1,c=+v.a2,d=+v.b2;
      const valid=[a,b,c,d].every(n=>Number.isInteger(n)&&n>=0&&n<=10);
      const same=(a===c&&b===d);
      return valid&&a>=b&&c>=d&&a-b===target&&c-d===target&&!same;
    }
  }
}
}};
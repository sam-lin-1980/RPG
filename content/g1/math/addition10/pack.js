window.KA_PACK={
id:"g1_math_addition10",title:"一年級數學 RPG",gradeLabel:"一年級",subjectLabel:"數學",unitLabel:"10以內加法",
mobName:"加法史萊姆",mobIcon:"👾",bossName:"算術魔王",bossIcon:"👹",ticketCost:3,
generators:{
normal:({rand})=>{let a,b;do{a=rand(0,9);b=rand(0,9)}while(a+b>10||a+b===0);return{label:"⚔️ 普攻",prompt:`${a} + ${b} = ?`,inputs:[{kind:"number",key:"x"}],check:v=>Number(v.x)===a+b}},
magic:({rand})=>{let a,b;do{a=rand(0,9);b=rand(0,9)}while(a+b>10||a+b===0);return Math.random()<.5?
{label:"✨ 魔法",prompt:`${a} + [?] = ${a+b}`,inputs:[{kind:"number",key:"x"}],check:v=>Number(v.x)===b}:
{label:"✨ 魔法",prompt:`[?] + ${b} = ${a+b}`,inputs:[{kind:"number",key:"x"}],check:v=>Number(v.x)===a}},
defense:({rand})=>{let a,b;do{a=rand(0,9);b=rand(0,9)}while(a+b>10||a+b===0);const real=a+b,ok=Math.random()<.5;let shown=real;if(!ok){do{shown=rand(0,10)}while(shown===real)}return{label:"🛡️ 防禦",prompt:`${a} + ${b} = ${shown}`,inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>(v.x==="yes")===ok}},
ultimate:({rand})=>{const target=rand(6,10);return{label:"🔥 必殺",prompt:`找出兩種不同方法得到 ${target}`,inputs:[{kind:"number",key:"a1"},{kind:"number",key:"b1"},{kind:"number",key:"a2"},{kind:"number",key:"b2"}],check:v=>{const a=+v.a1,b=+v.b1,c=+v.a2,d=+v.b2;return a+b===target&&c+d===target&&!((a===c&&b===d)||(a===d&&b===c))}}}
}};
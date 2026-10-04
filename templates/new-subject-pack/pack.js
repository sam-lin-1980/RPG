window.KA_PACK={
id:"g2_math_example",
title:"二年級數學 RPG",
gradeLabel:"二年級",
subjectLabel:"數學",
unitLabel:"請填單元名稱",
mobName:"練習怪",
mobIcon:"👾",
bossName:"單元魔王",
bossIcon:"👹",
ticketCost:3,
generators:{
  normal:({rand,pick,clamp})=>({label:"⚔️ 普攻",prompt:"1 + 1 = ?",inputs:[{kind:"number",key:"x"}],check:v=>Number(v.x)===2}),
  magic:({rand,pick,clamp})=>({label:"✨ 魔法",prompt:"[?] + 1 = 3",inputs:[{kind:"number",key:"x"}],check:v=>Number(v.x)===2}),
  defense:({rand,pick,clamp})=>({label:"🛡️ 防禦",prompt:"1 + 1 = 2",inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>v.x==="yes"}),
  ultimate:({rand,pick,clamp})=>({label:"🔥 必殺",prompt:"請輸入 2",inputs:[{kind:"number",key:"x"}],check:v=>Number(v.x)===2})
}
};
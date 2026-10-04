window.KA_PACK={
id:"g6_math_basic",
title:"6年級數學 RPG",
gradeLabel:"6年級",
subjectLabel:"數學",
unitLabel:"預設題庫（可整包替換）",
mobName:"練習史萊姆",
mobIcon:"👾",
bossName:"數學魔王",
bossIcon:"👹",
ticketCost:3,
generators:{
  normal:()=>({label:"⚔️ 普攻",prompt:"1 + 1 = ?",inputs:[{kind:"number",key:"x"}],check:v=>Number(v.x)===2}),
  magic:()=>({label:"✨ 魔法",prompt:"[?] + 1 = 3",inputs:[{kind:"number",key:"x"}],check:v=>Number(v.x)===2}),
  defense:()=>({label:"🛡️ 防禦",prompt:"1 + 1 = 2",inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>v.x==="yes"}),
  ultimate:()=>({label:"🔥 必殺",prompt:"請輸入 2",inputs:[{kind:"number",key:"x"}],check:v=>Number(v.x)===2})
}
};
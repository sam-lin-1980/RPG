window.KA_PACK={
id:"g2_life_basic",
title:"2年級生活 RPG",
gradeLabel:"2年級",
subjectLabel:"生活",
unitLabel:"預設題庫（可整包替換）",
mobName:"生活史萊姆",
mobIcon:"🌱",
bossName:"生活魔王",
bossIcon:"🐲",
ticketCost:3,
generators:{
  normal:()=>({label:"⚔️ 普攻",prompt:"下雨天最適合帶什麼？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="雨傘"}),
  magic:()=>({label:"✨ 魔法",prompt:"下雨天最適合帶什麼？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="雨傘"}),
  defense:()=>({label:"🛡️ 防禦",prompt:"下雨天帶雨傘是合適的。",inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>v.x==="yes"}),
  ultimate:()=>({label:"🔥 必殺",prompt:"下雨天最適合帶什麼？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="雨傘"})
}
};
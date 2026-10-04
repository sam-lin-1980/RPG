window.KA_PACK={
id:"g2_english_basic",
title:"2年級英文 RPG",
gradeLabel:"2年級",
subjectLabel:"英文",
unitLabel:"預設題庫（可整包替換）",
mobName:"字母史萊姆",
mobIcon:"🔤",
bossName:"英文魔王",
bossIcon:"🧌",
ticketCost:3,
generators:{
  normal:()=>({label:"⚔️ 普攻",prompt:"A 的小寫是？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="a"}),
  magic:()=>({label:"✨ 魔法",prompt:"A 的小寫是？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="a"}),
  defense:()=>({label:"🛡️ 防禦",prompt:"A 的小寫是 a。",inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>v.x==="yes"}),
  ultimate:()=>({label:"🔥 必殺",prompt:"A 的小寫是？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="a"})
}
};
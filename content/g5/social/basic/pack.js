window.KA_PACK={
id:"g5_social_basic",
title:"5年級社會 RPG",
gradeLabel:"5年級",
subjectLabel:"社會",
unitLabel:"預設題庫（可整包替換）",
mobName:"地圖史萊姆",
mobIcon:"🌏",
bossName:"社會魔王",
bossIcon:"🗿",
ticketCost:3,
generators:{
  normal:()=>({label:"⚔️ 普攻",prompt:"過馬路要看交通號誌嗎？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="是"}),
  magic:()=>({label:"✨ 魔法",prompt:"過馬路要看交通號誌嗎？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="是"}),
  defense:()=>({label:"🛡️ 防禦",prompt:"過馬路應遵守交通號誌。",inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>v.x==="yes"}),
  ultimate:()=>({label:"🔥 必殺",prompt:"過馬路要看交通號誌嗎？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="是"})
}
};
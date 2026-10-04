window.KA_PACK={
id:"g4_social_basic",
title:"4年級社會 RPG",
gradeLabel:"4年級",
subjectLabel:"社會",
unitLabel:"預設題庫（可整包替換）",
mobName:"地圖史萊姆",
mobIcon:"🌏",
bossName:"社會魔王",
bossIcon:"🗿",
ticketCost:3,
generators:{
  normal:()=>({label:"⚔️ 普攻",prompt:"看到紅燈時應該怎麼做？",inputs:[{kind:"choice",key:"x",options:[["停下", "停下"], ["快跑", "快跑"], ["不理會", "不理會"]]}],check:v=>v.x==="停下"}),
  magic:()=>({label:"✨ 魔法",prompt:"看到紅燈時應該怎麼做？",inputs:[{kind:"choice",key:"x",options:[["停下", "停下"], ["快跑", "快跑"], ["不理會", "不理會"]]}],check:v=>v.x==="停下"}),
  defense:()=>({label:"🛡️ 防禦",prompt:"這個敘述正確嗎？",inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>v.x==="yes"}),
  ultimate:()=>({label:"🔥 必殺",prompt:"看到紅燈時應該怎麼做？",inputs:[{kind:"choice",key:"x",options:[["停下", "停下"], ["快跑", "快跑"], ["不理會", "不理會"]]}],check:v=>v.x==="停下"})
}
};
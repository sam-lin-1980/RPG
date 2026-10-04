window.KA_PACK={
id:"g3_chinese_basic",
title:"3年級國語 RPG",
gradeLabel:"3年級",
subjectLabel:"國語",
unitLabel:"預設題庫（可整包替換）",
mobName:"字詞史萊姆",
mobIcon:"📖",
bossName:"語文魔王",
bossIcon:"👺",
ticketCost:3,
generators:{
  normal:()=>({label:"⚔️ 普攻",prompt:"「大」的相反詞是？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="小"}),
  magic:()=>({label:"✨ 魔法",prompt:"「大」的相反詞是？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="小"}),
  defense:()=>({label:"🛡️ 防禦",prompt:"「小」和「大」意思相反。",inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>v.x==="yes"}),
  ultimate:()=>({label:"🔥 必殺",prompt:"「大」的相反詞是？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="小"})
}
};
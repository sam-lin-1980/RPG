window.KA_PACK={
id:"g4_science_basic",
title:"4年級自然 RPG",
gradeLabel:"4年級",
subjectLabel:"自然",
unitLabel:"預設題庫（可整包替換）",
mobName:"實驗史萊姆",
mobIcon:"🔬",
bossName:"自然魔王",
bossIcon:"🧪",
ticketCost:3,
generators:{
  normal:()=>({label:"⚔️ 普攻",prompt:"植物需要水才能生長嗎？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="是"}),
  magic:()=>({label:"✨ 魔法",prompt:"植物需要水才能生長嗎？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="是"}),
  defense:()=>({label:"🛡️ 防禦",prompt:"植物需要水。",inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>v.x==="yes"}),
  ultimate:()=>({label:"🔥 必殺",prompt:"植物需要水才能生長嗎？",inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()==="是"})
}
};
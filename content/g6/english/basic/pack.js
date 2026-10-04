window.KA_PACK={
id:"g6_english_basic",
title:"6年級英文 RPG",
gradeLabel:"6年級",
subjectLabel:"英文",
unitLabel:"預設題庫（可整包替換）",
mobName:"字母史萊姆",
mobIcon:"🔤",
bossName:"英文魔王",
bossIcon:"🧌",
ticketCost:3,
generators:{
  normal:()=>({label:"⚔️ 普攻",prompt:"Which one is a color?",inputs:[{kind:"choice",key:"x",options:[["red", "red"], ["cat", "cat"], ["book", "book"]]}],check:v=>v.x==="red"}),
  magic:()=>({label:"✨ 魔法",prompt:"Which one is a color?",inputs:[{kind:"choice",key:"x",options:[["red", "red"], ["cat", "cat"], ["book", "book"]]}],check:v=>v.x==="red"}),
  defense:()=>({label:"🛡️ 防禦",prompt:"這個敘述正確嗎？",inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>v.x==="yes"}),
  ultimate:()=>({label:"🔥 必殺",prompt:"Which one is a color?",inputs:[{kind:"choice",key:"x",options:[["red", "red"], ["cat", "cat"], ["book", "book"]]}],check:v=>v.x==="red"})
}
};
window.KA_PACK={
id:"g6_chinese_basic",
title:"6年級國語 RPG",
gradeLabel:"6年級",
subjectLabel:"國語",
unitLabel:"預設題庫（可整包替換）",
mobName:"字詞史萊姆",
mobIcon:"📖",
bossName:"語文魔王",
bossIcon:"👺",
ticketCost:3,
generators:{
  normal:()=>({label:"⚔️ 普攻",prompt:"哪一個詞語使用比較適合？",inputs:[{kind:"choice",key:"x",options:[["學校", "學校"], ["雨傘", "雨傘"], ["鉛筆盒", "鉛筆盒"]]}],check:v=>v.x==="學校"}),
  magic:()=>({label:"✨ 魔法",prompt:"哪一個詞語使用比較適合？",inputs:[{kind:"choice",key:"x",options:[["學校", "學校"], ["雨傘", "雨傘"], ["鉛筆盒", "鉛筆盒"]]}],check:v=>v.x==="學校"}),
  defense:()=>({label:"🛡️ 防禦",prompt:"這個敘述正確嗎？",inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>v.x==="yes"}),
  ultimate:()=>({label:"🔥 必殺",prompt:"哪一個詞語使用比較適合？",inputs:[{kind:"choice",key:"x",options:[["學校", "學校"], ["雨傘", "雨傘"], ["鉛筆盒", "鉛筆盒"]]}],check:v=>v.x==="學校"})
}
};
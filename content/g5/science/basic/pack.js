window.KA_PACK={
id:"g5_science_basic",
title:"5年級自然 RPG",
gradeLabel:"5年級",
subjectLabel:"自然",
unitLabel:"預設題庫（可整包替換）",
mobName:"實驗史萊姆",
mobIcon:"🔬",
bossName:"自然魔王",
bossIcon:"🧪",
ticketCost:3,
generators:{
  normal:()=>({label:"⚔️ 普攻",prompt:"植物生長需要什麼？",inputs:[{kind:"choice",key:"x",options:[["水", "水"], ["石頭", "石頭"], ["塑膠", "塑膠"]]}],check:v=>v.x==="水"}),
  magic:()=>({label:"✨ 魔法",prompt:"植物生長需要什麼？",inputs:[{kind:"choice",key:"x",options:[["水", "水"], ["石頭", "石頭"], ["塑膠", "塑膠"]]}],check:v=>v.x==="水"}),
  defense:()=>({label:"🛡️ 防禦",prompt:"這個敘述正確嗎？",inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>v.x==="yes"}),
  ultimate:()=>({label:"🔥 必殺",prompt:"植物生長需要什麼？",inputs:[{kind:"choice",key:"x",options:[["水", "水"], ["石頭", "石頭"], ["塑膠", "塑膠"]]}],check:v=>v.x==="水"})
}
};
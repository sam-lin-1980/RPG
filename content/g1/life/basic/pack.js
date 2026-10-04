window.KA_PACK={
id:"g1_life_basic",title:"一年級生活 RPG",gradeLabel:"一年級",subjectLabel:"生活",unitLabel:"生活常識與安全",
mobName:"生活史萊姆",mobIcon:"🌱",bossName:"安全魔王",bossIcon:"🐲",ticketCost:3,
generators:{
normal:({pick})=>{const q=pick([
["下雨天出門最適合帶什麼？","雨傘",["雨傘","枕頭","碗"]],
["過馬路時應該先做什麼？","看號誌與來車",["直接跑","看號誌與來車","閉上眼睛"]],
["看到地板有水，怎麼做比較安全？","告訴老師並小心避開",["在上面跑","告訴老師並小心避開","故意踩水"]]
]);return{label:"⚔️ 普攻",prompt:q[0],inputs:[{kind:"choice",key:"x",options:q[2].map(x=>[x,x])}],check:v=>v.x===q[1]}},
magic:({pick})=>{const q=pick([
["天氣很熱，戶外活動後要記得補充＿＿。","水"],
["洗手可以幫助保持身體＿＿。","乾淨"],
["紅燈亮時，行人應該＿＿。","停下"]
]);return{label:"✨ 魔法",prompt:q[0],inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()===q[1]}},
defense:({pick})=>{const q=pick([
["沒有車時，可以不看紅綠燈直接跑過馬路。",false],
["用完剪刀後應該收好。",true],
["下雨天在走廊奔跑很安全。",false],
["吃東西前洗手是好習慣。",true]
]);return{label:"🛡️ 防禦",prompt:q[0],inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>(v.x==="yes")===q[1]}},
ultimate:({pick})=>{const q=pick([
["你看到同學跌倒了，最適合怎麼做？","關心同學並找老師幫忙",["取笑他","關心同學並找老師幫忙","跑走"]],
["發現插座旁邊有水，應該怎麼做？","不要碰並告訴大人",["用手擦","不要碰並告訴大人","繼續玩"]]
]);return{label:"🔥 必殺",prompt:q[0],inputs:[{kind:"choice",key:"x",options:q[2].map(x=>[x,x])}],check:v=>v.x===q[1]}}
}};
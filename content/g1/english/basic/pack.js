window.KA_PACK={
id:"g1_english_basic",title:"一年級英文 RPG",gradeLabel:"一年級",subjectLabel:"英文",unitLabel:"字母與基礎單字",
mobName:"字母史萊姆",mobIcon:"🔤",bossName:"ABC 魔王",bossIcon:"🧌",ticketCost:3,
generators:{
normal:({pick})=>{const q=pick([
["A 的小寫是哪一個？","a",["a","b","d"]],["B 的小寫是哪一個？","b",["d","b","p"]],["cat 是哪一種動物？","貓",["狗","貓","鳥"]],["red 是哪一種顏色？","紅色",["藍色","紅色","綠色"]]
]);return{label:"⚔️ 普攻",prompt:q[0],inputs:[{kind:"choice",key:"x",options:q[2].map(x=>[x,x])}],check:v=>v.x===q[1]}},
magic:({pick})=>{const q=pick([["c _ t","a"],["d _ g","o"],["_ at","c"],["r _ d","e"]]);return{label:"✨ 魔法",prompt:`補上字母：${q[0]}`,inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim().toLowerCase()===q[1]}},
defense:({pick})=>{const q=pick([["A 的小寫是 a。",true],["cat 的意思是狗。",false],["red 是紅色。",true],["B 的小寫是 d。",false]]);return{label:"🛡️ 防禦",prompt:q[0],inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>(v.x==="yes")===q[1]}},
ultimate:({pick})=>{const q=pick([["把字母排成 cat：t、c、a","cat"],["把字母排成 dog：g、d、o","dog"],["把字母排成 red：d、r、e","red"]]);return{label:"🔥 必殺",prompt:q[0],inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim().toLowerCase()===q[1]}}
}};
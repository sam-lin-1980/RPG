window.KA_PACK={
id:"g1_chinese_basic",title:"一年級國語 RPG",gradeLabel:"一年級",subjectLabel:"國語",unitLabel:"字詞與句子",
mobName:"字詞史萊姆",mobIcon:"📖",bossName:"語文魔王",bossIcon:"👺",ticketCost:3,
generators:{
normal:({pick})=>{const q=pick([
["「大」的相反詞是哪一個？","小",["小","多","高"]],
["「上」的相反詞是哪一個？","下",["前","下","左"]],
["哪一個詞和「學校」最有關？","老師",["老師","冰箱","雨傘"]],
["「小鳥在天空＿＿。」哪個詞最適合？","飛",["飛","喝","睡"]]
]);return{label:"⚔️ 普攻",prompt:q[0],inputs:[{kind:"choice",key:"x",options:q[2].map(x=>[x,x])}],check:v=>v.x===q[1]}},
magic:({pick})=>{const q=pick([
[["我","去","學校"],"我去學校"],[["小狗","在","跑"],"小狗在跑"],[["媽媽","煮","飯"],"媽媽煮飯"]
]);return{label:"✨ 魔法",prompt:`把詞排成句子：${q[0].join("｜")}`,inputs:[{kind:"text",key:"x",placeholder:"輸入完整句子"}],check:v=>String(v.x).replace(/\s/g,"")===q[1]}},
defense:({pick})=>{const q=pick([["「早上」是在晚上之後。",false],["「小」和「大」意思相反。",true],["「老師」通常在學校工作。",true],["「雨傘」是用來吃飯的。",false]]);return{label:"🛡️ 防禦",prompt:q[0],inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],check:v=>(v.x==="yes")===q[1]}},
ultimate:({pick})=>{const q=pick([
["小明放學後去公園玩。他去了哪裡？","公園"],
["小美帶雨傘出門，因為外面下雨。她帶了什麼？","雨傘"]
]);return{label:"🔥 必殺",prompt:q[0],inputs:[{kind:"text",key:"x"}],check:v=>String(v.x).trim()===q[1]}}
}};
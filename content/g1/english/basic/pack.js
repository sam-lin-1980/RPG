const BANK = [{"type": "choice", "prompt": "A 的小寫是哪一個？", "answer": "a", "options": ["a", "b", "d"]}, {"type": "choice", "prompt": "B 的小寫是哪一個？", "answer": "b", "options": ["d", "b", "p"]}, {"type": "choice", "prompt": "C 的小寫是哪一個？", "answer": "c", "options": ["c", "e", "o"]}, {"type": "choice", "prompt": "D 的小寫是哪一個？", "answer": "d", "options": ["b", "d", "p"]}, {"type": "choice", "prompt": "E 的小寫是哪一個？", "answer": "e", "options": ["e", "c", "f"]}, {"type": "choice", "prompt": "cat 是哪一種動物？", "answer": "貓", "options": ["狗", "貓", "鳥"]}, {"type": "choice", "prompt": "dog 是哪一種動物？", "answer": "狗", "options": ["魚", "狗", "貓"]}, {"type": "choice", "prompt": "bird 是哪一種動物？", "answer": "鳥", "options": ["鳥", "兔子", "魚"]}, {"type": "choice", "prompt": "red 是哪一種顏色？", "answer": "紅色", "options": ["藍色", "紅色", "綠色"]}, {"type": "choice", "prompt": "blue 是哪一種顏色？", "answer": "藍色", "options": ["黃色", "藍色", "紅色"]}, {"type": "choice", "prompt": "green 是哪一種顏色？", "answer": "綠色", "options": ["綠色", "白色", "黑色"]}, {"type": "choice", "prompt": "one 是多少？", "answer": "1", "options": ["1", "2", "3"]}, {"type": "choice", "prompt": "two 是多少？", "answer": "2", "options": ["1", "2", "4"]}, {"type": "choice", "prompt": "three 是多少？", "answer": "3", "options": ["2", "3", "5"]}, {"type": "choice", "prompt": "apple 是哪一個？", "answer": "蘋果", "options": ["蘋果", "香蕉", "橘子"]}, {"type": "choice", "prompt": "c _ t 缺少哪個字母？", "answer": "a", "options": ["a", "e", "o"]}, {"type": "choice", "prompt": "d _ g 缺少哪個字母？", "answer": "o", "options": ["a", "o", "u"]}, {"type": "choice", "prompt": "_ at 缺少哪個字母？", "answer": "c", "options": ["b", "c", "d"]}, {"type": "choice", "prompt": "r _ d 缺少哪個字母？", "answer": "e", "options": ["a", "e", "i"]}, {"type": "choice", "prompt": "b _ g 缺少哪個字母？", "answer": "a", "options": ["a", "e", "i"]}, {"type": "tf", "prompt": "A 的小寫是 a。", "answer": true}, {"type": "tf", "prompt": "B 的小寫是 d。", "answer": false}, {"type": "tf", "prompt": "cat 的意思是貓。", "answer": true}, {"type": "tf", "prompt": "dog 的意思是鳥。", "answer": false}, {"type": "tf", "prompt": "red 是紅色。", "answer": true}, {"type": "reorder", "prompt": "把字母排成 cat", "answer": ["c", "a", "t"], "items": ["t", "c", "a"]}, {"type": "reorder", "prompt": "把字母排成 dog", "answer": ["d", "o", "g"], "items": ["g", "d", "o"]}, {"type": "reorder", "prompt": "把字母排成 red", "answer": ["r", "e", "d"], "items": ["d", "r", "e"]}, {"type": "reorder", "prompt": "把字母排成 bag", "answer": ["b", "a", "g"], "items": ["g", "b", "a"]}, {"type": "reorder", "prompt": "把字母排成 pen", "answer": ["p", "e", "n"], "items": ["n", "p", "e"]}];

function qFromBank(bank, wanted){
  const list=bank.filter(q=>wanted.includes(q.type));
  const q=list[Math.floor(Math.random()*list.length)];
  if(q.type==="choice"){
    return {
      prompt:q.prompt,
      inputs:[{kind:"choice",key:"x",options:q.options.map(x=>[x,x])}],
      check:v=>v.x===q.answer
    };
  }
  if(q.type==="tf"){
    return {
      prompt:q.prompt,
      inputs:[{kind:"choice",key:"x",options:[["yes","⭕ 正確"],["no","❌ 錯誤"]]}],
      check:v=>(v.x==="yes")===q.answer
    };
  }
  if(q.type==="reorder"){
    const shuffled=(q.items||q.answer).slice().sort(()=>Math.random()-.5);
    return {
      prompt:q.prompt,
      inputs:[{kind:"reorder",key:"x",items:shuffled}],
      check:v=>Array.isArray(v.x)&&v.x.join("")===q.answer.join("")
    };
  }
}

window.KA_PACK={
id:"g1_english_basic",title:"一年級英文 RPG",gradeLabel:"1年級",subjectLabel:"英文",unitLabel:"字母與基礎單字",
mobName:"字母史萊姆",mobIcon:"🔤",bossName:"ABC 魔王",bossIcon:"🧌",ticketCost:3,
generators:{
normal:()=>({label:"⚔️ 普攻",...qFromBank(BANK,["choice"])}),
magic:()=>({label:"✨ 魔法",...qFromBank(BANK,["choice"])}),
defense:()=>({label:"🛡️ 防禦",...qFromBank(BANK,["tf"])}),
ultimate:()=>({label:"🔥 必殺",...qFromBank(BANK,["reorder"])})
}};
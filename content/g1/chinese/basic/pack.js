const BANK = [{"type": "choice", "prompt": "「大」的相反詞是哪一個？", "answer": "小", "options": ["小", "多", "高"]}, {"type": "choice", "prompt": "「上」的相反詞是哪一個？", "answer": "下", "options": ["前", "下", "左"]}, {"type": "choice", "prompt": "「前」的相反詞是哪一個？", "answer": "後", "options": ["後", "上", "中"]}, {"type": "choice", "prompt": "「多」的相反詞是哪一個？", "answer": "少", "options": ["少", "高", "遠"]}, {"type": "choice", "prompt": "「快」的相反詞是哪一個？", "answer": "慢", "options": ["慢", "大", "紅"]}, {"type": "choice", "prompt": "「白」的相反詞是哪一個？", "answer": "黑", "options": ["黑", "藍", "黃"]}, {"type": "choice", "prompt": "哪一個是在學校裡常見的人？", "answer": "老師", "options": ["老師", "司機", "廚師"]}, {"type": "choice", "prompt": "哪一個是文具？", "answer": "鉛筆", "options": ["鉛筆", "香蕉", "雨鞋"]}, {"type": "choice", "prompt": "哪一個是水果？", "answer": "蘋果", "options": ["蘋果", "尺", "書包"]}, {"type": "choice", "prompt": "哪一個是動物？", "answer": "小狗", "options": ["小狗", "桌子", "帽子"]}, {"type": "choice", "prompt": "「小鳥在天空＿＿。」哪個詞最適合？", "answer": "飛", "options": ["飛", "喝", "睡"]}, {"type": "choice", "prompt": "「小魚在水裡＿＿。」哪個詞最適合？", "answer": "游", "options": ["游", "飛", "唱"]}, {"type": "choice", "prompt": "「學生在教室裡＿＿。」哪個詞最適合？", "answer": "上課", "options": ["上課", "游泳", "睡覺"]}, {"type": "choice", "prompt": "「口渴了要＿＿。」哪個詞最適合？", "answer": "喝水", "options": ["喝水", "穿鞋", "關燈"]}, {"type": "choice", "prompt": "「下雨了要帶＿＿。」哪個詞最適合？", "answer": "雨傘", "options": ["雨傘", "湯匙", "球"]}, {"type": "choice", "prompt": "「早上起床先＿＿。」哪個比較合適？", "answer": "刷牙", "options": ["刷牙", "放風箏", "游泳"]}, {"type": "choice", "prompt": "「妹妹正在看＿＿。」哪個詞最合適？", "answer": "書", "options": ["書", "風", "雨"]}, {"type": "choice", "prompt": "「爸爸開車去＿＿。」哪個最合適？", "answer": "上班", "options": ["上班", "睡覺", "游泳"]}, {"type": "choice", "prompt": "「晚上要＿＿。」哪個最合適？", "answer": "睡覺", "options": ["睡覺", "上學", "吃午餐"]}, {"type": "choice", "prompt": "哪一個詞和「海邊」最有關？", "answer": "沙灘", "options": ["沙灘", "黑板", "冰箱"]}, {"type": "tf", "prompt": "「小」和「大」意思相反。", "answer": true}, {"type": "tf", "prompt": "「上」和「下」意思相反。", "answer": true}, {"type": "tf", "prompt": "「老師」通常會在學校工作。", "answer": true}, {"type": "tf", "prompt": "「雨傘」是用來吃飯的。", "answer": false}, {"type": "tf", "prompt": "「書包」可以用來裝課本。", "answer": true}, {"type": "tf", "prompt": "「香蕉」是一種文具。", "answer": false}, {"type": "tf", "prompt": "「早上」是在「晚上」之後。", "answer": false}, {"type": "tf", "prompt": "「小鳥會飛」是一個合理的句子。", "answer": true}, {"type": "tf", "prompt": "「魚在天空游泳」是一個合理的句子。", "answer": false}, {"type": "tf", "prompt": "「我去學校上課」是一個合理的句子。", "answer": true}, {"type": "reorder", "prompt": "把詞排成正確句子", "answer": ["我", "去", "學校"], "items": ["學校", "我", "去"]}, {"type": "reorder", "prompt": "把詞排成正確句子", "answer": ["小狗", "在", "跑"], "items": ["跑", "小狗", "在"]}, {"type": "reorder", "prompt": "把詞排成正確句子", "answer": ["媽媽", "煮", "飯"], "items": ["飯", "媽媽", "煮"]}, {"type": "reorder", "prompt": "把詞排成正確句子", "answer": ["弟弟", "喝", "水"], "items": ["水", "弟弟", "喝"]}, {"type": "reorder", "prompt": "把詞排成正確句子", "answer": ["姐姐", "看", "書"], "items": ["書", "姐姐", "看"]}, {"type": "reorder", "prompt": "把詞排成正確句子", "answer": ["爸爸", "開", "車"], "items": ["車", "開", "爸爸"]}, {"type": "reorder", "prompt": "把詞排成正確句子", "answer": ["小鳥", "會", "飛"], "items": ["飛", "小鳥", "會"]}, {"type": "reorder", "prompt": "把詞排成正確句子", "answer": ["我", "愛", "家人"], "items": ["家人", "愛", "我"]}, {"type": "reorder", "prompt": "把詞排成正確句子", "answer": ["大家", "一起", "玩"], "items": ["玩", "一起", "大家"]}, {"type": "reorder", "prompt": "把詞排成正確句子", "answer": ["我們", "一起", "上課"], "items": ["上課", "我們", "一起"]}];

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
id:"g1_chinese_basic",title:"一年級國語 RPG",gradeLabel:"1年級",subjectLabel:"國語",unitLabel:"字詞與句子",
mobName:"字詞史萊姆",mobIcon:"📖",bossName:"語文魔王",bossIcon:"👺",ticketCost:3,
generators:{
normal:()=>({label:"⚔️ 普攻",...qFromBank(BANK,["choice"])}),
magic:()=>({label:"✨ 魔法",...qFromBank(BANK,["reorder","choice"])}),
defense:()=>({label:"🛡️ 防禦",...qFromBank(BANK,["tf"])}),
ultimate:()=>({label:"🔥 必殺",...qFromBank(BANK,["reorder","choice"])})
}};
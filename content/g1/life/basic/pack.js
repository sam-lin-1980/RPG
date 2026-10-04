const BANK = [{"type": "choice", "prompt": "下雨天出門最適合帶什麼？", "answer": "雨傘", "options": ["雨傘", "枕頭", "碗"]}, {"type": "choice", "prompt": "過馬路時應該先做什麼？", "answer": "看號誌與來車", "options": ["直接跑", "看號誌與來車", "閉上眼睛"]}, {"type": "choice", "prompt": "看到地板有水，怎麼做比較安全？", "answer": "告訴老師並小心避開", "options": ["在上面跑", "告訴老師並小心避開", "故意踩水"]}, {"type": "choice", "prompt": "吃東西前應該做什麼？", "answer": "洗手", "options": ["洗手", "跑步", "睡覺"]}, {"type": "choice", "prompt": "覺得口渴時最適合喝什麼？", "answer": "水", "options": ["水", "墨水", "洗碗精"]}, {"type": "choice", "prompt": "剪刀使用完後應該怎麼做？", "answer": "收好", "options": ["收好", "丟地上", "拿著跑"]}, {"type": "choice", "prompt": "看到插座附近有水，應該怎麼做？", "answer": "不要碰並告訴大人", "options": ["不要碰並告訴大人", "自己擦插座", "用手碰看看"]}, {"type": "choice", "prompt": "在走廊上最安全的方式是？", "answer": "慢慢走", "options": ["快跑", "慢慢走", "推同學"]}, {"type": "choice", "prompt": "牙齒要怎麼照顧？", "answer": "每天刷牙", "options": ["每天刷牙", "不刷牙", "只吃糖"]}, {"type": "choice", "prompt": "垃圾應該丟到哪裡？", "answer": "垃圾桶", "options": ["垃圾桶", "地上", "桌上"]}, {"type": "choice", "prompt": "天氣很熱，戶外活動後要記得補充什麼？", "answer": "水", "options": ["水", "糖果", "玩具"]}, {"type": "choice", "prompt": "洗手可以幫助保持身體怎樣？", "answer": "乾淨", "options": ["乾淨", "吵鬧", "冰冷"]}, {"type": "choice", "prompt": "紅燈亮時，行人應該怎麼做？", "answer": "停下", "options": ["停下", "快跑", "閉眼"]}, {"type": "choice", "prompt": "綠燈亮時，還要注意什麼？", "answer": "左右來車", "options": ["左右來車", "天空", "鞋帶顏色"]}, {"type": "choice", "prompt": "在教室裡聽到老師說話時，應該怎麼做？", "answer": "專心聽", "options": ["專心聽", "大聲聊天", "跑出去"]}, {"type": "tf", "prompt": "沒有車時，可以不看紅綠燈直接跑過馬路。", "answer": false}, {"type": "tf", "prompt": "用完剪刀後應該收好。", "answer": true}, {"type": "tf", "prompt": "下雨天在走廊奔跑很安全。", "answer": false}, {"type": "tf", "prompt": "吃東西前洗手是好習慣。", "answer": true}, {"type": "tf", "prompt": "看到陌生人給糖果，就應該跟他走。", "answer": false}, {"type": "tf", "prompt": "在樓梯上推同學是危險的。", "answer": true}, {"type": "tf", "prompt": "垃圾可以隨手丟在地上。", "answer": false}, {"type": "tf", "prompt": "生病不舒服時，可以告訴老師或家人。", "answer": true}, {"type": "tf", "prompt": "運動後適量喝水是好習慣。", "answer": true}, {"type": "tf", "prompt": "插座可以用濕手去碰。", "answer": false}, {"type": "choice", "prompt": "看到同學跌倒了，最適合怎麼做？", "answer": "關心同學並找老師幫忙", "options": ["取笑他", "關心同學並找老師幫忙", "跑走"]}, {"type": "choice", "prompt": "發現插座旁邊有水，應該怎麼做？", "answer": "不要碰並告訴大人", "options": ["用手擦", "不要碰並告訴大人", "繼續玩"]}, {"type": "choice", "prompt": "迷路時比較安全的做法是？", "answer": "找警察或服務人員", "options": ["亂跑", "找警察或服務人員", "跟陌生人走"]}, {"type": "choice", "prompt": "搭車時應該怎麼做？", "answer": "坐好並繫安全帶", "options": ["站在椅子上", "坐好並繫安全帶", "把手伸出窗外"]}, {"type": "choice", "prompt": "想借同學的東西時，應該先怎麼做？", "answer": "先詢問", "options": ["直接拿", "先詢問", "藏起來"]}];

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
id:"g1_life_basic",title:"一年級生活 RPG",gradeLabel:"1年級",subjectLabel:"生活",unitLabel:"生活常識與安全",
mobName:"生活史萊姆",mobIcon:"🌱",bossName:"安全魔王",bossIcon:"🐲",ticketCost:3,
generators:{
normal:()=>({label:"⚔️ 普攻",...qFromBank(BANK,["choice"])}),
magic:()=>({label:"✨ 魔法",...qFromBank(BANK,["choice"])}),
defense:()=>({label:"🛡️ 防禦",...qFromBank(BANK,["tf"])}),
ultimate:()=>({label:"🔥 必殺",...qFromBank(BANK,["choice"])})
}};
知識學院 RPG｜1～6年級完整模組框架 V1

這一版的重點
============
1. 一年級～六年級的標準科目入口全部預先建立。
2. 之後更新既有年級/科目，只需要替換對應資料夾。
3. 核心戰鬥引擎固定放在 core/，平常不需要動。
4. 每個科目資料夾都至少包含：
   - index.html
   - pack.js
5. 選擇型題目全部使用項目框，不使用下拉式。
6. 防禦成功會增加 MP。
7. 保留背景音樂與音效。

資料夾對照
==========
1年級
  數學: content/g1/math/addition10/
  國語: content/g1/chinese/basic/
  英文: content/g1/english/basic/
  生活: content/g1/life/basic/
2年級
  數學: content/g2/math/basic/
  國語: content/g2/chinese/basic/
  英文: content/g2/english/basic/
  生活: content/g2/life/basic/
3年級
  數學: content/g3/math/basic/
  國語: content/g3/chinese/basic/
  英文: content/g3/english/basic/
  自然: content/g3/science/basic/
  社會: content/g3/social/basic/
4年級
  數學: content/g4/math/basic/
  國語: content/g4/chinese/basic/
  英文: content/g4/english/basic/
  自然: content/g4/science/basic/
  社會: content/g4/social/basic/
5年級
  數學: content/g5/math/basic/
  國語: content/g5/chinese/basic/
  英文: content/g5/english/basic/
  自然: content/g5/science/basic/
  社會: content/g5/social/basic/
6年級
  數學: content/g6/math/basic/
  國語: content/g6/chinese/basic/
  英文: content/g6/english/basic/
  自然: content/g6/science/basic/
  社會: content/g6/social/basic/

最常用的更新方式
================
假設要更新四年級自然：
直接把新的資料夾內容覆蓋到：
content/g4/science/basic/

假設要更新六年級數學：
直接覆蓋：
content/g6/math/basic/

只要資料夾位置不變，首頁不需要改。

目前一年級內容
==============
一年級數學：沿用較完整的 10 以內加法版本
一年級國語：字詞與句子
一年級英文：字母與基礎單字
一年級生活：生活常識與安全

二～六年級
==========
目前都先放「可執行的預留題庫」。
之後你可以整包替換該科目資料夾，我也可以逐科幫你產生正式題庫。

正式版之後
==========
再接 Supabase Auth、角色、紙娃娃、排行榜、裝備、成就、跨科升級條件。


V2 新增：Supabase 正式架構
========================
根目錄新增：
config.js

共用資料庫模組：
core/database.js

Supabase SQL：
supabase/schema.sql

之後 Supabase 專案若更換，只需要修改根目錄 config.js，
不需要修改任何 g1～g6 科目資料夾。

目前遊戲進度仍暫時使用 localStorage；
正式登入與玩家資料同步將在下一階段接上。


V3 新增
=======
- 玩家 ID + 密碼登入
- 建立角色
- 登出
- Supabase session
- player_profiles 同步
- EXP / 金幣同步
- 年級+科目 Boss 入場券同步
- unit_progress 熟練度同步
- game_results 每次成績紀錄
- 主頁等級排行榜
- 主頁成就排行榜
- 遊戲頁未登入時會要求先登入

設定請看：
supabase/V3設定步驟.txt


V4 更新
=======
1. Boss 戰改成嚴格「1攻1防」：
   玩家攻擊一次 → Boss 回合防禦題一次 → 回到玩家攻擊。
   Boss 不再連續出現攻擊回合。

2. 一年級數學新增：
   content/g1/math/subtraction10/
   - 10 以內減法
   - 普攻
   - 魔法
   - 防禦
   - 必殺
   - Boss

3. 一年級數學目前有：
   - 10以內加法
   - 10以內減法


V5 更新
=======
- 國語「排句子」改為點選詞卡，不再手動輸入。
- 詞卡會隨機排列。
- 點下方詞卡可加入答案區。
- 點答案區詞卡可退回。
- 可按「清空重排」重新排列。
- 所有選擇式操作持續維持項目框，不使用下拉選單。


V6 更新
=======
- 除數學外，其他科目全面取消「文字輸入答案」。
- 國語：選項框 / 詞卡排序 / 是非題。
- 英文：字母選項 / 單字詞卡排序 / 是非題。
- 生活、自然、社會：項目框 / 是非題。
- 原因：避免學生意思答對，但因用字、空格、同義詞不同而被判錯。
- 數學仍保留數字輸入，因為數值答案可精確判定。


V7 更新
=======
V7 題庫擴充

本次新增固定題庫共 100 題：
- 一年級國語：40 題
- 一年級英文：30 題
- 一年級生活：30 題

一年級數學不計入這 100 題，因為加法/減法使用規則生成，
實際可產生大量不同數值題。

所有非數學題目均不使用自由文字輸入：
- 選項框
- 正確/錯誤
- 詞卡排序

總新增固定題數：100


V8 更新
=======
Boss 戰改成嚴格輪流制：

玩家攻擊一次
→ Boss 反擊一次（防禦題）
→ 玩家攻擊一次
→ Boss 反擊一次
→ 持續循環

不會再發生 Boss 連續攻擊兩次以上。


V8.1 修正
=========
修正數學防禦題的判斷錯誤：
以前為了產生錯誤答案會先 +/- 1 或 2，再限制到 0~10。
例如正確答案是 10，錯誤答案 11 被限制回 10，
畫面會顯示正確算式，但系統內部仍標記為「錯誤」。

現在錯誤選項會重新隨機產生，並保證與正確答案不同。
加法與減法都已修正。

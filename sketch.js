let bgImage; // 宣告一個變數來存放背景圖片
let bgScrollX = 0; // 背景捲動位置

let playerStandSheet; // 存放主角待機動畫的整張圖片
let playerStandFrames = []; // 存放主角待機動畫的每一格
let playerJumpSheet; // 存放主角跳躍動畫的整張圖片
let playerJumpFrames = []; // 存放主角跳躍動畫的每一格
let playerRunSheet; // 存放主角跑步動畫的整張圖片
let playerRunFrames = []; // 存放主角跑步動畫的每一格
let playerPunchSheet; // 存放主角攻擊動畫的整張圖片
let playerPunchFrames = []; // 存放主角攻擊動畫的每一格
let playerFallSheet; // 存放主角倒下動畫的整張圖片
let playerFallFrames = []; // 存放主角倒下動畫的每一格

// 敵人資源
let enemySheet;
let enemyFrames = [];
let enemyFallSheet; // 存放敵人倒下動畫的整張圖片
let enemyFallFrames = []; // 存放敵人倒下動畫的每一格
let enemy2Sheet; // 存放敵人二 (Big Guy) 動畫的整張圖片
let enemy2Frames = []; // 存放敵人二動畫的每一格
let enemy3Sheet; // 敵人三 (spgbob)
let enemy3Frames = [];
let enemy3FallSheet;
let enemy3FallFrames = [];
let guiderSheet; // 引路者 (panther)
let guiderFrames = [];
let guiderFallSheet;
let guiderFallFrames = [];

let gameState = 'start_screen'; // 遊戲狀態: 'start_screen', 'playing', 'quiz', 'player_fall', 'enemy_fall', 'feedback', 'dialogue', 'win', 'lose'
let playerX, playerY; // 主角的位置
let playerHP = 100; // 玩家生命值
const maxPlayerHP = 100;
let playerState = 'stand'; // 主角目前的狀態: 'stand', 'jump', 'run', 'punch'
let playerDirection = 'right'; // 主角面向的方向: 'left' 或 'right'
const playerSpeed = 5; // 主角的移動速度

let velocityY = 0; // Y軸上的速度
const gravity = 0.6; // 重力
const jumpStrength = -15; // 跳躍力道 (負數代表向上)
let groundY; // 當前地面的Y座標 (會動態改變)

let platforms = []; // 存放所有跑道平台的陣列
let currentPlatform = null; // 玩家目前所在的平台
let enemies = []; // 存放所有敵人的陣列
let activeEnemy = null; // 當前互動的敵人

let feedbackMessage = ''; // 用於顯示答題回饋
// --- 題庫系統 ---
let quizTable; // 存放從 CSV 載入的整個表格
let quizData = []; // 轉換為物件陣列的題庫
let scienceTable; // 科學生活題庫表格
let scienceQuizData = []; // 科學生活題庫陣列
let historyTable; // 歷史題庫表格
let historyQuizData = []; // 歷史題庫陣列
let blessingTable; // 存放祝福語的 CSV
let blessingData = []; // 存放祝福語的陣列
let activeQuiz = null;
let hintUsed = false; // 記錄是否已使用過提示
let userInput = ''; // 用於儲存玩家輸入的答案

let startPoint, endPoint; // 起點與終點的座標

let frameIndex = 0; // 目前顯示的動畫影格索引
let frameCounter = 0; // 動畫影格計數器
const animationSpeed = 8; // 動畫速度，數字越小越快 (每 8 幀更新一次)
const scaleFactor = 2; // 角色與敵人的放大倍率

// 待機動畫的尺寸資訊
const standFrameCount = 4;
const standFrameWidth = Math.floor(151 / standFrameCount); // 37
const standFrameHeight = 42;

// 跳躍動畫的尺寸資訊
const jumpFrameCount = 5;
const jumpFrameWidth = Math.floor(230 / jumpFrameCount); // 46
const jumpFrameHeight = 59;

// 跑步動畫的尺寸資訊
const runFrameCount = 4;
const runFrameWidth = Math.floor(195 / runFrameCount); // 48
const runFrameHeight = 39;

// 攻擊動畫的尺寸資訊
const punchFrameCount = 2;
const punchFrameWidth = Math.floor(117 / punchFrameCount); // 58.5
const punchFrameHeight = 41;

// 敵人動畫的尺寸資訊
const enemyFrameCount = 4;
const enemyFrameWidth = Math.floor(79 / enemyFrameCount); // 19
const enemyFrameHeight = 32;

// 主角倒下動畫的尺寸資訊
const playerFallFrameCount = 5;
const playerFallFrameWidth = Math.floor(260 / playerFallFrameCount); // 52
const playerFallFrameHeight = 41;

// 敵人倒下動畫的尺寸資訊
const enemyFallFrameCount = 3;
const enemyFallFrameWidth = Math.floor(82 / enemyFallFrameCount); // 27
const enemyFallFrameHeight = 29;

// 敵人二 (Big Guy) 動畫的尺寸資訊
const enemy2FrameCount = 4;
const enemy2FrameWidth = Math.floor(107 / enemy2FrameCount); // 26
const enemy2FrameHeight = 38;

// 敵人三 (spgbob) 動畫尺寸
const enemy3FrameCount = 3;
const enemy3FrameWidth = Math.floor(76 / enemy3FrameCount); // 25
const enemy3FrameHeight = 31;
const enemy3FallFrameCount = 5;
const enemy3FallFrameWidth = Math.floor(140 / enemy3FallFrameCount); // 28
const enemy3FallFrameHeight = 32;

// 引路者 (panther) 動畫尺寸
const guiderFrameCount = 3;
const guiderFrameWidth = Math.floor(208 / guiderFrameCount); // 69
const guiderFrameHeight = 23;
const guiderFallFrameCount = 4;
const guiderFallFrameWidth = Math.floor(215 / guiderFallFrameCount); // 53
const guiderFallFrameHeight = 35;


let gameOverTimer = 0;
let shakeTimer = 0; // 用於控制震動時間
let confettis = []; // 存放彩帶碎片的陣列

function preload() {
  // 載入 CSV 題庫檔案
  quizTable = loadTable('questions.csv', 'csv', 'header');
  // 載入新的題庫 CSV
  scienceTable = loadTable('science_questions.csv', 'csv', 'header');
  historyTable = loadTable('history_questions.csv', 'csv', 'header');
  // 載入祝福語 CSV
  blessingTable = loadTable('blessings.csv', 'csv', 'header');

  // 在 setup() 之前預先載入圖片
  bgImage = loadImage('background/0.png');
  playerStandSheet = loadImage('main/stand/standall.png');
  playerJumpSheet = loadImage('main/jump/jumpall.png');
  playerRunSheet = loadImage('main/run/runall.png');
  playerPunchSheet = loadImage('main/punch/punchall.png');
  playerFallSheet = loadImage('main/fall/fallall.png');
  enemySheet = loadImage('uman/stand/standall.png');
  enemyFallSheet = loadImage('uman/fall/fallall.png');
  enemy2Sheet = loadImage('bigguy/bigguyall.png');
  enemy3Sheet = loadImage('spgbob/stand/standall.png');
  enemy3FallSheet = loadImage('spgbob/hilang/hilangall.png');
  guiderSheet = loadImage('panther/stand/standall.png');
  guiderFallSheet = loadImage('panther/hilang/hilangall.png');

}

function setup() {
  // 建立一個與視窗大小相同的畫布
  createCanvas(windowWidth, windowHeight);

  // 使用 for 迴圈切割 sprite sheet，存入 playerStandFrames 陣列
  for (let i = 0; i < standFrameCount; i++) {
    let frame = playerStandSheet.get(i * standFrameWidth, 0, standFrameWidth, standFrameHeight);
    playerStandFrames.push(frame);
  }

  // 切割跳躍動畫的 sprite sheet
  for (let i = 0; i < jumpFrameCount; i++) {
    let frame = playerJumpSheet.get(i * jumpFrameWidth, 0, jumpFrameWidth, jumpFrameHeight);
    playerJumpFrames.push(frame);
  }

  // 切割跑步動畫的 sprite sheet
  for (let i = 0; i < runFrameCount; i++) {
    let frame = playerRunSheet.get(i * runFrameWidth, 0, runFrameWidth, runFrameHeight);
    playerRunFrames.push(frame);
  }

  // 切割攻擊動畫的 sprite sheet
  for (let i = 0; i < punchFrameCount; i++) {
    let frame = playerPunchSheet.get(i * punchFrameWidth, 0, punchFrameWidth, punchFrameHeight);
    playerPunchFrames.push(frame);
  }

  // 切割敵人動畫的 sprite sheet
  for (let i = 0; i < enemyFrameCount; i++) {
    let frame = enemySheet.get(i * enemyFrameWidth, 0, enemyFrameWidth, enemyFrameHeight);
    enemyFrames.push(frame);
  }

  // 切割主角倒下動畫
  for (let i = 0; i < playerFallFrameCount; i++) {
    let frame = playerFallSheet.get(i * playerFallFrameWidth, 0, playerFallFrameWidth, playerFallFrameHeight);
    playerFallFrames.push(frame);
  }

  // 切割敵人倒下動畫
  for (let i = 0; i < enemyFallFrameCount; i++) {
    let frame = enemyFallSheet.get(i * enemyFallFrameWidth, 0, enemyFallFrameWidth, enemyFallFrameHeight);
    enemyFallFrames.push(frame);
  }

  // 切割敵人二 (Big Guy) 動畫
  for (let i = 0; i < enemy2FrameCount; i++) {
    let frame = enemy2Sheet.get(i * enemy2FrameWidth, 0, enemy2FrameWidth, enemy2FrameHeight);
    enemy2Frames.push(frame);
  }

  // 切割敵人三 (spgbob) 動畫
  for (let i = 0; i < enemy3FrameCount; i++) {
    let frame = enemy3Sheet.get(i * enemy3FrameWidth, 0, enemy3FrameWidth, enemy3FrameHeight);
    enemy3Frames.push(frame);
  }
  for (let i = 0; i < enemy3FallFrameCount; i++) {
    let frame = enemy3FallSheet.get(i * enemy3FallFrameWidth, 0, enemy3FallFrameWidth, enemy3FallFrameHeight);
    enemy3FallFrames.push(frame);
  }

  // 切割引路者 (panther) 動畫
  for (let i = 0; i < guiderFrameCount; i++) {
    let frame = guiderSheet.get(i * guiderFrameWidth, 0, guiderFrameWidth, guiderFrameHeight);
    guiderFrames.push(frame);
  }
  for (let i = 0; i < guiderFallFrameCount; i++) {
    let frame = guiderFallSheet.get(i * guiderFallFrameWidth, 0, guiderFallFrameWidth, guiderFallFrameHeight);
    guiderFallFrames.push(frame);
  }

  // --- 解析 CSV 題庫 ---
  // 將從 CSV 載入的表格資料，轉換成我們習慣的物件陣列格式
  for (let row of quizTable.getRows()) {
    quizData.push({
      question: row.getString('題目'),
      options: ["A", "B", "C", "D"], // CSV中沒有選項，暫時用預設值
      answer: row.getString('答案'),
      correctFeedback: row.getString('答對回饋'),
      incorrectFeedback: row.getString('答錯回饋'),
      hint: row.getString('提示')
    });
  }

  // --- 解析科學生活題庫 CSV ---
  for (let row of scienceTable.getRows()) {
    scienceQuizData.push({
      question: row.getString('題目'),
      options: ["A", "B", "C", "D"],
      answer: row.getString('答案'),
      correctFeedback: row.getString('答對回饋'),
      incorrectFeedback: row.getString('答錯回饋'),
      hint: row.getString('提示')
    });
  }

  // --- 解析歷史題庫 CSV ---
  for (let row of historyTable.getRows()) {
    historyQuizData.push({
      question: row.getString('題目'),
      options: ["A", "B", "C", "D"],
      answer: row.getString('答案'),
      correctFeedback: row.getString('答對回饋'),
      incorrectFeedback: row.getString('答錯回饋'),
      hint: row.getString('提示')
    });
  }

  // --- 解析祝福語 CSV ---
  for (let row of blessingTable.getRows()) {
    blessingData.push(row.getString('祝福語'));
  }

  // --- 初始化所有跑道平台 ---
  // 平台的高度間隔
  const platformGapY = (height - 200) / 7;
  for (let i = 0; i < 8; i++) {
    let platformY = height - 100 - i * platformGapY;
    let platformWidth = random(width * 0.4, width * 0.6);
    let platformX;
    // 讓平台左右交錯出現
    if (i % 2 === 0) {
      platformX = random(0, width * 0.2); // 靠左
    } else {
      platformX = random(width * 0.4, width - platformWidth); // 靠右
    }
    platforms.push({ x: platformX, y: platformY, width: platformWidth });
  }

  // --- 設定起點與終點 ---
  // 起點是第一個跑道的最右側
  startPoint = { x: platforms[0].x + platforms[0].width - standFrameWidth * scaleFactor, y: platforms[0].y };
  // 終點初始為 null，直到所有挑戰完成才出現
  endPoint = null;

  // 設定主角的初始位置在起點
  playerX = startPoint.x;
  groundY = startPoint.y - standFrameHeight * scaleFactor;
  playerY = groundY;

  // --- 建立敵人 ---
  // 將敵人1放置在第二個跑道 (platforms[1]) 的中間
  if (platforms.length > 1) {
    const enemyPlatform = platforms[1];
    const enemyX = enemyPlatform.x + enemyPlatform.width / 2 - enemyFrameWidth / 2;
    const enemyY = enemyPlatform.y - enemyFrameHeight * scaleFactor;
    // 將敵人物件加入陣列，包含狀態和問題
    enemies.push({
      x: enemyX,
      initialX: enemyX, // 儲存初始位置以便重置
      y: enemyY,
      state: 'idle', // 'idle', 'falling', 'defeated'
      type: 'uman', // 敵人類型
      quiz: quizData[0], // 綁定第一個問題
      animIndex: 0
    });
  }

  // 將敵人2 (Big Guy) 放置在第三個跑道 (platforms[2]) 的中間
  if (platforms.length > 2 && scienceQuizData.length > 0) {
    const enemyPlatform = platforms[2];
    const enemyX = enemyPlatform.x + enemyPlatform.width / 2 - enemy2FrameWidth / 2;
    const enemyY = enemyPlatform.y - enemy2FrameHeight * scaleFactor;
    enemies.push({
      x: enemyX,
      initialX: enemyX,
      y: enemyY,
      state: 'idle',
      type: 'bigguy', // 敵人類型
      quiz: scienceQuizData[0], // 綁定科學題庫的第一題 (或是隨機 scienceQuizData[floor(random(scienceQuizData.length))])
      animIndex: 0
    });
  }

  // 將敵人3 (spgbob) 放置在第四個跑道 (platforms[3]) 的中間
  if (platforms.length > 3 && historyQuizData.length > 0) {
    const enemyPlatform = platforms[3];
    const enemyX = enemyPlatform.x + enemyPlatform.width / 2 - enemy3FrameWidth / 2;
    const enemyY = enemyPlatform.y - enemy3FrameHeight * scaleFactor;
    enemies.push({
      x: enemyX,
      initialX: enemyX,
      y: enemyY,
      state: 'idle',
      type: 'spgbob', // 敵人類型
      quiz: historyQuizData[0], // 綁定歷史題庫的第一題
      animIndex: 0
    });
  }

  // 將引路者 (panther) 放置在第七個跑道 (platforms[6]) 的中間
  if (platforms.length > 6) {
    const enemyPlatform = platforms[6];
    const enemyX = enemyPlatform.x + enemyPlatform.width / 2 - guiderFrameWidth / 2;
    const enemyY = enemyPlatform.y - guiderFrameHeight * scaleFactor;
    enemies.push({
      x: enemyX,
      initialX: enemyX,
      y: enemyY,
      state: 'idle',
      type: 'guider', // 引路者類型
      quiz: null, // 沒有問題
      animIndex: 0
    });
  }

  // --- 初始化彩帶 ---
  for (let i = 0; i < 100; i++) {
    confettis.push({
      x: random(width),
      y: random(-height, 0), // 從螢幕上方開始
      color: color(random(255), random(255), random(255)),
      speed: random(2, 6),
      w: random(5, 10),
      h: random(10, 20)
    });
  }
}

/**
 * 處理所有玩家輸入的函式
 */
function handleInput() {
  // 取得目前玩家腳下的平台
  currentPlatform = findCurrentPlatform();
  let minX = -Infinity;
  let maxX = Infinity;

  // 如果玩家在某個平台上，則設定移動邊界
  if (currentPlatform) {
    minX = currentPlatform.x;
    maxX = currentPlatform.x + currentPlatform.width - standFrameWidth * scaleFactor; // 減去角色寬度
  }

  // 左右移動 (空中也可以移動)
  if (keyIsDown(LEFT_ARROW) && playerX > minX) {
    playerX -= playerSpeed;
    playerDirection = 'left';
    if (playerState !== 'jump' && playerState !== 'punch' && playerState !== 'run') {
        playerState = 'run';
        frameIndex = 0; // 重置動畫
    }
  } else if (keyIsDown(RIGHT_ARROW) && playerX < maxX) {
    playerX += playerSpeed;
    playerDirection = 'right';
    if (playerState !== 'jump' && playerState !== 'punch' && playerState !== 'run') {
        playerState = 'run';
        frameIndex = 0; // 重置動畫
    }
  }
}

/*** 更新玩家狀態與物理效果的函式*/
function updatePlayerState() {
  const playerBottom = playerY + standFrameHeight * scaleFactor;
  let onAPlatform = false;

  // --- 物理與碰撞偵測 ---
  velocityY += gravity; // 套用重力
  playerY += velocityY; // 更新Y座標

  // 遍歷所有平台，檢查是否著陸
  for (const platform of platforms) {
    const playerCenter = playerX + (standFrameWidth * scaleFactor) / 2;
    // 檢查條件：
    // 1. 玩家正在下落 (velocityY > 0)
    // 2. 玩家的腳在平台上方一點點到平台下方一點點的範圍內 (著陸檢測)
    // 3. 玩家的水平位置在平台範圍內
    if (velocityY > 0 &&
        playerBottom >= platform.y && playerBottom <= platform.y + velocityY &&
        playerCenter > platform.x && playerCenter < platform.x + platform.width)
    {
      onAPlatform = true;
      groundY = platform.y - standFrameHeight * scaleFactor; // 更新當前地面高度
      playerY = groundY; // 將玩家位置對齊到平台上
      velocityY = 0;

      // 如果是從跳躍或攻擊狀態落地
      if (playerState === 'jump' || playerState === 'punch') {
        // 檢查是否還按著方向鍵，是則跑步，否則站立
        playerState = (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) ? 'run' : 'stand';
        frameIndex = 0; // 重置動畫索引
      }
      break; // 找到平台就停止檢查
    }
  }

  // 如果玩家掉出螢幕底部，觸發失敗
  if (playerY > height && gameState !== 'lose') {
      // 避免重複觸發
      gameState = 'lose';
      gameOverTimer = millis();
  }

  // --- 碰撞檢測 (玩家 vs 敵人) ---
  if (gameState === 'playing') {
    for (const enemy of enemies) {
      if (enemy.state === 'idle') {
        // 根據敵人類型決定碰撞尺寸
        let enemyWidth, enemyHeight, scaledEnemyWidth, scaledEnemyHeight;
        switch (enemy.type) {
          case 'bigguy':
            enemyWidth = enemy2FrameWidth;
            enemyHeight = enemy2FrameHeight;
            break;
          case 'spgbob':
            enemyWidth = enemy3FrameWidth;
            enemyHeight = enemy3FrameHeight;
            break;
          case 'guider':
            enemyWidth = guiderFrameWidth;
            enemyHeight = guiderFrameHeight;
            break;
          default: // 'uman'
            enemyWidth = enemyFrameWidth;
            enemyHeight = enemyFrameHeight;
            break;
        }
        scaledEnemyWidth = enemyWidth * scaleFactor;
        scaledEnemyHeight = enemyHeight * scaleFactor;

        // 簡單的矩形碰撞檢測
        if (playerX < enemy.x + scaledEnemyWidth &&
            playerX + standFrameWidth * scaleFactor > enemy.x &&
            playerY < enemy.y + scaledEnemyHeight &&
            playerY + standFrameHeight * scaleFactor > enemy.y) {
          triggerQuiz(enemy);
        }
      }
    }

    // --- 檢查勝利條件 ---
    const playerCenter = playerX + (standFrameWidth * scaleFactor) / 2;
    const playerBottom = playerY + standFrameHeight * scaleFactor;
    // 檢查是否在終點平台附近
    if (endPoint && Math.abs(playerBottom - endPoint.y) < 10 && playerCenter > endPoint.x) {
        gameState = 'win';
        gameOverTimer = millis(); // 使用同一個計時器
    }
  }
}

/**
 * 繪製所有元素的函式
 */
function drawElements() {
  // 繪製平鋪的背景
  if (bgImage) { // 確保圖片已成功載入
    // 更新捲動位置
    bgScrollX -= 0.5;
    if (bgScrollX <= -bgImage.width) {
      bgScrollX = 0;
    }

    push(); // 儲存目前的繪圖設定
    tint(255, 100); // 設定透明度讓背景變淡 (數值越小越淡，範圍 0-255)
    for (let x = bgScrollX; x < width; x += bgImage.width) {
      for (let y = 0; y < height; y += bgImage.height) {
        image(bgImage, x, y, bgImage.width, bgImage.height);
      }
    }
    pop(); // 恢復原本的繪圖設定 (取消透明度影響後續繪圖)
  }

  // --- 程式化繪製美化後的跑道 ---
  for (const p of platforms) {
    push();
    noStroke();
    const platformThickness = 12; // 平台厚度

    // 繪製平台側面的深色部分 (立體感)
    fill(160, 115, 80); // 深土黃色
    rect(p.x - 2, p.y + 2, p.width + 4, platformThickness);

    // 繪製平台頂部的淺色部分
    fill(222, 184, 135); // 淺土黃色 (BurlyWood)
    rect(p.x, p.y, p.width, platformThickness);
    pop();
  }

  // --- 美化並繪製起點與終點標籤 ---
  push(); // 儲存目前的文字樣式
  textSize(32);
  textAlign(CENTER, CENTER);
  stroke(0); // 黑色輪廓
  strokeWeight(4); // 輪廓寬度
  fill(255, 220, 0); // 亮黃色填充

  text('起點', startPoint.x, startPoint.y - 50);
  if (endPoint) {
    text('終點', endPoint.x, endPoint.y - 50);
  }
  pop(); // 恢復原本的文字樣式

  // --- 繪製操作指示板 ---
  drawInstructionPanel();

  // --- 繪製生命條 ---
  drawHealthBar();

  // --- 繪製敵人 ---
  for (const enemy of enemies) {
    if (enemy.state === 'idle') {
      // 根據敵人類型播放不同待機動畫
      let animFrames, animIndex;
      switch (enemy.type) {
        case 'bigguy':
          animFrames = enemy2Frames;
          break;
        case 'spgbob':
          animFrames = enemy3Frames;
          break;
        case 'guider':
          animFrames = guiderFrames;
          break;
        default: // 'uman'
          animFrames = enemyFrames;
          break;
      }
      animIndex = floor(frameCount / animationSpeed) % animFrames.length;
      image(animFrames[animIndex], enemy.x, enemy.y, animFrames[animIndex].width * scaleFactor, animFrames[animIndex].height * scaleFactor);
    } else if (enemy.state === 'falling') {
      // 根據敵人類型播放不同倒下動畫
      let fallFrame;
      if (enemy.type === 'spgbob') fallFrame = enemy3FallFrames[enemy.animIndex];
      else if (enemy.type === 'guider') fallFrame = guiderFallFrames[enemy.animIndex];
      else fallFrame = enemyFallFrames[enemy.animIndex]; // 預設 'uman'
      image(fallFrame, enemy.x, enemy.y, fallFrame.width * scaleFactor, fallFrame.height * scaleFactor);
    }
    // 'defeated' 狀態的敵人不繪製
  }


  // ---------------------------------
  // 以下是繪製主角的部分
  // ---------------------------------
  
  // --- 繪製並更新主角動畫 ---
  let currentFrames;
  let currentFrameWidth;
  let currentFrameHeight;

  // 根據狀態選擇要播放的動畫
  switch (playerState) {
    case 'jump':
      currentFrames = playerJumpFrames;
      currentFrameWidth = jumpFrameWidth;
      currentFrameHeight = jumpFrameHeight;
      break;
    case 'run':
      currentFrames = playerRunFrames;
      currentFrameWidth = runFrameWidth;
      currentFrameHeight = runFrameHeight;
      break;
    case 'punch':
      currentFrames = playerPunchFrames;
      currentFrameWidth = punchFrameWidth;
      currentFrameHeight = punchFrameHeight;
      break;
    case 'fall':
      currentFrames = playerFallFrames;
      currentFrameWidth = playerFallFrameWidth;
      currentFrameHeight = playerFallFrameHeight;
      break;
    default: // 'stand'
      currentFrames = playerStandFrames;
      currentFrameWidth = standFrameWidth;
      currentFrameHeight = standFrameHeight;
      break;
  }

  // 根據方向翻轉圖片
  push(); // 儲存目前的繪圖狀態
  if (playerDirection === 'left') {
    scale(-1, 1); // 水平翻轉畫布
    // 翻轉後，繪圖座標也需跟著調整
    image(currentFrames[frameIndex], -playerX - currentFrameWidth * scaleFactor, playerY, currentFrameWidth * scaleFactor, currentFrameHeight * scaleFactor);
  } else { // 'right'
    image(currentFrames[frameIndex], playerX, playerY, currentFrameWidth * scaleFactor, currentFrameHeight * scaleFactor);
  }
  pop(); // 恢復原本的繪圖狀態

  // 更新動畫計數器
  frameCounter++;
  if (frameCounter >= animationSpeed) {
    frameCounter = 0;
    // 切換到下一個影格，如果到底了就從頭開始
    frameIndex = (frameIndex + 1) % currentFrames.length;

    // 如果跳躍動畫播放完畢但還在空中，則停在最後一幀
    if (playerState === 'jump' && frameIndex === 0 && velocityY !== 0) {
      frameIndex = currentFrames.length - 1;
    }

    // 如果攻擊動畫播放完畢
    if (playerState === 'punch' && frameIndex === 0) {
      // 如果在空中，維持跳躍狀態
      if (velocityY !== 0) {
        playerState = 'jump';
        frameIndex = playerJumpFrames.length - 1; // 跳到跳躍的最高點/下落幀
      } else { // 如果在地面
        // 檢查是否按著方向鍵，是則跑步，否則站立
        playerState = keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) ? 'run' : 'stand';
        frameIndex = 0; // 重置動畫
      }
    }

    // 如果玩家倒下動畫播放完畢
    if (playerState === 'fall' && frameIndex === 0) {
      // 倒下動畫播放完畢，恢復站立狀態，遊戲繼續
      playerState = 'stand';
      gameState = 'playing';
    }
  }
  
  // 將敵人動畫更新獨立出來，避免被玩家動畫狀態影響
  if (gameState === 'enemy_fall' && activeEnemy) {
    // 使用一個較慢的計數器來播放一次性動畫
    if (frameCount % animationSpeed === 0) {

    // 如果敵人倒下動畫播放完畢
    if (gameState === 'enemy_fall' && activeEnemy) {
      // 根據類型選擇正確的倒下動畫幀數
      let fallFrames;
      switch (activeEnemy.type) {
        case 'spgbob':
          fallFrames = enemy3FallFrames;
          break;
        case 'guider':
          fallFrames = guiderFallFrames;
          break;
        default: // 'uman'
          fallFrames = enemyFallFrames;
          break;
      }

      activeEnemy.animIndex++;
      if (activeEnemy.animIndex >= fallFrames.length) {
          activeEnemy.state = 'defeated'; // 標記為已擊敗
          gameState = 'playing'; // 遊戲繼續
          activeEnemy = null;
          checkLevelCompletion(); // 檢查是否所有敵人都已擊敗
      }
    }
    }
  }
}

function draw() {
  background(0); // 先畫一個黑色背景，避免啟動時閃爍
  // 根據遊戲狀態決定執行哪些更新和繪圖
  if (gameState === 'start_screen') {
    drawStartScreen();
  } else if (gameState === 'playing') {
    handleInput();
    updatePlayerState();
    updateGame(); // 持續檢查HP等遊戲狀態
    drawElements();
  } else if (gameState === 'shaking') {
    // 震動畫面效果
    push();
    translate(random(-8, 8), random(-8, 8)); // 隨機位移產生震動
    drawElements();
    pop();

    // 1.5秒後進入問答或對話
    if (millis() - shakeTimer > 1500) {
      if (activeEnemy.type === 'guider') {
        gameState = 'dialogue';
        feedbackMessage = random(blessingData) + "\n\n快去終點通關吧！";
      } else {
        gameState = 'quiz';
        activeQuiz = activeEnemy.quiz;
      }
    }
  } else if (gameState === 'quiz') {
    drawElements(); // 保持背景和角色靜止
    drawQuiz(); // 繪製問題對話框
  } else if (gameState === 'player_fall' || gameState === 'enemy_fall') {
    updatePlayerState(); // 允許重力等物理效果
    drawElements();
  } else if (gameState === 'feedback') {
    drawElements(); // 保持背景和角色靜止
    drawFeedback(); // 繪製回饋訊息
  } else if (gameState === 'dialogue') {
    drawElements(); // 保持背景和角色靜止
    drawDialogue(); // 繪製對話框
  } else if (gameState === 'win') {
    drawWinScreen();
    if (millis() - gameOverTimer > 4000) {
      restartGame();
    }
  } else if (gameState === 'lose') {
    drawLoseScreen();
    if (millis() - gameOverTimer > 4000) {
      restartGame();
    }
  }
}

function restartGame() {
  playerHP = maxPlayerHP;
  groundY = startPoint.y - standFrameHeight * scaleFactor; // 重設地面高度
  playerX = startPoint.x;
  playerY = groundY;
  velocityY = 0; // 修正：重置垂直速度，避免重生時直接掉落
  endPoint = null; // 重置終點
  enemies.forEach(e => {
    e.state = 'idle'; // 重置所有敵人狀態
    e.x = e.initialX; // 重置位置
    e.animIndex = 0;
  });
  activeEnemy = null;
  activeQuiz = null;
  hintUsed = false;
  userInput = '';
  gameState = 'start_screen'; // 修正：回到開始畫面，讓玩家重新點擊開始
  playerState = 'stand';
}

function keyPressed() {
  if (gameState === 'playing') {
    // 當按下上方向鍵且角色在地面上時，執行跳躍
    if (keyCode === UP_ARROW && velocityY === 0) { // 只有在Y速度為0時 (在地面上) 才能跳
      playerState = 'jump';
      velocityY = jumpStrength;
      frameIndex = 0; // 從跳躍動畫的第一幀開始
    } else if (key === ' ' && playerState !== 'punch') {
      // 當按下空白鍵且不在攻擊時，執行攻擊
      playerState = 'punch';
      frameIndex = 0; // 從攻擊動畫的第一幀開始
    } else if (keyCode === DOWN_ARROW && velocityY === 0) {
      // 當按下下方向鍵且在平台上時，向下穿過平台
      playerY += 5; // 稍微向下移動一點，以脫離當前平台的碰撞檢測
      playerState = 'jump'; // 設置為跳躍/下落狀態，讓重力接管
      frameIndex = 0;
    }
  } else if (gameState === 'feedback') {
    if (keyCode === ENTER) {
      continueAfterFeedback();
    }
  } else if (gameState === 'dialogue') {
    if (keyCode === ENTER) {
      continueAfterDialogue();
    }
  } else if (gameState === 'quiz') {
    // 在答題狀態下，監聽選項
    if (keyCode === ENTER) {
      checkAnswer(userInput);
      userInput = ''; // 提交後清空
    } else if (keyCode === BACKSPACE) {
      userInput = userInput.slice(0, -1); // 處理退格
    } else if (key.length === 1 && !isNaN(parseInt(key))) {
      // 只允許輸入數字
      userInput += key;
    }
  }
}

function keyReleased() {
  // 當放開左右方向鍵，且角色正在跑步時，改回站立狀態
  // 這樣可以避免在跳躍落地時，如果剛好放開按鍵，狀態被錯誤地設為 stand
  if (gameState === 'playing' && (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) && playerState === 'run') {
    playerState = 'stand';
    frameIndex = 0; // 重置動畫，從站立第一幀開始
  }
  return false; // 防止瀏覽器預設行為
}

/**
 * 尋找玩家目前所在的平台
 * @returns {object|null} 返回平台物件或 null
 */
function findCurrentPlatform() {
  const playerBottom = playerY + standFrameHeight * scaleFactor;
  const playerCenter = playerX + (standFrameWidth * scaleFactor) / 2;
  for (const platform of platforms) {
    // 檢查玩家是否在某個平台的Y座標上，且水平位置也符合
    if (Math.abs(playerBottom - platform.y) < 5 && playerCenter > platform.x && playerCenter < platform.x + platform.width) {
      return platform;
    }
  }
  return null; // 不在任何平台上
}

/**
 * 繪製左上角的操作指示板
 */
function drawInstructionPanel() {
  push(); // 獨立繪圖狀態

  const panelX = 20;
  const panelY = 20;
  const panelWidth = 260; // 加寬
  const panelHeight = 180; // 加高，確保文字不超出

  // 繪製半透明背景
  fill(0, 0, 0, 150); // 黑色，約60%透明度
  noStroke();
  rect(panelX, panelY, panelWidth, panelHeight, 10); // 圓角矩形

  // 繪製文字
  fill(255); // 白色文字
  textSize(16);
  textAlign(LEFT, TOP);
  text("操作指南：\n\n← → : 移動\n↑ : 跳躍\n↓ : 向下穿過平台\n空白鍵 : 攻擊", panelX + 15, panelY + 15);

  pop(); // 恢復繪圖狀態
}

/**
 * 繪製玩家生命條
 */
function drawHealthBar() {
  push();
  const barX = 20;
  const barY = 150;
  const barWidth = 220;
  const barHeight = 40;

  // 繪製背景框
  fill(0, 0, 0, 150);
  noStroke();
  rect(barX, barY, barWidth, barHeight, 10);

  // 繪製文字
  fill(255);
  textSize(16);
  textAlign(LEFT, CENTER);
  text("Player", barX + 15, barY + barHeight / 2);

  // 繪製血條
  const hpBarWidth = map(playerHP, 0, maxPlayerHP, 0, barWidth - 85);
  fill(150); // 血條底色
  rect(barX + 75, barY + 10, barWidth - 85, barHeight - 20);
  fill(0, 255, 0); // 綠色血
  rect(barX + 75, barY + 10, hpBarWidth, barHeight - 20);

  pop();
}

/**
 * 觸發問答
 * @param {object} enemy - 被觸碰的敵人
 */
function triggerQuiz(enemy) {
  activeEnemy = enemy;
  gameState = 'shaking'; // 進入震動狀態
  hintUsed = false; // 重置提示使用狀態
  shakeTimer = millis(); // 開始計時
}

/**
 * 繪製問答對話框
 */
function drawQuiz() {
  push();
  const boxWidth = width * 0.6;
  const boxHeight = height * 0.5;
  const boxX = width / 2 - boxWidth / 2;
  const boxY = height / 2 - boxHeight / 2;

  // 繪製半透明背景
  fill(0, 0, 50, 220);
  stroke(255, 220, 0);
  strokeWeight(3);
  rect(boxX, boxY, boxWidth, boxHeight, 20);

  // 繪製問題和選項
  fill(255);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text(activeQuiz.question, width / 2, boxY + 40);

  textAlign(LEFT, TOP);
  textSize(20);
  // 因為 CSV 沒有選項，我們直接提示玩家輸入答案
  text("請直接輸入數字答案後按下 Enter\n\n你的答案：" + userInput, boxX + 50, boxY + 120);

  pop();
}

/**
 * 檢查答案
 * @param {string} input - 玩家輸入的答案
 */
function checkAnswer(input) {
  const isCorrect = (input === activeQuiz.answer);

  if (isCorrect) {
    // --- 答對了 ---
    feedbackMessage = "答對了！\n\n" + activeQuiz.correctFeedback;
    
    if (activeEnemy.type === 'bigguy') {
      activeEnemy.state = 'defeated';
      gameState = 'playing';
      checkLevelCompletion();
    } else {
      activeEnemy.state = 'falling';
      activeEnemy.animIndex = 0;
      gameState = 'enemy_fall';
    }
    activeQuiz = null; // 清除當前問題
    userInput = '';
  } else {
    // --- 答錯了 ---
    if (!hintUsed) {
      // 第一次答錯：給予提示
      hintUsed = true;
      feedbackMessage = "答錯了！\n\n提示：" + activeQuiz.hint + "\n\n(按下 Enter 再試一次)";
      gameState = 'feedback'; // 進入回饋畫面顯示提示
      userInput = ''; // 清空輸入讓玩家重試
    } else {
      // 第二次答錯：執行懲罰
      feedbackMessage = "答錯了...\n\n" + activeQuiz.incorrectFeedback;
      playerHP -= 25;
      gameState = 'player_fall';
      playerState = 'fall';
      frameIndex = 0;
      activeQuiz = null; // 清除當前問題
      userInput = '';
    }
  }
}

/**
 * 繪製答題後的回饋訊息
 */
function drawFeedback() {
  push();
  const boxWidth = width * 0.6;
  const boxHeight = height * 0.5;
  const boxX = width / 2 - boxWidth / 2;
  const boxY = height / 2 - boxHeight / 2;

  fill(0, 0, 50, 220);
  stroke(255, 220, 0);
  strokeWeight(3);
  rect(boxX, boxY, boxWidth, boxHeight, 20);

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  text(feedbackMessage, width / 2, height / 2 - 20);
  textSize(18);
  text("\n\n(按下 Enter 繼續)", width / 2, height / 2 + 40);
  pop();
}

/**
 * 繪製引路者對話框
 */
function drawDialogue() {
  push();
  const boxWidth = width * 0.6;
  const boxHeight = height * 0.5;
  const boxX = width / 2 - boxWidth / 2;
  const boxY = height / 2 - boxHeight / 2;

  fill(20, 80, 20, 220); // 綠色調
  stroke(180, 255, 180);
  strokeWeight(3);
  rect(boxX, boxY, boxWidth, boxHeight, 20);

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  text(feedbackMessage, width / 2, height / 2 - 20);
  textSize(18);
  text("\n\n(按下 Enter 繼續)", width / 2, height / 2 + 40);
  pop();
}

function continueAfterDialogue() {
  // 引路者直接消失，遊戲繼續
  if (activeEnemy && activeEnemy.type === 'guider') {
    activeEnemy.state = 'defeated';
    activeEnemy = null;
  }
  gameState = 'playing';
  checkLevelCompletion(); // 檢查是否所有敵人都已擊敗
}

function continueAfterFeedback() {
  // 如果 activeQuiz 還存在，代表剛剛顯示的是提示，需要回到問答
  if (activeQuiz) {
    gameState = 'quiz';
  } else {
    // 否則回到遊戲
    gameState = 'playing';
    if (playerState === 'fall') {
        playerState = 'stand';
    }
  }
}

/**
 * 檢查是否所有敵人都已被擊敗，如果是，則生成終點
 */
function checkLevelCompletion() {
  const allDefeated = enemies.every(e => e.state === 'defeated');
  if (allDefeated && !endPoint) {
    // 設定終點在最後一個走道 (platforms 陣列的最後一個元素)
    const lastPlatform = platforms[platforms.length - 1];
    endPoint = {
      x: lastPlatform.x + lastPlatform.width - standFrameWidth * scaleFactor,
      y: lastPlatform.y
    };
    gameState = 'feedback';
    feedbackMessage = "恭喜！所有挑戰已完成！\n\n出口已在最後一個走道出現！";
  }
}

/**
 * 遊戲主迴圈中的狀態更新
 */
function updateGame() {
  if (gameState === 'win' || gameState === 'lose') return; // 遊戲結束時不再檢查
  // 檢查玩家生命值
  if (playerHP <= 0 && gameState !== 'lose') {
    gameState = 'lose';
    gameOverTimer = millis();
  }
}

/**
 * 繪製通關畫面
 */
function drawWinScreen() {
  background(0, 150); // 半透明黑色背景
  fill(255, 215, 0); // 金色
  textSize(80);
  textAlign(CENTER, CENTER);
  text("恭喜通關！", width / 2, height / 2);

  // 繪製彩帶特效
  for (let c of confettis) {
    fill(c.color);
    noStroke();
    rect(c.x, c.y, c.w, c.h);
    c.y += c.speed;
    // 如果彩帶掉出螢幕底部，讓它回到頂端繼續掉落
    if (c.y > height) c.y = random(-50, 0);
  }
}

/**
 * 繪製失敗畫面
 */
function drawLoseScreen() {
  background(0, 150); // 半透明黑色背景
  
  // 震動與故障特效
  let shakeX = random(-10, 10);
  let shakeY = random(-10, 10);

  textSize(100);
  textAlign(CENTER, CENTER);
  
  // 繪製多層偏移文字製造破碎/殘影感
  fill(255, 0, 0, 200); // 紅色殘影
  text("LOSE", width / 2 + shakeX + 5, height / 2 + shakeY + 5);
  fill(255); // 白色主體
  text("LOSE", width / 2 + shakeX, height / 2 + shakeY);
}

/**
 * 繪製開始畫面
 */
function drawStartScreen() {
  // 繪製背景
  if (bgImage) {
    // 更新捲動位置
    bgScrollX -= 0.5;
    if (bgScrollX <= -bgImage.width) {
      bgScrollX = 0;
    }

    push();
    tint(100); // 變暗
    for (let x = bgScrollX; x < width; x += bgImage.width) {
      for (let y = 0; y < height; y += bgImage.height) {
        image(bgImage, x, y, bgImage.width, bgImage.height);
      }
    }
    pop();
  }

  textAlign(CENTER, CENTER);
  
  // --- 標題特效 ---
  push();
  translate(width / 2, height / 2 - 100);
  // 讓標題有呼吸(縮放)和輕微搖擺的效果
  let scaleVal = 1 + 0.05 * sin(frameCount * 0.05);
  scale(scaleVal);
  rotate(sin(frameCount * 0.02) * 0.05);
  
  stroke(255);
  strokeWeight(5);
  fill(255, 215, 0); // 金色
  textSize(100); // 加大字體
  text("我是冒險家", 0, 0);
  pop();

  // --- 開始按鈕 (金幣風格) ---
  let btnX = width / 2 - 120;
  let btnY = height / 2 + 50;
  let btnW = 240;
  let btnH = 80;

  let isHover = (mouseX >= btnX && mouseX <= btnX + btnW && mouseY >= btnY && mouseY <= btnY + btnH);

  if (isHover) {
    fill(255, 223, 0); // 亮金色
    cursor(HAND);
    // 懸停時稍微放大
    btnX -= 5; btnY -= 2; btnW += 10; btnH += 4;
  } else {
    fill(218, 165, 32); // 暗金色
    cursor(ARROW);
  }
  
  stroke(255, 250, 200);
  strokeWeight(4);
  // 圓角矩形，看起來像金幣或金條
  rect(btnX, btnY, btnW, btnH, 40);

  fill(255);
  noStroke();
  textSize(40);
  text("開始遊戲", width / 2, btnY + btnH / 2);

  // --- 金幣粒子特效 ---
  // 在按鈕周圍繪製環繞的金色光點
  for(let i = 0; i < 8; i++) {
    let angle = frameCount * 0.05 + i * (TWO_PI / 8);
    let r = 160 + 10 * sin(frameCount * 0.1); // 半徑動態變化
    let px = width / 2 + cos(angle) * r;
    let py = (height / 2 + 90) + sin(angle) * 40; // 橢圓軌跡
    
    fill(255, 215, 0, 200);
    noStroke();
    circle(px, py, 10);
  }

  // --- 簡單好看的遊戲規則 ---
  push();
  let ruleY = btnY + btnH + 100; // 往下移一點，避免與按鈕重疊
  
  // 半透明背景框
  fill(0, 0, 0, 180);
  stroke(255, 215, 0, 150); // 淡金色邊框
  strokeWeight(2);
  rectMode(CENTER); // 讓矩形以中心點定位
  rect(width / 2, ruleY, 500, 140, 20);

  fill(255);
  noStroke();
  textSize(20);
  text("【 冒險指南 】\n\n← → 移動  |  ↑ 跳躍  |  ↓ 下穿平台\n空白鍵 : 攻擊敵人\n擊敗敵人並回答問題，尋找最終出口！", width / 2, ruleY);
  pop();
}

function mousePressed() {
  if (gameState === 'start_screen') {
    // 更新按鈕判定區域以符合新的尺寸
    let btnX = width / 2 - 120;
    let btnY = height / 2 + 50;
    let btnW = 240;
    let btnH = 80;
    
    if (mouseX >= btnX && mouseX <= btnX + btnW && mouseY >= btnY && mouseY <= btnY + btnH) {
      gameState = 'playing';
      cursor(ARROW);
    }
  }
}

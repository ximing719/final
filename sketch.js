let bgImage; // 宣告一個變數來存放背景圖片

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

let gameState = 'playing'; // 遊戲狀態: 'playing', 'quiz', 'player_fall', 'enemy_fall', 'feedback', 'dialogue', 'win', 'lose'
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
let blessingTable; // 存放祝福語的 CSV
let blessingData = []; // 存放祝福語的陣列
let activeQuiz = null;
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

function preload() {
  // 載入 CSV 題庫檔案
  quizTable = loadTable('questions.csv', 'csv', 'header');
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
  // 終點是第八個跑道的最右側
  endPoint = { x: platforms[7].x + platforms[7].width - standFrameWidth * scaleFactor, y: platforms[7].y };

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
  if (platforms.length > 2 && quizData.length > 1) {
    const enemyPlatform = platforms[2];
    const enemyX = enemyPlatform.x + enemyPlatform.width / 2 - enemy2FrameWidth / 2;
    const enemyY = enemyPlatform.y - enemy2FrameHeight * scaleFactor;
    enemies.push({
      x: enemyX,
      initialX: enemyX,
      y: enemyY,
      state: 'idle',
      type: 'bigguy', // 敵人類型
      quiz: quizData[1], // 綁定第二個問題
      animIndex: 0
    });
  }

  // 將敵人3 (spgbob) 放置在第四個跑道 (platforms[3]) 的中間
  if (platforms.length > 3 && quizData.length > 2) {
    const enemyPlatform = platforms[3];
    const enemyX = enemyPlatform.x + enemyPlatform.width / 2 - enemy3FrameWidth / 2;
    const enemyY = enemyPlatform.y - enemy3FrameHeight * scaleFactor;
    enemies.push({
      x: enemyX,
      initialX: enemyX,
      y: enemyY,
      state: 'idle',
      type: 'spgbob', // 敵人類型
      quiz: quizData[2], // 綁定第三個問題
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
    if (Math.abs(playerBottom - endPoint.y) < 10 && playerCenter > endPoint.x) {
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
    for (let x = 0; x < width; x += bgImage.width) {
      for (let y = 0; y < height; y += bgImage.height) {
        image(bgImage, x, y, bgImage.width, bgImage.height);
      }
    }
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
      }
    }
    }
  }
}

function draw() {
  background(0); // 先畫一個黑色背景，避免啟動時閃爍
  // 根據遊戲狀態決定執行哪些更新和繪圖
  if (gameState === 'playing') {
    handleInput();
    updatePlayerState();
    updateGame(); // 持續檢查HP等遊戲狀態
    drawElements();
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
  enemies.forEach(e => {
    e.state = 'idle'; // 重置所有敵人狀態
    e.x = e.initialX; // 重置位置
  });
  gameState = 'playing';
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
  const panelWidth = 220;
  const panelHeight = 120;

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
  if (enemy.type === 'guider') {
    // 如果是引路者，進入對話狀態
    gameState = 'dialogue';
    feedbackMessage = random(blessingData) + "\n\n快去終點通關吧！";
  } else {
    // 如果是敵人，進入問答狀態
    gameState = 'quiz';
    activeQuiz = enemy.quiz;
  }
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
    feedbackMessage = "答對了！\n\n" + activeQuiz.correctFeedback;
    // 答對了: 根據敵人類型決定行為
    if (activeEnemy.type === 'bigguy') {
      // 如果是 bigguy，直接標記為擊敗
      activeEnemy.state = 'defeated';
    } else {
      // 其他敵人播放倒下動畫
      gameState = 'enemy_fall';
      activeEnemy.state = 'falling';
      activeEnemy.animIndex = 0;
    }
  } else {
    feedbackMessage = "答錯了...\n\n" + activeQuiz.incorrectFeedback;
    // 答錯了: 扣血並進入玩家倒下狀態
    playerHP -= 25;
    gameState = 'player_fall';
    playerState = 'fall';
    frameIndex = 0;
  }
  
  if (isCorrect) {
    // 答對了
    if (activeEnemy.type === 'bigguy') {
      gameState = 'playing'; // bigguy 直接消失，繼續遊戲
    } else { // 其他敵人
      gameState = 'enemy_fall'; // 直接播放敵人倒下動畫，不顯示回饋
    }
  } else { // 答錯了
    // 答錯了，直接繼續遊戲，不顯示回饋
    gameState = 'playing';
  }
  
  activeQuiz = null; // 清除當前問題
  userInput = ''; // 清空輸入
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
}

function continueAfterFeedback() {
  // 答對問題的回饋結束後
  gameState = 'playing';
  if (playerState === 'fall') {
      playerState = 'stand';
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
}

/**
 * 繪製失敗畫面
 */
function drawLoseScreen() {
  background(0, 150); // 半透明黑色背景
  fill(255, 0, 0); // 紅色
  textSize(100);
  textAlign(CENTER, CENTER);
  text("LOSE", width / 2, height / 2);
}

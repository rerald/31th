// 화면 요소 참조
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const successScreen = document.getElementById('success-screen');
const failScreen = document.getElementById('fail-screen');
const couponScreen = document.getElementById('coupon-screen');

const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const retryBtn = document.getElementById('retry-btn');
const homeBtn = document.getElementById('home-btn');
const homeBtn2 = document.getElementById('home-btn2');
const saveCouponBtn = document.getElementById('save-coupon-btn');

const questionEl = document.getElementById('question');
const answerInput = document.getElementById('answer-input');
const comboEl = document.getElementById('combo');
const timerBar = document.getElementById('timer-bar');
const failImg = document.getElementById('fail-img');
const failImg2 = document.getElementById('fail-img2');

const successAudio = document.getElementById('success-audio');
const failAudio = document.getElementById('fail-audio');
const couponAudio = document.getElementById('coupon-audio');

let timer = null;
let timerTimeout = null;
let combo = 0;
let answer = 0;
let timeLimit = 5; // 5초

function showScreen(screen) {
  [startScreen, quizScreen, successScreen, failScreen, couponScreen].forEach(s => s.classList.add('hidden'));
  screen.classList.remove('hidden');
}

function randomQuestion() {
  const a = Math.floor(Math.random() * 41) + 10; // 10~50
  const b = Math.floor(Math.random() * 41) + 10;
  answer = a + b;
  questionEl.textContent = `${a} + ${b} = ?`;
}

function startQuiz() {
  combo = 0;
  comboEl.textContent = `연속 정답: 0/3`;
  showScreen(quizScreen);
  nextQuestion();
}

function nextQuestion() {
  randomQuestion();
  answerInput.value = '';
  answerInput.focus();
  comboEl.textContent = `연속 정답: ${combo}/3`;
  startTimer();
}

function startTimer() {
  clearTimeout(timerTimeout);
  timerBar.innerHTML = '<div class="bar"></div>';
  const bar = timerBar.querySelector('.bar');
  bar.style.width = '100%';
  setTimeout(() => {
    bar.style.transition = `width ${timeLimit}s linear`;
    bar.style.width = '0%';
  }, 10);
  timerTimeout = setTimeout(() => {
    handleFail();
  }, timeLimit * 1000);
}

function handleSubmit() {
  clearTimeout(timerTimeout);
  const userAns = Number(answerInput.value);
  if (userAns === answer) {
    combo++;
    if (combo >= 3) {
      setTimeout(() => {
        showCoupon();
      }, 500);
    } else {
      showSuccess();
    }
  } else {
    handleFail();
  }
}

function showSuccess() {
  showScreen(successScreen);
  successAudio.currentTime = 0;
  successAudio.play();
  setTimeout(() => {
    showScreen(quizScreen);
    nextQuestion();
  }, 1000);
}

function handleFail() {
  combo = 0;
  showScreen(failScreen);
  failAudio.currentTime = 0;
  failAudio.play();
  failImg2.classList.remove('hidden');
  failImg2.classList.add('fly');
  setTimeout(() => {
    failImg2.classList.remove('fly');
    failImg2.classList.add('hidden');
    showScreen(quizScreen);
    nextQuestion();
  }, 4000);
}

function showCoupon() {
  showScreen(couponScreen);
  couponAudio.currentTime = 0;
  couponAudio.play();
  drawCoupon();
}

function drawCoupon() {
  const canvas = document.getElementById('coupon-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fffbe7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 1.4rem "Do Hyeon", sans-serif';
  ctx.fillStyle = '#222';
  ctx.fillText('🥤 음료수 1잔 무료 쿠폰', 30, 60);
  ctx.font = '1rem "Do Hyeon", sans-serif';
  ctx.fillText('더하기 빨리 계산하기!', 60, 100);
  ctx.fillStyle = '#ff7f50';
  ctx.fillRect(20, 120, 260, 8);
}

function saveCoupon() {
  const canvas = document.getElementById('coupon-canvas');
  const link = document.createElement('a');
  link.download = 'coupon.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// 이벤트 바인딩
startBtn.onclick = startQuiz;
// submitBtn.onclick = handleSubmit;
retryBtn.onclick = startQuiz;
homeBtn.onclick = () => showScreen(startScreen);
homeBtn2.onclick = () => showScreen(startScreen);
saveCouponBtn.onclick = saveCoupon;

// 소프트 키패드 입력 처리
const keypad = document.getElementById('soft-keypad');
if (keypad) {
  keypad.addEventListener('click', function(e) {
    if (!e.target.classList.contains('keypad-btn')) return;
    const btn = e.target;
    if (btn.id === 'keypad-clear') {
      answerInput.value = answerInput.value.slice(0, -1);
    } else if (btn.id === 'keypad-enter') {
      handleSubmit();
    } else {
      if (answerInput.value.length < 3) { // 최대 3자리 제한
        answerInput.value += btn.textContent;
      }
    }
  });
}

// 최초 시작화면
showScreen(startScreen); 
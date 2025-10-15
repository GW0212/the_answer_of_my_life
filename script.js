const input = document.getElementById('question');
const askBtn = document.getElementById('askBtn');
const againBtn = document.getElementById('againBtn');
const answerEl = document.getElementById('answer');
const flipSound = document.getElementById('flipSound');
const soundToggle = document.getElementById('soundToggle');
const shakeToggle = document.getElementById('shakeToggle');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const card = document.getElementById('card');

const samples = ["오늘 고백할까?","이직 준비 시작할까?","지금 사도 될까?","내일 운동 갈까?","여행 떠날까?","회의에서 발표해도 될까?"];
const rand = (arr) => arr[Math.floor(Math.random()*arr.length)];

function drawAnswer(){
  if (shakeToggle && shakeToggle.checked) {
    card.classList.remove('shake');
    void card.offsetWidth; // restart animation
    card.classList.add('shake');
  }
  const q = input.value.trim();
  const ans = window.ANSWERS[Math.floor(Math.random()*window.ANSWERS.length)];
  answerEl.textContent = ans;
  if (soundToggle?.checked) { try { flipSound.currentTime=0; flipSound.play(); } catch(e){} }
  sessionStorage.setItem('lastQA', JSON.stringify({ q, a: ans, t: new Date().toISOString() }));
}

askBtn.addEventListener('click', drawAnswer);
againBtn.addEventListener('click', drawAnswer);
input.addEventListener('keydown', e => { if(e.key === 'Enter') drawAnswer(); });
shuffleBtn.addEventListener('click', () => { input.value = rand(samples); input.focus(); });

copyBtn.addEventListener('click', async () => {
  const data = JSON.parse(sessionStorage.getItem('lastQA') || '{}');
  const text = data.a ? `질문: ${data.q || '(미입력)'}\n해답: ${data.a}` : answerEl.textContent;
  try { await navigator.clipboard.writeText(text); copyBtn.textContent="복사됨!"; setTimeout(()=>copyBtn.textContent="복사",1200); } catch(e){ alert("복사 실패"); }
});

shareBtn.addEventListener('click', async () => {
  const data = JSON.parse(sessionStorage.getItem('lastQA') || '{}');
  const text = data.a ? `질문: ${data.q || '(미입력)'}\n해답: ${data.a}` : answerEl.textContent;
  try { if(navigator.share){ await navigator.share({ text, title:"내 인생의 해답" }); } else { await navigator.clipboard.writeText(text); alert("공유 API 미지원: 복사로 대체했습니다."); } } catch(e){}
});

input.focus();

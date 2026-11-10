'use strict';

const trees = [
  {id:'aspen',name:'Quaking Aspen',latin:'Populus tremuloides',type:'deciduous',tag:'Round leaves · pale bark',summary:'Look for smooth, pale greenish-white bark and nearly round leaves on flattened stems. Leaves flutter easily in the breeze.',clues:['Nearly round leaves with fine teeth along the edge','Flattened leaf stems make the leaves tremble in a breeze','Often grows in large clonal groves; pale bark has dark scars'],fact:'The flattened petiole (leaf stem) is a key clue: it lets the leaf twist and flutter in even a light breeze.',shape:'round'},
  {id:'gambel',name:'Gambel Oak',latin:'Quercus gambelii',type:'deciduous',tag:'Lobed leaves · acorns',summary:'A foothill favorite with deeply rounded leaf lobes. It often forms dense, multi-stemmed thickets and produces acorns.',clues:['Leaves have several rounded lobes','Produces acorns; leaves may turn rusty red or gold in fall','Common on Utah foothills and lower mountain slopes'],fact:'Gambel oak often resprouts from its roots, so a stand may be a connected thicket rather than many unrelated trees.',shape:'oak'},
  {id:'maple',name:'Bigtooth Maple',latin:'Acer grandidentatum',type:'deciduous',tag:'Opposite leaves · paired seeds',summary:'Recognize its broad, maple-shaped leaves with a few large teeth or lobes. Look for opposite leaf pairs and paired winged seeds.',clues:['Leaves grow opposite one another on the twig','Broad leaves have several large, pointed lobes','Paired winged seeds (samaras); brilliant fall color'],fact:'Opposite branching is a useful first clue. Maples produce paired winged fruits that spin as they fall.',shape:'maple'},
  {id:'cottonwood',name:'Fremont Cottonwood',latin:'Populus fremontii',type:'deciduous',tag:'Triangular leaves · waterways',summary:'A large riparian tree with broad, triangular leaves, coarse bark on older trunks, and cottony seeds in late spring.',clues:['Broad triangular or heart-shaped leaves with a flattened stem','Usually associated with rivers, streams, and floodplains','Mature trees have massive trunks and spreading crowns'],fact:'Habitat is especially helpful: Fremont cottonwood is strongly associated with riparian areas in the Southwest.',shape:'triangle'},
  {id:'juniper',name:'Utah Juniper',latin:'Juniperus osteosperma',type:'conifer',tag:'Scale-like foliage · blue cones',summary:'A rugged evergreen of dry country. Its tiny overlapping scale-like leaves, fibrous bark, and blue berry-like cones are distinctive.',clues:['Foliage is mostly tiny, overlapping scales, not long needles','Blue, berry-like seed cones','Common in dry pinyon-juniper woodlands'],fact:'The blue structures are fleshy seed cones, not true berries. Junipers are conifers, even though their cones look berry-like.',shape:'juniper'},
  {id:'pinyon',name:'Colorado Pinyon',latin:'Pinus edulis',type:'conifer',tag:'Two needles · stout cones',summary:'A compact pine with bundles of two short, stiff needles. Its rounded cones hold edible pine nuts.',clues:['Needles occur in bundles of two','Short, stout needles and a compact, rounded crown','Large, chunky cones; common with Utah juniper'],fact:'Count the needles in one bundle: Colorado pinyon has two. This is one of the quickest ways to separate it from singleleaf pinyon.',shape:'pine'},
  {id:'ponderosa',name:'Ponderosa Pine',latin:'Pinus ponderosa',type:'conifer',tag:'Long needles · puzzle bark',summary:'A tall pine with long needles in bundles of two or three and thick bark that can develop warm yellow-orange puzzle-like plates.',clues:['Long needles, commonly in bundles of two or three','Mature bark forms large, plate-like patches','Often grows in open, sunny mountain forests'],fact:'The orange-brown, puzzle-piece bark on mature trees is memorable, but needle bundles are a better close-up clue.',shape:'pine'},
  {id:'douglas',name:'Douglas-fir',latin:'Pseudotsuga menziesii',type:'conifer',tag:'Flat needles · hanging cones',summary:'A familiar mountain evergreen with soft, flat needles arranged around the twig. Its hanging cones have distinctive three-pointed bracts.',clues:['Single, flat needles attached individually around the twig','Cones hang down and have three-pointed bracts sticking out','Often found in cooler mountain forests'],fact:'Look for the three-pointed bracts protruding between cone scales. The name includes “fir,” but Douglas-fir is not a true fir.',shape:'fir'}
];

const grid = document.getElementById('tree-grid');
const quizQuestion = document.getElementById('question');
const clues = document.getElementById('clues');
const answers = document.getElementById('answers');
const feedback = document.getElementById('feedback');
const nextButton = document.getElementById('next-button');
const questionCount = document.getElementById('question-count');
const illustration = document.getElementById('quiz-illustration');
let filter = 'all';
let deck = [];
let index = 0;
let score = 0;
let answered = false;

// Store only the user's best completed-round score in this browser.
const HIGH_SCORE_KEY = 'treewise.highScore.v1';
const scoreCard = document.querySelector('.score-card');
const highScoreDisplay = document.createElement('span');
highScoreDisplay.id = 'high-score';
highScoreDisplay.className = 'high-score';
highScoreDisplay.setAttribute('aria-live', 'polite');
scoreCard.append(highScoreDisplay);

function readHighScore() {
  try {
    const saved = Number(localStorage.getItem(HIGH_SCORE_KEY));
    return Number.isInteger(saved) && saved >= 0 && saved <= trees.length ? saved : 0;
  } catch (error) {
    // Storage may be unavailable in private/restricted browsing contexts.
    return null;
  }
}

function displayHighScore() {
  const best = readHighScore();
  highScoreDisplay.textContent = best === null
    ? 'Personal best unavailable'
    : `Personal best: ${best} / ${trees.length}`;
}

function saveHighScore(finalScore) {
  const best = readHighScore();
  if (best === null) {
    displayHighScore();
    return;
  }

  if (finalScore > best) {
    try {
      localStorage.setItem(HIGH_SCORE_KEY, String(finalScore));
    } catch (error) {
      // The quiz remains usable even if the browser blocks local storage.
    }
  }
  displayHighScore();
}

function artSvg(shape, label='tree illustration') {
  const commonStart = `<svg viewBox="0 0 220 150" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><path d="M0 132 Q55 122 110 132 T220 132V150H0Z" fill="#d4dfcf"/>`;
  const trunk = `<path d="M105 137 L108 78 L119 78 L121 137Z" fill="#8d795c"/>`;
  let drawing = '';
  if (shape === 'round') drawing = `${trunk}<g fill="#6d9275"><circle cx="110" cy="54" r="38"/><circle cx="80" cy="70" r="25"/><circle cx="142" cy="73" r="26"/></g><path d="M110 29v85" stroke="#d8e2cc" stroke-width="2" opacity=".7"/>`;
  if (shape === 'oak') drawing = `${trunk}<g fill="#557b69"><circle cx="83" cy="65" r="27"/><circle cx="112" cy="44" r="31"/><circle cx="145" cy="65" r="28"/><circle cx="111" cy="80" r="30"/></g><g fill="#d5b46d"><ellipse cx="81" cy="91" rx="4" ry="7"/><ellipse cx="151" cy="93" rx="4" ry="7"/></g>`;
  if (shape === 'maple') drawing = `${trunk}<path d="M110 15 122 42 147 28 141 56 169 66 139 78 143 103 112 88 83 105 87 77 56 66 83 55 78 29 102 43Z" fill="#8ba477"/><path d="M110 22v100M110 65 78 40m32 25 32-27m-32 27-27 23m27-23 30 25" stroke="#d9e2cf" stroke-width="2" fill="none"/>`;
  if (shape === 'triangle') drawing = `${trunk}<path d="M110 18 70 61 86 61 55 92 85 92 65 115 155 115 135 92 165 92 134 61 150 61Z" fill="#6f987b"/><path d="M110 30 110 112" stroke="#dce5d3" stroke-width="2"/>`;
  if (shape === 'juniper') drawing = `${trunk}<g fill="#54775f"><path d="M112 15Q68 25 76 70Q42 90 78 112Q110 128 144 108Q179 89 148 65Q156 25 112 15Z"/><path d="M70 88Q110 49 151 91" fill="none" stroke="#9eb39a" stroke-width="5"/></g><g fill="#9b9c70"><circle cx="88" cy="75" r="3"/><circle cx="133" cy="91" r="3"/><circle cx="119" cy="46" r="3"/></g>`;
  if (shape === 'pine') drawing = `${trunk}<g fill="#557b69"><path d="M112 12 74 64h22L66 91h32L80 116h64l-18-25h32l-30-27h22Z"/><path d="M112 29 92 69h15l-24 28h27l-12 19h35l-12-19h24l-24-28h15Z" fill="#78977c"/></g>`;
  if (shape === 'fir') drawing = `${trunk}<g fill="#476f5a"><path d="M112 10 91 47h13L78 76h24L68 107h88l-34-31h24l-26-29h13Z"/><path d="M112 26 99 55h11L92 82h18l-19 25h43l-19-25h18l-18-27h11Z" fill="#78977c"/></g><g fill="#c7a46b"><path d="M112 72q-12 14-3 25h6q9-11-3-25Z"/><path d="M137 89q-10 12-2 21h5q8-9-3-21Z"/></g>`;
  return commonStart + drawing + `</svg>`;
}

function renderCards() {
  grid.replaceChildren();
  trees.filter(t => filter === 'all' || t.type === filter).forEach(t => {
    const card = document.createElement('article');
    card.className = 'tree-card';
    const art = document.createElement('div');
    art.className = 'tree-art';
    art.innerHTML = artSvg(t.shape, `Stylized illustration representing ${t.name}`);
    const type = document.createElement('span');
    type.className = 'tree-type';
    type.textContent = t.type === 'conifer' ? 'Evergreen' : 'Broadleaf';
    art.append(type);
    const info = document.createElement('div');
    info.className = 'tree-info';
    const title = document.createElement('h3'); title.textContent = t.name;
    const latin = document.createElement('p'); latin.className = 'latin'; latin.textContent = t.latin;
    const summary = document.createElement('p'); summary.textContent = t.summary;
    const tag = document.createElement('span'); tag.className = 'clue-label'; tag.textContent = t.tag;
    info.append(title, latin, summary, tag);
    card.append(art, info);
    grid.append(card);
  });
}

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach(b => {
      const active = b === button;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    renderCards();
  });
});

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function startQuiz() {
  deck = shuffle(trees);
  index = 0;
  score = 0;
  answered = false;
  updateScore();
  renderQuestion();
}
function updateScore() {
  document.getElementById('score').textContent = `${score} / ${index + (answered ? 1 : 0)}`;
  const total = index + (answered ? 1 : 0);
  document.getElementById('accuracy').textContent = total ? `${Math.round(score / total * 100)}% correct so far` : 'Keep going — you’ve got this.';
}
function renderQuestion() {
  const tree = deck[index];
  if (!tree) {
    quizQuestion.textContent = 'You completed the round!';
    clues.replaceChildren();
    answers.replaceChildren();
    illustration.innerHTML = artSvg('round', 'A tree illustration');
    questionCount.textContent = 'ROUND COMPLETE';
    feedback.hidden = false;
    feedback.className = 'feedback';
    feedback.textContent = `You scored ${score} out of ${deck.length}. Restart to practice again with a new order.`;
    saveHighScore(score);
    nextButton.disabled = true;
    nextButton.textContent = 'Round complete';
    updateScore();
    return;
  }
  answered = false;
  questionCount.textContent = `QUESTION ${index + 1} OF ${deck.length}`;
  quizQuestion.textContent = 'Identify this tree from its clues.';
  clues.replaceChildren();
  tree.clues.forEach(clue => { const li = document.createElement('li'); li.textContent = clue; clues.append(li); });
  illustration.innerHTML = artSvg(tree.shape, 'Stylized tree illustration');
  feedback.hidden = true;
  feedback.textContent = '';
  feedback.className = 'feedback';
  nextButton.disabled = true;
  nextButton.textContent = index === deck.length - 1 ? 'See results →' : 'Next question →';
  answers.replaceChildren();
  shuffle(trees).slice(0, 4).map(t => t.id === tree.id ? t : t).forEach(() => {});
  const options = shuffle([tree, ...shuffle(trees.filter(t => t.id !== tree.id)).slice(0, 3)]);
  options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'answer-button';
    button.type = 'button';
    button.textContent = option.name;
    button.addEventListener('click', () => chooseAnswer(button, option, tree));
    answers.append(button);
  });
  updateScore();
}
function chooseAnswer(button, chosen, correct) {
  if (answered) return;
  answered = true;
  const isCorrect = chosen.id === correct.id;
  if (isCorrect) score++;
  [...answers.children].forEach(b => {
    b.disabled = true;
    if (b.textContent === correct.name) b.classList.add('correct');
    else if (b === button) b.classList.add('incorrect');
  });
  feedback.hidden = false;
  feedback.className = `feedback${isCorrect ? '' : ' wrong'}`;
  feedback.textContent = `${isCorrect ? 'Correct!' : `Not quite — that was ${correct.name}.`} ${correct.fact}`;
  nextButton.disabled = false;
  updateScore();
}
nextButton.addEventListener('click', () => { if (answered) { index++; renderQuestion(); } });
document.getElementById('restart-button').addEventListener('click', startQuiz);

renderCards();
displayHighScore();
startQuiz();

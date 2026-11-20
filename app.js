const lessons = units.flatMap((unit, index) => unit.lessons.map((lesson, step) => ({
  ...lesson,
  unit,
  unitNumber: index + 1,
  step: step + 1,
})));
const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const storageKey = 'ps1-coding-course-v1';
const nav = document.querySelector('#lesson-nav');
const main = document.querySelector('#lesson');
const menu = document.querySelector('#lesson-menu');
const mobile = window.matchMedia('(max-width: 640px)');

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return {
      completed: new Set((Array.isArray(saved?.completed) ? saved.completed : []).filter((id) => lessonById.has(id))),
      current: lessonById.has(saved?.current) ? saved.current : null,
    };
  } catch {
    return { completed: new Set(), current: null };
  }
}

const progress = readProgress();

function saveProgress(id) {
  progress.current = id;
  try {
    localStorage.setItem(storageKey, JSON.stringify({ current: id, completed: [...progress.completed] }));
  } catch {
    // Keep progress available for this session when storage is unavailable.
  }
}

function escapeHtml(value) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}

function codeBlock(file, code, label, numbered = false) {
  const name = escapeHtml(label);
  const source = numbered
    ? code.split('\n').map((line) => `<span class="code-line">${escapeHtml(line)}</span>`).join('\n')
    : escapeHtml(code);
  return `<div class="code-block">
    <div class="code-bar"><span>${escapeHtml(file)}</span><button class="copy" type="button" aria-label="Copy ${name}">Copy</button></div>
    <pre tabindex="0" aria-label="${name}"><code>${source}</code></pre>
    <span class="visually-hidden" role="status"></span>
  </div>`;
}

function outputBlock(output, label) {
  return `<figure class="output">
    <figcaption>${escapeHtml(label)}</figcaption>
    <pre tabindex="0"><samp>${escapeHtml(output)}</samp></pre>
  </figure>`;
}

const setup = `<details class="setup">
  <summary>Set up your practice folder</summary>
  <ol>
    <li><a href="https://learn.microsoft.com/powershell/scripting/install/installing-powershell">Install PowerShell 7</a>, then type <code>pwsh</code> in your terminal. Run <code>$PSVersionTable.PSVersion</code> to check the version.</li>
    <li>In PowerShell, run <code>New-Item -ItemType Directory -Path ps1-practice</code> to create a folder in your current location, then run <code>Set-Location ps1-practice</code> to enter it. If the folder already exists, start with <code>Set-Location ps1-practice</code>.</li>
    <li>Use a plain-text editor to save <code>hello.ps1</code> in that folder. In Windows Notepad, select <strong>All files</strong> as the file type so it keeps the <code>.ps1</code> extension.</li>
    <li>If PowerShell reports that it has blocked script execution, see <a href="https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies">Microsoft’s execution policy guide</a> for your environment.</li>
  </ol>
</details>`;

function renderNavigation(currentId) {
  nav.innerHTML = units.map((unit, index) => {
    const active = unit.lessons.some((lesson) => lesson.id === currentId);
    const complete = unit.lessons.filter((lesson) => progress.completed.has(lesson.id)).length;
    return `<details class="unit" name="course-unit"${active ? ' open' : ''}>
      <summary>
        <span class="unit-title">Unit ${index + 1} · ${escapeHtml(unit.title)}</span>
        <span class="unit-meta">${complete} of ${unit.lessons.length} complete</span>
      </summary>
      <ol>${unit.lessons.map((lesson, step) => {
        const number = lesson.challenge ? '◇' : String(step + 1).padStart(2, '0');
        const done = progress.completed.has(lesson.id);
        return `<li><a href="#${lesson.id}"${lesson.id === currentId ? ' aria-current="page"' : ''}>
          <span class="lesson-number${done ? ' done' : ''}" aria-hidden="true">${done ? '✓' : number}</span>
          <span>${escapeHtml(lesson.title)}${done ? '<span class="visually-hidden"> (completed)</span>' : ''}</span>
        </a></li>`;
      }).join('')}</ol>
    </details>`;
  }).join('');

  const bar = document.querySelector('#progress');
  bar.max = lessons.length;
  bar.value = progress.completed.size;
  document.querySelector('#progress-label').textContent = `${progress.completed.size} of ${lessons.length} complete`;
}

function workedExampleGuide(lesson) {
  const { steps, trace, troubleshoot } = walkthroughs[lesson.id];
  const code = lesson.example.split('\n');
  return `<section class="walkthrough" aria-labelledby="walkthrough-title">
    <h3 id="walkthrough-title">Walk through the code</h3>
    <ol class="walkthrough-steps">${steps.map(([start, end, explanation]) => {
      const label = start === end ? `Line ${start}` : `Lines ${start}–${end}`;
      const excerpt = code.slice(start - 1, end).join('\n');
      return `<li class="walkthrough-step">
        <h4>${label}</h4>
        <pre><code>${escapeHtml(excerpt)}</code></pre>
        <p>${escapeHtml(explanation)}</p>
      </li>`;
    }).join('')}</ol>
    <div class="walkthrough-note">
      <h4>Follow the result</h4>
      <p>${escapeHtml(trace)}</p>
    </div>
    <div class="walkthrough-note">
      <h4>If you get stuck</h4>
      <p>${escapeHtml(troubleshoot)}</p>
    </div>
  </section>`;
}

function challengeGuide(id) {
  return `<section class="checkpoints" aria-labelledby="checkpoints-title">
    <h3 id="checkpoints-title">Build and check it in stages</h3>
    <ol>${challengeCheckpoints[id].map(([title, action, check]) => `<li>
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(action)}</p>
      <p class="checkpoint-check"><strong>Check</strong> · ${escapeHtml(check)}</p>
    </li>`).join('')}</ol>
  </section>`;
}

function practiceProblem(problem, index, lesson) {
  const heading = lesson.challenge ? problem.title : `${index + 1}. ${problem.title}`;
  const tag = lesson.challenge ? 'h2' : 'h3';
  return `<div class="practice">
    <${tag}>${escapeHtml(heading)}</${tag}>
    ${problem.review ? `<p class="practice-review"><strong>Skills used</strong> · ${escapeHtml(problem.review)}</p>` : ''}
    <p>${escapeHtml(problem.task)}</p>
    ${lesson.challenge ? challengeGuide(lesson.id) : ''}
    ${outputBlock(problem.expected, problem.expectedLabel ?? 'Expected output')}
    <details><summary>Show a hint</summary><p>${escapeHtml(problem.hint)}</p></details>
    <details><summary>Show one solution</summary>${codeBlock(lesson.file, problem.solution, `${problem.title} solution`)}</details>
  </div>`;
}

function renderLesson(lesson, moveFocus = false) {
  const index = lessons.indexOf(lesson);
  const previous = lessons[index - 1];
  const next = lessons[index + 1] ?? lessons.find((entry) => entry !== lesson && !progress.completed.has(entry.id));
  const done = progress.completed.has(lesson.id);
  const allDone = progress.completed.size === lessons.length;
  const step = lesson.challenge ? 'Unit challenge' : `Lesson ${lesson.step} of ${lesson.unit.lessons.length - 1}`;
  const runInstructions = `<p class="run-instructions">Save as <code>${escapeHtml(lesson.file)}</code> and run <code>./${escapeHtml(lesson.file)}</code> in PowerShell.</p>`;
  document.title = `${lesson.title} · Learn PowerShell`;
  main.innerHTML = `
    <p class="lesson-meta">Unit ${lesson.unitNumber} · ${escapeHtml(lesson.unit.title)}</p>
    <h1 id="lesson-title" tabindex="-1">${escapeHtml(lesson.title)}</h1>
    <p class="lesson-step">${step} · ${lesson.time} min</p>
    <p class="intro">${escapeHtml(lesson.intro)}</p>
    ${lesson.step === 1 ? `<p class="unit-goal"><strong>Unit goal</strong> · ${escapeHtml(lesson.unit.goal)}</p>` : ''}
    ${lesson.requirements ? `<p class="unit-goal"><strong>Setup</strong> · ${escapeHtml(lesson.requirements)}</p>` : ''}
    ${lesson.setup ? setup : ''}
    ${lesson.challenge ? runInstructions : `<section class="lesson-section" aria-labelledby="example-title">
      <h2 id="example-title">Worked example</h2>
      <ul class="notes">${lesson.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}</ul>
      ${lesson.setup ? '' : runInstructions}
      ${codeBlock(lesson.file, lesson.example, 'example code', true)}
      ${outputBlock(lesson.exampleOutput, lesson.exampleOutputLabel ?? 'Example output')}
      ${workedExampleGuide(lesson)}
    </section>`}
    <section class="lesson-section" aria-label="Practice">
      ${lesson.challenge ? '' : '<h2>Try it yourself</h2>'}
      ${lesson.practice.map((problem, index) => practiceProblem(problem, index, lesson)).join('')}
    </section>
    ${lesson.question ? `<section class="lesson-section check" aria-labelledby="check-title">
      <h2 id="check-title">Quick check</h2>
      <form id="quick-check">
        <fieldset>
          <legend>${escapeHtml(lesson.question)}</legend>
          ${lesson.choices.map((choice, choiceIndex) => `<label class="choice">
            <input type="radio" name="answer" value="${choiceIndex}" required>
            <span>${escapeHtml(choice)}</span>
          </label>`).join('')}
        </fieldset>
        <button class="button" type="submit">Check answer</button>
        <p class="feedback" role="status"></p>
      </form>
    </section>` : ''}
    ${lesson.unit.references ? `<details class="lesson-section setup">
      <summary>Unit reference</summary>
      <ul>${lesson.unit.references.map(([title, url]) => `<li><a href="${escapeHtml(url)}">${escapeHtml(title)}</a></li>`).join('')}</ul>
    </details>` : ''}
    ${allDone ? '<p id="course-complete" class="lesson-section course-complete" tabindex="-1"><strong>Course complete.</strong> You finished every unit and challenge.</p>' : ''}
    <footer class="lesson-footer">
      ${previous ? `<a class="button" href="#${previous.id}">← Previous</a>` : ''}
      ${done
        ? (next ? `<a class="button primary forward" href="#${next.id}">Continue →</a>` : '<span class="forward">Completed ✓</span>')
        : `<button class="button primary forward" id="complete-lesson" type="button">${next ? 'Mark complete and continue →' : 'Mark complete'}</button>`}
    </footer>`;

  const check = document.querySelector('#quick-check');
  const feedback = check?.querySelector('.feedback');
  check?.addEventListener('change', () => { feedback.textContent = ''; });
  check?.addEventListener('submit', (event) => {
    event.preventDefault();
    const selected = new FormData(event.currentTarget).get('answer');
    const correct = selected === String(lesson.correct);
    feedback.classList.toggle('correct', correct);
    feedback.textContent = correct ? `Correct. ${lesson.explanation}` : `Try again. ${lesson.feedback}`;
  });

  document.querySelector('#complete-lesson')?.addEventListener('click', () => {
    progress.completed.add(lesson.id);
    saveProgress(lesson.id);
    if (next && progress.completed.size < lessons.length) {
      window.location.hash = next.id;
      return;
    }
    renderLesson(lesson);
    (main.querySelector('#course-complete') ?? main.querySelector('#lesson-title')).focus();
  });

  renderNavigation(lesson.id);
  if (moveFocus) {
    document.querySelector('#lesson-title').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

function openCurrentLesson(moveFocus = false) {
  const id = window.location.hash.slice(1);
  const lesson = lessonById.get(id) ?? lessonById.get(progress.current) ?? lessons[0];
  saveProgress(lesson.id);
  renderLesson(lesson, moveFocus);
}

main.addEventListener('click', async (event) => {
  const button = event.target.closest('.copy');
  if (!button) return;
  const block = button.closest('.code-block');
  const code = block.querySelector('code');
  const status = block.querySelector('[role="status"]');

  try {
    await navigator.clipboard.writeText(code.textContent);
    button.textContent = 'Copied';
    status.textContent = 'Code copied.';
    window.setTimeout(() => { button.textContent = 'Copy'; }, 1500);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(code);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Code selected for manual copying.';
    button.textContent = 'Selected';
  }
});

nav.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  if (mobile.matches) menu.open = false;
});

document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelector('#lesson-title').focus();
});

function updateMenu() {
  menu.open = !mobile.matches;
}

mobile.addEventListener('change', updateMenu);
window.addEventListener('hashchange', () => openCurrentLesson(true));
updateMenu();
openCurrentLesson();

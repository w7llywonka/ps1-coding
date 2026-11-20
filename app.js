const lessons = course.flatMap((group) => group.lessons);
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

function codeBlock(file, code, label) {
  return `<div class="code-block">
    <div class="code-bar"><span>${escapeHtml(file)}</span><button class="copy" type="button" aria-label="Copy ${label}">Copy</button></div>
    <pre tabindex="0" aria-label="${label}"><code>${escapeHtml(code)}</code></pre>
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
    <li>Open PowerShell. On Windows, search for PowerShell in Start. On macOS or Linux, <a href="https://learn.microsoft.com/powershell/scripting/install/installing-powershell">install PowerShell</a> and type <code>pwsh</code> in your terminal.</li>
    <li>In PowerShell, run <code>New-Item -ItemType Directory -Path ps1-practice</code> to create a folder in your current location, then run <code>Set-Location ps1-practice</code> to enter it. If the folder already exists, start with <code>Set-Location ps1-practice</code>.</li>
    <li>Use a plain-text editor to save <code>hello.ps1</code> in that folder. In Windows Notepad, select <strong>All files</strong> as the file type so it keeps the <code>.ps1</code> extension.</li>
    <li>If PowerShell reports that it has blocked script execution, see <a href="https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies">Microsoft’s execution policy guide</a> for your environment.</li>
  </ol>
</details>`;

function renderNavigation(currentId) {
  let index = 0;
  nav.innerHTML = course.map((group) => `<section>
    <h2>${escapeHtml(group.title)}</h2>
    <ol>${group.lessons.map((lesson) => {
      const number = String(++index).padStart(2, '0');
      const done = progress.completed.has(lesson.id);
      return `<li><a href="#${lesson.id}"${lesson.id === currentId ? ' aria-current="page"' : ''}>
        <span class="lesson-number${done ? ' done' : ''}" aria-hidden="true">${done ? '✓' : number}</span>
        <span>${escapeHtml(lesson.title)}${done ? '<span class="visually-hidden"> (completed)</span>' : ''}</span>
      </a></li>`;
    }).join('')}</ol>
  </section>`).join('');

  const bar = document.querySelector('#progress');
  bar.max = lessons.length;
  bar.value = progress.completed.size;
  document.querySelector('#progress-label').textContent = `${progress.completed.size} of ${lessons.length} complete`;
}

function renderLesson(lesson, moveFocus = false) {
  const index = lessons.indexOf(lesson);
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  const done = progress.completed.has(lesson.id);
  const allDone = progress.completed.size === lessons.length;
  document.title = `${lesson.title} · PowerShell Basics`;
  main.innerHTML = `
    <p class="lesson-meta">Lesson ${index + 1} of ${lessons.length} · ${lesson.time} min</p>
    <h1 id="lesson-title" tabindex="-1">${escapeHtml(lesson.title)}</h1>
    <p class="intro">${escapeHtml(lesson.intro)}</p>
    ${lesson.setup ? setup : ''}
    <section class="lesson-section" aria-labelledby="example-title">
      <h2 id="example-title">Worked example</h2>
      <ul class="notes">${lesson.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}</ul>
      ${lesson.setup ? '' : `<p class="notes">Save as <code>${escapeHtml(lesson.file)}</code> and run <code>./${escapeHtml(lesson.file)}</code> in PowerShell.</p>`}
      ${codeBlock(lesson.file, lesson.example, 'example code')}
      ${outputBlock(lesson.exampleOutput, 'Example output')}
    </section>
    <section class="lesson-section practice" aria-labelledby="practice-title">
      <h2 id="practice-title">Try it yourself</h2>
      <p>${escapeHtml(lesson.task)}</p>
      ${outputBlock(lesson.expected, lesson.expectedLabel ?? 'Expected output')}
      <details><summary>Show a hint</summary><p>${escapeHtml(lesson.hint)}</p></details>
      <details><summary>Show one solution</summary>${codeBlock(lesson.file, lesson.solution, 'solution code')}</details>
    </section>
    <section class="lesson-section check" aria-labelledby="check-title">
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
    </section>
    ${allDone ? '<p id="course-complete" class="lesson-section course-complete" tabindex="-1"><strong>Course complete.</strong> You wrote scripts that take input, repeat work, and save a report.</p>' : ''}
    <footer class="lesson-footer">
      ${previous ? `<a class="button" href="#${previous.id}">← Previous lesson</a>` : ''}
      ${done
        ? (next ? `<a class="button primary forward" href="#${next.id}">Next lesson →</a>` : '<span class="forward">Lesson complete ✓</span>')
        : `<button class="button primary forward" id="complete-lesson" type="button">${next ? 'Mark complete and continue →' : 'Mark lesson complete'}</button>`}
    </footer>`;

  const check = document.querySelector('#quick-check');
  const feedback = check.querySelector('.feedback');
  check.addEventListener('change', () => { feedback.textContent = ''; });
  check.addEventListener('submit', (event) => {
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

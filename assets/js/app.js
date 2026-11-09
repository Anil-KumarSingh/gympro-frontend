const savedApi = localStorage.getItem('gympro_api');
const API = !savedApi || savedApi === 'https://gympro-backend-o65x.onrender.com'
  ? 'http://localhost:8000'
  : savedApi;
if (API !== savedApi) localStorage.setItem('gympro_api', API);
const savedUser = JSON.parse(localStorage.getItem('gympro_user') || 'null');
const state = { page: savedUser?.role === 'admin' ? 'admin' : 'dashboard', auth: location.hash === '#admin' || savedUser?.role === 'admin' ? 'admin' : savedUser ? 'login' : 'home', user: savedUser, data: {}, workoutChoice: '', workoutStarted: false };
const navItems = [
  { id: 'dashboard', label: 'Overview', icon: '⌂', group: 'member' },
  { id: 'workouts', label: 'Workouts', icon: '◉', group: 'member' },
  { id: 'nutrition', label: 'Nutrition', icon: '◌', group: 'member' },
  { id: 'bmi', label: 'BMI tracker', icon: '⌁', group: 'member' },
  { id: 'support', label: 'Support', icon: '✳', group: 'member' },
  { id: 'profile', label: 'My profile', icon: '◎', group: 'member' },
  { id: 'admin', label: 'Admin overview', icon: '▦', group: 'admin' },
  { id: 'members', label: 'Members', icon: '♙', group: 'admin' },
  { id: 'admin-support', label: 'Member requests', icon: '☷', group: 'admin' },
];
const workoutGuide = {
  squat: { name: 'Bodyweight squat', group: 'Strength', focus: 'Quads · Glutes · Core', duration: 12, intro: 'A foundational lower body movement using your own bodyweight.', steps: ['Stand with feet about shoulder width apart and toes turned slightly out.', 'Brace your midsection and send your hips back as you bend your knees.', 'Lower only as far as you can while keeping your heels down and chest comfortably lifted.', 'Press through your whole foot to stand tall again. Move with control.'], cue: 'Keep your knees tracking in the same direction as your toes. Use a chair behind you as a depth target if helpful.' },
  pushup: { name: 'Push-up', group: 'Strength', focus: 'Chest · Shoulders · Triceps · Core', duration: 10, intro: 'A simple upper body press that can be scaled against a wall or bench.', steps: ['Place your hands a little wider than shoulder width and make a straight line from head to heels.', 'Brace your core and bend your elbows to lower your chest toward the floor.', 'Keep your elbows angled slightly back instead of flaring straight out.', 'Press the floor away until your arms are straight, without letting your hips sag.'], cue: 'For an easier version, place your hands on a sturdy bench or wall and keep the same straight body line.' },
  lunge: { name: 'Reverse lunge', group: 'Strength', focus: 'Glutes · Quads · Balance', duration: 12, intro: 'A controlled single leg movement that builds strength and balance.', steps: ['Stand tall with your feet hip width apart and hands at your sides.', 'Step one foot back and lower both knees comfortably toward a right angle.', 'Keep your front foot flat and your torso upright as you lower.', 'Push through the front foot to return to standing, then switch sides.'], cue: 'Use a wall or chair for balance, and shorten your step if your knees feel uncomfortable.' },
  bridge: { name: 'Glute bridge', group: 'Strength', focus: 'Glutes · Hamstrings · Core', duration: 10, intro: 'A floor based movement to practice hip extension and glute engagement.', steps: ['Lie on your back with knees bent, feet flat, and arms resting by your sides.', 'Gently brace your midsection and press through both feet.', 'Lift your hips until your body forms a comfortable line from shoulders to knees.', 'Pause briefly, then lower your hips slowly to the floor.'], cue: 'Avoid arching your lower back at the top; finish the lift by squeezing your glutes.' },
  plank: { name: 'Forearm plank', group: 'Core', focus: 'Core · Shoulders', duration: 8, intro: 'A steady isometric hold that teaches full body bracing.', steps: ['Place your forearms on the floor with elbows under your shoulders.', 'Step your feet back and make a long line from head through heels.', 'Gently squeeze your glutes and brace as if preparing for a light nudge.', 'Breathe steadily while you hold, then lower your knees to finish.'], cue: 'Start with short holds. End the set when you can no longer keep a steady body position.' },
  deadbug: { name: 'Dead bug', group: 'Core', focus: 'Deep core · Coordination', duration: 8, intro: 'A slow, floor based core exercise focused on control and coordination.', steps: ['Lie on your back and raise your arms above your shoulders.', 'Bend your hips and knees to roughly right angles; keep your back comfortable.', 'Slowly extend one leg and the opposite arm without rushing.', 'Return to the start and alternate sides while keeping your torso still.'], cue: 'Use a smaller reach if your lower back lifts or feels strained.' },
  jumpingjacks: { name: 'Jumping jacks', group: 'Cardio', focus: 'Full body · Cardiovascular fitness', duration: 8, intro: 'A rhythmic whole body movement to raise your heart rate.', steps: ['Stand tall with feet together and arms resting by your sides.', 'Hop your feet apart as your arms sweep up comfortably overhead.', 'Hop back to the starting position as your arms return to your sides.', 'Repeat at a pace that lets you stay balanced and breathe comfortably.'], cue: 'For a low impact option, step one foot out at a time instead of jumping.' },
  march: { name: 'March in place', group: 'Cardio', focus: 'Legs · Cardiovascular fitness', duration: 10, intro: 'A low impact cardio option that is easy to adjust to your pace.', steps: ['Stand tall near a wall or chair if you would like balance support.', 'March in place, lifting one knee at a time to a comfortable height.', 'Let your arms swing naturally in opposition to your legs.', 'Keep a steady rhythm and gradually slow down to finish.'], cue: 'Keep your steps light and choose a pace where you can still speak comfortably.' },
};
// Educational demos are embedded from their original YouTube publishers.
const workoutDemos = {
  squat: 'gcNh17Ckjgg', pushup: 'WDIpL0pjun0', lunge: '-Nr6dqEvz3Q',
  bridge: 'R1OXPHRqehw', jumpingjacks: 'nGaXj3kkmrU',
};
const $ = (s, root = document) => root.querySelector(s);
const esc = (v = '') => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const displayName = () => state.user?.name || 'Alex Morgan';
const initials = name => (name || 'AM').split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase();
const toast = (msg, error = false) => { const el = $('#toast'); el.textContent = msg; el.className = `toast show${error ? ' error' : ''}`; setTimeout(() => el.className = 'toast', 2800); };
async function api(path, options = {}) {
  const token = localStorage.getItem('gympro_token');
  let response;
  try {
    response = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) } });
  } catch (err) {
    if (err instanceof TypeError) throw new Error(`Can't reach the GymPro API at ${API}. Start the backend and open this page through http://localhost:5500 (not as a file).`);
    throw err;
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.detail || result.message || `Request failed (${response.status})`);
  return result;
}
function shell(content) {
  const label = navItems.find(x => x.id === state.page)?.label || 'Overview';
  const nav = (mobile = false) => navItems.filter(x => mobile ? x.group === 'member' && ['dashboard','workouts','nutrition','bmi'].includes(x.id) : true).map(x => `<button class="${state.page === x.id ? 'active' : ''}" data-page="${x.id}"><span class="nav-icon">${x.icon}</span>${mobile ? `<span>${x.label === 'Overview' ? 'Home' : x.label.split(' ')[0]}</span>` : x.label}</button>`).join('');
  return `<div class="app-shell"><aside class="sidebar"><div class="brand"><span class="brand-mark">✳</span>gym<span>pro</span></div><div class="side-label">Training</div><nav class="nav">${navItems.filter(x => x.group === 'member').map(x => `<button class="${state.page === x.id ? 'active' : ''}" data-page="${x.id}"><span class="nav-icon">${x.icon}</span>${x.label}</button>`).join('')}</nav><div class="side-label" style="margin-top:26px">Management</div><nav class="nav">${navItems.filter(x => x.group === 'admin').map(x => `<button class="${state.page === x.id ? 'active' : ''}" data-page="${x.id}"><span class="nav-icon">${x.icon}</span>${x.label}</button>`).join('')}</nav><div class="sidebar-bottom"><div class="coach-card"><strong>Your next session</strong><p>Keep your momentum going. Every rep brings you closer.</p><button class="btn btn-small" data-page="workouts">Log a workout&nbsp; ↗</button></div><nav class="nav"><button data-action="logout"><span class="nav-icon">↪</span>Sign out</button></nav></div></aside><main class="main"><header class="topbar"><div style="display:flex;align-items:center;gap:12px"><button class="icon-button mobile-menu" data-action="menu" aria-label="Open menu">☰</button><span class="crumb">Workspace&nbsp; / &nbsp;<b style="color:var(--ink)">${esc(label)}</b></span></div><div class="topbar-right"><button class="icon-button" aria-label="Notifications">♧</button><div class="user-mini"><div class="avatar">${esc(initials(displayName()))}</div><div><strong>${esc(displayName())}</strong><span>Member account</span></div></div></div></header><section class="content">${content}</section></main><nav class="mobile-nav">${nav(true)}</nav></div>`;
}
function adminShell(content) {
  const adminNav = navItems.filter(x => x.group === 'admin');
  const label = adminNav.find(x => x.id === state.page)?.label || 'Admin overview';
  const nav = (mobile = false) => adminNav.map(x => `<button class="${state.page === x.id ? 'active' : ''}" data-page="${x.id}"><span class="nav-icon">${x.icon}</span>${mobile ? `<span>${x.id === 'admin' ? 'Home' : x.id === 'members' ? 'Members' : 'Requests'}</span>` : x.label}</button>`).join('');
  return `<div class="app-shell admin-shell"><aside class="sidebar"><div class="brand"><span class="brand-mark">✳</span>gym<span>pro</span></div><div class="admin-tag">ADMIN CONSOLE</div><nav class="nav">${nav()}</nav><div class="sidebar-bottom"><div class="coach-card"><strong>GymPro operations</strong><p>Manage members and keep an eye on support requests from one place.</p><button class="btn btn-small" data-page="members">View members&nbsp; ↗</button></div><nav class="nav"><button data-action="logout"><span class="nav-icon">↪</span>Sign out</button></nav></div></aside><main class="main"><header class="topbar"><div style="display:flex;align-items:center;gap:12px"><button class="icon-button mobile-menu" data-action="menu" aria-label="Open menu">☰</button><span class="crumb">Admin console&nbsp; / &nbsp;<b style="color:var(--ink)">${esc(label)}</b></span></div><div class="topbar-right"><span class="admin-role">Administrator</span><div class="user-mini"><div class="avatar">${esc(initials(displayName()))}</div><div><strong>${esc(displayName())}</strong><span>Admin account</span></div></div></div></header><section class="content">${content}</section></main><nav class="mobile-nav">${nav(true)}</nav></div>`;
}
const head = (eyebrow, title, subtitle, action = '') => `<div class="page-head"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${subtitle}</p></div>${action}</div>`;
const stat = (icon, label, value, foot, positive = '') => `<article class="card stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-value">${value}</div><div class="stat-foot">${positive ? `<span class="positive">${positive}</span> · ` : ''}${foot}</div></article>`;
const recent = (rows, kind = 'workout') => rows.length ? `<div class="activity-list">${rows.slice(-5).reverse().map(row => kind === 'workout' ? `<div class="activity-row"><span class="activity-dot">🏋</span><div class="activity-main"><strong>${esc(row.workout_name || 'Training session')}</strong><span>${row.duration || 0} min · ${row.calories_burned || 0} kcal</span></div><span class="activity-value">↗</span></div>` : `<div class="activity-row"><span class="activity-dot">🥗</span><div class="activity-main"><strong>${esc(row.food_name || 'Meal')}</strong><span>${esc(row.meal_type || 'Meal')} · ${row.calories || 0} kcal</span></div><span class="activity-value">${row.protein || 0}g P</span></div>`).join('')}</div>` : `<div class="empty"><b>Nothing logged yet</b>Your activity will show up here.</div>`;
const chart = () => `<svg class="chart" viewBox="0 0 620 190" preserveAspectRatio="none" role="img" aria-label="Workout activity chart"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#a8d367" stop-opacity=".28"/><stop offset="1" stop-color="#a8d367" stop-opacity="0"/></linearGradient></defs><line x1="32" y1="28" x2="615" y2="28" class="chart-grid"/><line x1="32" y1="78" x2="615" y2="78" class="chart-grid"/><line x1="32" y1="128" x2="615" y2="128" class="chart-grid"/><path class="chart-fill" d="M32 132 C70 128 80 98 116 104 S167 126 201 92 S254 84 286 96 S338 57 369 70 S418 94 451 54 S503 75 531 42 S583 52 615 27 L615 155 L32 155Z"/><path class="chart-line" d="M32 132 C70 128 80 98 116 104 S167 126 201 92 S254 84 286 96 S338 57 369 70 S418 94 451 54 S503 75 531 42 S583 52 615 27"/><text x="32" y="178" class="chart-label">MON</text><text x="124" y="178" class="chart-label">TUE</text><text x="216" y="178" class="chart-label">WED</text><text x="309" y="178" class="chart-label">THU</text><text x="400" y="178" class="chart-label">FRI</text><text x="493" y="178" class="chart-label">SAT</text><text x="580" y="178" class="chart-label">SUN</text></svg>`;
function dashboardPage() {
  const workouts = state.data.workouts || [];
  const calories = workouts.reduce((a, w) => a + (+w.calories_burned || 0), 0);
  const mins = workouts.reduce((a, w) => a + (+w.duration || 0), 0);
  return `${head('MONDAY, OCTOBER 12','Good morning, '+esc(displayName().split(' ')[0])+' 👋','A little progress each day adds up to big results.','<button class="btn" data-page="workouts">＋&nbsp; Log workout</button>')}<div class="grid stats-grid">${stat('◉','Workouts logged',workouts.length,'all time','↑ Keep moving')}${stat('◷','Training time',`${Math.floor(mins/60)}<small style="font:500 13px DM Sans">h ${mins%60}m</small>`,'total minutes')}${stat('ϟ','Calories burned',calories.toLocaleString(),'from logged sessions')}${stat('♨','Current streak','4 days','You’re building a habit','↑ On track')}</div><div class="grid dash-grid"><article class="card"><div class="card-head"><div><h2>Your activity</h2><p>A snapshot of your weekly movement</p></div><button class="btn btn-light btn-small" data-page="workouts">This week　⌄</button></div><div class="chart-wrap">${chart()}</div></article><article class="card goal-card"><div class="eyebrow">Weekly focus</div><h2>Show up for yourself.</h2><p>You’re one session away from reaching your weekly movement goal.</p><div class="progress-label"><span>Weekly target</span><strong>${Math.min(workouts.length,4)} / 4 sessions</strong></div><div class="progress"><i style="width:${Math.min(workouts.length*25,100)}%"></i></div><button class="btn" style="margin-top:20px" data-page="workouts">Plan a session　→</button></article></div><div class="grid section-grid" style="margin-top:17px"><article class="card"><div class="card-head"><div><h2>Recent workouts</h2><p>Your latest training sessions</p></div><button class="btn btn-light btn-small" data-page="workouts">View all　→</button></div>${recent(workouts)}</article><article class="card"><div class="card-head"><div><h2>Today’s nutrition</h2><p>Fuel your body, one meal at a time</p></div><button class="btn btn-light btn-small" data-page="nutrition">Open log　→</button></div>${recent(state.data.nutrition || [],'nutrition')}</article></div>`;
}
function workoutsPage() {
  const rows = state.data.workouts || [];
  const selected = workoutGuide[state.workoutChoice];
  const options = `<option value="">Choose an exercise</option><optgroup label="Strength"><option value="squat">Bodyweight squat</option><option value="pushup">Push-up</option><option value="lunge">Reverse lunge</option><option value="bridge">Glute bridge</option></optgroup><optgroup label="Core"><option value="plank">Forearm plank</option><option value="deadbug">Dead bug</option></optgroup><optgroup label="Cardio"><option value="jumpingjacks">Jumping jacks</option><option value="march">March in place</option></optgroup>`;
  const selectedOptions = options.replace(`value="${state.workoutChoice}"`, `value="${state.workoutChoice}" selected`);
  let guideContent = `<div class="workout-empty"><div class="workout-illustration">↗</div><h2>Choose a movement to get started</h2><p>Select an exercise above and we’ll walk you through the setup and form before you log a session.</p></div>`;
  if (selected && !state.workoutStarted) {
    guideContent = `<div class="tutorial-header"><div><span class="tutorial-tag">${esc(selected.group)} · QUICK GUIDE</span><h2>${esc(selected.name)}</h2><p>${esc(selected.intro)}</p></div><div class="tutorial-symbol">${selected.group === 'Cardio' ? '↗' : selected.group === 'Core' ? '◉' : '◎'}</div></div><div class="tutorial-meta"><span><b>Focus</b>${esc(selected.focus)}</span><span><b>Suggested practice</b>${selected.duration} min</span></div><h3 class="tutorial-section-title">How to do it</h3><ol class="tutorial-steps">${selected.steps.map((step, i) => `<li><span>${i + 1}</span><p>${esc(step)}</p></li>`).join('')}</ol><div class="form-cue"><b>Form cue</b><p>${esc(selected.cue)}</p></div><div class="form-actions"><button class="btn btn-light" data-action="workout-clear">Choose another</button><button class="btn" data-action="workout-start">I’m ready · log this workout&nbsp; →</button></div>`;
  }
  if (selected && state.workoutStarted) {
    guideContent = `<div class="card-head"><div><span class="tutorial-tag">SESSION LOG</span><h2 style="margin-top:8px">${esc(selected.name)}</h2><p>Enter your session details to save it to your history.</p></div></div><form data-form="workout"><div class="form-grid"><div class="field full"><label>Workout</label><input name="workout_name" value="${esc(selected.name)}" readonly required></div><div class="field"><label>Duration (minutes)</label><input type="number" name="duration" min="1" placeholder="${selected.duration}" required></div><div class="field"><label>Calories burned</label><input type="number" name="calories_burned" min="0" placeholder="Enter estimate" required></div></div><div class="form-actions"><button type="button" class="btn btn-light" data-action="workout-review">Review tutorial</button><button class="btn">Save workout&nbsp; →</button></div></form>`;
  }
  return `${head('YOUR MOVEMENT','Workout guide','Pick an exercise, learn the movement, then log your session.','')}<article class="card workout-picker"><div class="picker-copy"><span class="tutorial-tag">CHOOSE YOUR WORKOUT</span><h2>What are we working on?</h2><p>Start with a movement that feels right for you.</p></div><div class="field"><label for="workout-select">Exercise type</label><select id="workout-select">${selectedOptions}</select></div></article><article class="card tutorial-card">${guideContent}</article><div class="grid section-grid workout-lower"><article class="card"><div class="card-head"><div><h2>Your workout history</h2><p>Sessions you’ve logged</p></div><span class="badge">${rows.length} total</span></div>${table(rows,['workout_name','duration','calories_burned'],['Workout','Duration','Calories'],'workout')}</article><article class="card workout-total"><div class="eyebrow">Your progress</div><div class="stat-value" style="font-size:36px;margin-top:18px">${rows.length}<span style="font:500 14px DM Sans;color:var(--muted)"> sessions</span></div><p>${rows.reduce((a,w)=>a+(+w.duration||0),0)} minutes of movement logged so far.</p><div class="progress-label"><span>Weekly goal</span><strong>${Math.min(rows.length,4)} / 4</strong></div><div class="progress" style="background:#eef1e9"><i style="width:${Math.min(rows.length*25,100)}%"></i></div></article></div>`;
}function nutritionPage(){const rows=state.data.nutrition||[];const calories=rows.reduce((a,x)=>a+(+x.calories||0),0);return `${head('EAT WELL','Nutrition journal','A little awareness can make a big difference.','')}<div class="grid stats-grid">${stat('◌','Calories today',calories.toLocaleString(),'daily total')}${stat('P','Protein',rows.reduce((a,x)=>a+(+x.protein||0),0)+'g','across logged meals')}${stat('C','Carbohydrates',rows.reduce((a,x)=>a+(+x.carbs||0),0)+'g','across logged meals')}${stat('F','Healthy fats',rows.reduce((a,x)=>a+(+x.fat||0),0)+'g','across logged meals')}</div><div class="split"><article class="card"><div class="card-head"><div><h2>Add a meal</h2><p>Keep track of what fuels you</p></div></div><form data-form="nutrition"><div class="form-grid"><div class="field"><label>Meal</label><select name="meal_type" required><option value="">Select meal</option><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select></div><div class="field"><label>Food name</label><input name="food_name" placeholder="Grilled chicken salad" required></div><div class="field"><label>Calories</label><input type="number" name="calories" min="0" placeholder="420" required></div><div class="field"><label>Protein (g)</label><input type="number" step=".1" name="protein" min="0" placeholder="32" required></div><div class="field"><label>Carbs (g)</label><input type="number" step=".1" name="carbs" min="0" placeholder="38" required></div><div class="field"><label>Fat (g)</label><input type="number" step=".1" name="fat" min="0" placeholder="14" required></div></div><div class="form-actions"><button class="btn">Add to journal　→</button></div></form></article><article class="card"><div class="card-head"><div><h2>Meals logged</h2><p>Your food journal entries</p></div><span class="badge">${rows.length} meals</span></div>${recent(rows,'nutrition')}</article></div>`;}
function bmiPage(){const rows=state.data.bmi||[];const current=rows.at(-1);const val=current?.bmi||'—';const category=current?.category||'Add a measurement to get started';return `${head('YOUR HEALTH','BMI tracker','Track your body mass index over time.','')}<div class="split"><article class="card"><div class="card-head"><div><h2>Calculate your BMI</h2><p>Enter your latest measurements</p></div></div><form data-form="bmi"><div class="form-grid"><div class="field"><label>Height (cm)</label><input type="number" name="height" min="1" step=".1" placeholder="172" required></div><div class="field"><label>Weight (kg)</label><input type="number" name="weight" min="1" step=".1" placeholder="68" required></div><div class="field"><label>Age</label><input type="number" name="age" min="1" placeholder="28" required></div><div class="field"><label>Gender</label><select name="gender" required><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option></select></div></div><div class="form-actions"><button class="btn">Calculate BMI　→</button></div></form></article><article class="card"><div class="eyebrow">Latest measurement</div><div class="bmi-result"><div class="bmi-number">${esc(val)}</div><div style="font-weight:700;margin-top:2px">${esc(category)}</div><div class="bmi-scale"><i class="bmi-pointer" style="left:${current?Math.min(Math.max((current.bmi-15)*4,3),94):48}%"></i></div><div class="scale-labels"><span>Underweight</span><span>Healthy</span><span>Overweight</span><span>Obese</span></div></div><p style="font-size:10px;color:var(--muted);line-height:1.6;text-align:center">BMI is one measure of health and does not account for muscle mass or individual differences.</p></article></div><article class="card" style="margin-top:17px"><div class="card-head"><div><h2>Measurement history</h2><p>Your recorded BMI calculations</p></div></div>${table(rows,['bmi','category','weight','height','age'],['BMI','Category','Weight','Height','Age'],'bmi')}</article>`;}
function supportPage(){const rows=state.data.complaints||[];return `${head('WE’RE HERE TO HELP','Member support','Tell us how we can make your experience better.','')}<div class="split"><article class="card"><div class="card-head"><div><h2>Send us a message</h2><p>Our team will take a look as soon as possible</p></div><span class="stat-icon">✳</span></div><form data-form="complaint"><div class="form-grid"><div class="field"><label>Topic</label><select name="category" required><option value="">Choose a topic</option><option>Membership</option><option>Equipment</option><option>Classes</option><option>Billing</option><option>Other</option></select></div><div class="field"><label>Subject</label><input name="subject" placeholder="How can we help?" required></div><div class="field full"><label>Message</label><textarea name="description" placeholder="Share a few details with us..." required></textarea></div></div><div class="form-actions"><button class="btn">Submit request　→</button></div></form></article><article class="card"><div class="card-head"><div><h2>Your requests</h2><p>Updates from the GymPro team</p></div></div>${rows.length?`<div class="activity-list">${rows.slice().reverse().map(r=>`<div class="activity-row"><span class="activity-dot">✉</span><div class="activity-main"><strong>${esc(r.subject)}</strong><span>${esc(r.category)}</span></div><span class="badge ${(r.status||'Pending').toLowerCase()}">${esc(r.status||'Pending')}</span></div>`).join('')}</div>`:'<div class="empty"><b>No requests yet</b>Your support conversations will appear here.</div>'}</article></div>`;}
function profilePage(){const u=state.user||{};return `${head('ACCOUNT SETTINGS','My profile','Your details, all in one place.','')}<article class="card" style="max-width:760px"><div class="profile-head"><div class="profile-avatar">${esc(initials(displayName()))}</div><div><h2>${esc(displayName())}</h2><p>${esc(u.email||'alex.morgan@example.com')}</p></div></div><form data-form="profile"><div class="form-grid"><div class="field"><label>Full name</label><input name="name" value="${esc(u.name||'')}" placeholder="Your name"></div><div class="field"><label>Email address</label><input value="${esc(u.email||'')}" disabled></div><div class="field"><label>Age</label><input type="number" name="age" min="1" placeholder="Your age"></div><div class="field"><label>Height (cm)</label><input type="number" step=".1" name="height" placeholder="172"></div><div class="field"><label>Weight (kg)</label><input type="number" step=".1" name="weight" placeholder="68"></div><div class="field"><label>Fitness goal</label><select name="goal"><option value="">Choose a goal</option><option>Build strength</option><option>Improve endurance</option><option>Lose weight</option><option>Stay active</option></select></div></div><div class="form-actions"><button class="btn">Save changes　→</button></div></form></article>`;}
function table(rows,keys,labels,type){if(!rows.length)return '<div class="empty"><b>No records yet</b>Once you add an entry, it will appear here.</div>';return `<div class="table-wrap"><table><thead><tr>${labels.map(l=>`<th>${l}</th>`).join('')}</tr></thead><tbody>${rows.slice().reverse().map(row=>`<tr>${keys.map(k=>`<td>${k==='category'&&type==='bmi'?`<span class="badge">${esc(row[k]||'—')}</span>`:k==='duration'?`${esc(row[k]||0)} min`:k==='calories_burned'?`${esc(row[k]||0)} kcal`:k==='weight'?`${esc(row[k]||'—')} kg`:k==='height'?`${esc(row[k]||'—')} cm`:esc(row[k]??'—')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
function adminPage(){const users=state.data.users||[];const complaints=state.data.complaints||[];return `${head('GYMPRO MANAGEMENT','Admin overview','A clear view of your growing community.','')}<div class="grid stats-grid">${stat('♙','Total members',users.length,'registered accounts')}${stat('◉','Workouts logged',(state.data.adminStats||{}).total_workouts||0,'across all members')}${stat('✉','Open requests',complaints.filter(x=>x.status==='Pending').length,'awaiting a response')}${stat('◌','Nutrition entries',(state.data.adminStats||{}).total_nutrition_entries||0,'logged by members')}</div><div class="grid section-grid"><article class="card"><div class="card-head"><div><h2>Member activity</h2><p>Community workout volume</p></div><button class="btn btn-light btn-small" data-page="members">All members →</button></div><div class="chart-wrap">${chart()}</div></article><article class="card"><div class="card-head"><div><h2>Latest requests</h2><p>Member support queue</p></div><button class="btn btn-light btn-small" data-page="admin-support">View queue →</button></div>${complaints.length?complaints.slice(-4).reverse().map(r=>`<div class="activity-row"><span class="activity-dot">✉</span><div class="activity-main"><strong>${esc(r.subject)}</strong><span>${esc(r.user_email||'Member')} · ${esc(r.category)}</span></div><span class="badge ${(r.status||'Pending').toLowerCase()}">${esc(r.status||'Pending')}</span></div>`).join(''):'<div class="empty"><b>No requests</b>New member requests will show here.</div>'}</article></div>`;}
function membersPage(){const rows=state.data.users||[];return `${head('PEOPLE','Members','Manage your GymPro community.','<button class="btn" data-action="add-member">＋&nbsp; Add member</button>')}<article class="card"><div class="card-head"><div><h2>All members</h2><p>${rows.length} accounts</p></div><input id="member-search" placeholder="Search members…" style="max-width:230px;border:1px solid var(--line);border-radius:9px;padding:9px 11px"></div>${rows.length?`<div class="table-wrap"><table><thead><tr><th>Member</th><th>Email</th><th>Role</th><th>Status</th></tr></thead><tbody>${rows.map(u=>`<tr><td><strong>${esc(u.name||'Member')}</strong></td><td>${esc(u.email)}</td><td>${esc(u.role||'user')}</td><td><span class="badge">${esc(u.status||'Active')}</span></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty"><b>No members found</b>Registered accounts will show here.</div>'}</article>`;}
function adminSupportPage(){const rows=state.data.complaints||[];return `${head('MEMBER CARE','Support requests','Review and update member conversations.','')}<article class="card"><div class="card-head"><div><h2>All requests</h2><p>${rows.length} total conversations</p></div></div>${rows.length?`<div class="table-wrap"><table><thead><tr><th>Member</th><th>Subject</th><th>Category</th><th>Status</th><th>Update</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${esc(r.user_email||'Member')}</td><td><strong>${esc(r.subject)}</strong><div style="font-size:10px;margin-top:4px">${esc(r.description||'')}</div></td><td>${esc(r.category)}</td><td><span class="badge ${(r.status||'Pending').toLowerCase()}">${esc(r.status||'Pending')}</span></td><td><select data-status="${esc(r._id)}" style="border:1px solid var(--line);border-radius:8px;padding:7px"><option ${r.status==='Pending'?'selected':''}>Pending</option><option ${r.status==='In progress'?'selected':''}>In progress</option><option ${r.status==='Resolved'?'selected':''}>Resolved</option></select></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty"><b>No requests yet</b>Member support requests will appear here.</div>'}</article>`;}
function homePage(){return `<main class="public-home"><header class="public-nav"><a class="brand" href="#top" aria-label="GymPro home"><span class="brand-mark">✳</span>gym<span>pro</span></a><nav><a href="#how-it-works">How it works</a><a href="#exercises">Exercises</a></nav><button class="btn btn-dark" data-auth="login">Sign in <span aria-hidden="true">→</span></button></header><section class="public-hero" id="top"><div class="hero-copy"><div class="eyebrow">YOUR SPACE TO GET STRONGER</div><h1>Movement that meets <span>you where you are.</span></h1><p>Build a bodyweight routine, follow a movement demo, and get live form cues while you train. Your first step is just showing up.</p><div class="hero-actions"><button class="btn btn-dark" data-auth="login">Start a workout <span aria-hidden="true">→</span></button><a class="text-link" href="#exercises">Explore exercises ↓</a></div><div class="hero-proof"><span class="proof-dot">✓</span> No equipment needed <span class="proof-separator">·</span> Camera based coaching</div></div><div class="hero-visual" aria-label="GymPro movement coaching preview"><div class="visual-orbit orbit-one"></div><div class="visual-orbit orbit-two"></div><div class="visual-card"><div class="visual-top"><span class="live-dot"></span> LIVE FORM COACH</div><div class="pose-figure"><span class="pose-head"></span><span class="pose-body"></span><span class="pose-arm pose-arm-left"></span><span class="pose-arm pose-arm-right"></span><span class="pose-leg pose-leg-left"></span><span class="pose-leg pose-leg-right"></span><span class="pose-joint joint-one"></span><span class="pose-joint joint-two"></span></div><div class="visual-feedback"><span>✓</span><div><strong>Nice form!</strong><small>Keep your chest lifted</small></div><b>03</b></div></div><div class="hero-badge"><span>✳</span><div><strong>Your pace, your progress</strong><small>One rep at a time</small></div></div></div></section><section class="public-highlights" id="how-it-works"><article><span class="highlight-icon">▶</span><h3>See the movement</h3><p>Watch a short demo before you begin, so you know what each exercise should look and feel like.</p></article><article><span class="highlight-icon">◎</span><h3>Get live form cues</h3><p>Your camera tracks key body points and offers simple prompts as you move through a rep.</p></article><article><span class="highlight-icon">↗</span><h3>Keep your progress</h3><p>Sign in to save completed workouts and see your training history in one place.</p></article></section><section class="public-exercises" id="exercises"><div class="public-section-heading"><div><div class="eyebrow">START WITH THE BASICS</div><h2>Move with what you have.</h2><p>Explore bodyweight movements you can do at home. Sign in when you’re ready to train.</p></div><button class="btn btn-light" data-auth="login">Choose an exercise →</button></div><div class="exercise-chips"><span>Squats</span><span>Push-ups</span><span>Lunges</span><span>Glute bridges</span><span>Plank</span><span>Dead bug</span><span>Jumping jacks</span><span>March in place</span></div></section><footer class="public-footer"><span class="brand"><span class="brand-mark">✳</span>gym<span>pro</span></span><span>Built for steady progress, one workout at a time.</span><button data-auth="login">Member sign in</button></footer></main>`;}
function authPage(){const signup=state.auth==='signup';return `<div class="login-screen"><section class="login-art"><div class="brand" style="padding:0;color:#fff"><span class="brand-mark">✳</span>gym<span>pro</span></div><div><div class="eyebrow" style="color:#b5d487">A STRONGER YOU STARTS HERE</div><h1>Make room for your <span>strongest</span> self.</h1><p>Your training, nutrition and progress — together in one calm, focused space.</p></div><div style="font-size:11px;color:#91a192">© 2026 GymPro. Made for your next personal best.</div></section><section class="login-panel"><div class="login-box"><button class="auth-home-link" data-auth="home">← Back to GymPro home</button><div class="brand" style="padding:0 0 26px"><span class="brand-mark">✳</span>gym<span>pro</span></div><h2>${signup?'Create your account':'Welcome back'}</h2><p>${signup?'Start building a routine that feels like yours.':'Ready to pick up where you left off?'}</p><div class="auth-tabs"><button data-auth="login" class="${!signup?'active':''}">Sign in</button><button data-auth="signup" class="${signup?'active':''}">Create account</button></div><form data-form="auth"><div class="form-grid">${signup?'<div class="field full"><label>Your name</label><input name="name" placeholder="Alex Morgan" required></div>':''}<div class="field full"><label>Email address</label><input type="email" name="email" placeholder="you@example.com" required></div><div class="field full"><label>Password</label><input type="password" name="password" placeholder="At least 8 characters" required></div></div><div class="form-actions"><button class="btn btn-dark" style="width:100%">${signup?'Create account':'Sign in'}　→</button></div></form><div class="api-note">Want a quick preview? <a href="#" data-action="demo" style="color:#638b36">Explore demo dashboard</a></div></div></section></div>`;}
function adminAuthPage(){return `<div class="login-screen admin-login"><section class="login-art"><div class="brand" style="padding:0;color:#fff"><span class="brand-mark">✳</span>gym<span>pro</span></div><div><div class="eyebrow" style="color:#b5d487">STAFF ACCESS</div><h1>Welcome to the <span>control room.</span></h1><p>Manage your members, review requests, and keep GymPro running smoothly.</p></div><div style="font-size:11px;color:#91a192">Authorized GymPro administrators only.</div></section><section class="login-panel"><div class="login-box"><div class="admin-login-label">ADMIN PORTAL</div><h2>Administrator sign in</h2><p>Use your GymPro administrator account to continue.</p><form data-form="auth"><div class="form-grid"><div class="field full"><label>Admin email</label><input type="email" name="email" placeholder="admin@example.com" autocomplete="username" required></div><div class="field full"><label>Password</label><input type="password" name="password" placeholder="Enter your password" autocomplete="current-password" required></div></div><div class="form-actions"><button class="btn btn-dark" style="width:100%">Sign in to admin&nbsp; →</button></div></form><div class="api-note">Admin access is limited to accounts with the administrator role.</div><a class="back-link" href="#" data-auth="login">←&nbsp; Member sign in</a></div></section></div>`;}
function render(){const isAdmin=state.user?.role==='admin';document.title=`${state.auth==='home'?'Home':navItems.find(x=>x.id===state.page)?.label||'Sign in'} · GymPro`;if(state.user&&((state.auth==='admin')!==isAdmin)){localStorage.removeItem('gympro_token');localStorage.removeItem('gympro_user');state.user=null;toast(state.auth==='admin'?'This account does not have administrator access.':'Use the administrator sign-in page for this account.',true);}if(!state.user){if(state.auth==='home'){$('#app').innerHTML=homePage();return;}$('#app').innerHTML=state.auth==='admin'?adminAuthPage():authPage();if(state.auth!=='admin'){const link=document.createElement('a');link.href='#admin';link.dataset.auth='admin';link.className='admin-access-link';link.textContent='Administrator sign in →';$('#app').append(link);}return;}const pages=isAdmin?{admin:adminPage,members:membersPage,'admin-support':adminSupportPage}:{dashboard:dashboardPage,workouts:workoutsPage,nutrition:nutritionPage,bmi:bmiPage,support:supportPage,profile:profilePage};if(!pages[state.page]){state.page=isAdmin?'admin':'dashboard';queueMicrotask(loadPage);return;}const content=pages[state.page]();$('#app').innerHTML=isAdmin?adminShell(content):shell(content);}
async function loadPage(){if(!state.user)return;try{if(['dashboard','workouts'].includes(state.page)){const [w,n]=await Promise.allSettled([api('/workout/my'),api('/nutrition/my')]);if(w.status==='fulfilled')state.data.workouts=w.value;if(n.status==='fulfilled')state.data.nutrition=n.value;if(state.page==='dashboard')await api('/dashboard/');}if(state.page==='nutrition')state.data.nutrition=await api('/nutrition/my');if(state.page==='bmi')state.data.bmi=await api('/bmi/history');if(state.page==='support')state.data.complaints=await api('/complaint/my');if(state.page==='profile')state.data.profile=await api('/auth/profile');if(['admin','members','admin-support'].includes(state.page)){const [users,complaints,stats]=await Promise.allSettled([api('/admin/users'),api('/admin/complaints'),api('/admin/stats')]);if(users.status==='fulfilled')state.data.users=users.value;if(complaints.status==='fulfilled')state.data.complaints=complaints.value;if(stats.status==='fulfilled')state.data.adminStats=stats.value;}}catch(e){console.info('GymPro data load:',e.message);if(!state.data.workouts)state.data.workouts=[];}render();}
function go(page){const adminPages=['admin','members','admin-support'];if(adminPages.includes(page)!==(state.user?.role==='admin')){toast('This page is not available for this account.',true);return;}stopCoach();state.page=page;render();loadPage();}
document.addEventListener('click',async e=>{const page=e.target.closest('[data-page]')?.dataset.page;if(page){go(page);return;}const auth=e.target.closest('[data-auth]')?.dataset.auth;if(auth){state.auth=auth;render();return;}const action=e.target.closest('[data-action]')?.dataset.action;if(action==='logout'){localStorage.removeItem('gympro_token');localStorage.removeItem('gympro_user');state.user=null;state.data={};state.auth='home';render();}if(action==='menu'){document.querySelector('.sidebar')?.classList.toggle('open');toast('Use the bottom navigation to move between screens.');}if(action==='api-settings'){e.preventDefault();const url=prompt('GymPro API base URL',API);if(url){localStorage.setItem('gympro_api',url.replace(/\/$/,''));location.reload();}}if(action==='demo'){e.preventDefault();localStorage.setItem('gympro_user',JSON.stringify({name:'Alex Morgan',email:'alex.morgan@example.com'}));state.user={name:'Alex Morgan',email:'alex.morgan@example.com'};state.data={workouts:[{workout_name:'Full body strength',duration:52,calories_burned:385},{workout_name:'Morning run',duration:34,calories_burned:290},{workout_name:'Lower body power',duration:48,calories_burned:410}],nutrition:[{meal_type:'Breakfast',food_name:'Greek yogurt & berries',calories:340,protein:24,carbs:38,fat:9},{meal_type:'Lunch',food_name:'Grilled chicken bowl',calories:520,protein:42,carbs:54,fat:13}]};go('dashboard');}if(action==='add-member'){const name=prompt('Member name');if(!name)return;const email=prompt('Member email');if(!email)return;api('/admin/user/add',{method:'POST',body:JSON.stringify({name,email,role:'user',status:'Active',avatar:`https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`})}).then(result=>{toast(result.message||'Member added.');loadPage();}).catch(err=>toast(err.message,true));}});
document.addEventListener('submit',async e=>{const form=e.target.closest('form[data-form]');if(!form)return;e.preventDefault();const type=form.dataset.form;const data=Object.fromEntries(new FormData(form).entries());try{if(type==='auth'){const endpoint=state.auth==='signup'?'/auth/signup':'/auth/login';const result=await api(endpoint,{method:'POST',body:JSON.stringify(data)});if(state.auth==='signup'){toast('Account created. Sign in to continue.');state.auth='login';render();return;}localStorage.setItem('gympro_token',result.token);state.user={name:data.name||data.email.split('@')[0],email:data.email};try{state.user=await api('/auth/profile');}catch{}localStorage.setItem('gympro_user',JSON.stringify(state.user));state.page=state.user.role==='admin'?'admin':'dashboard';state.data={};render();await loadPage();toast(state.user.role==='admin'?'Welcome to the admin console.':'Welcome back!');return;}const paths={workout:'/workout/add',nutrition:'/nutrition/add',bmi:'/bmi/calculate',complaint:'/complaint/add',profile:'/auth/profile'};const method=type==='profile'?'PUT':'POST';const payload=type==='profile'?Object.fromEntries(Object.entries(data).filter(([,v])=>v!=='')):data;const result=await api(paths[type],{method,body:JSON.stringify(payload)});if(type==='bmi'){state.data.bmi=[...(state.data.bmi||[]),result];}if(type==='workout'){state.workoutChoice='';state.workoutStarted=false;}toast(result.message||'Saved successfully.');await loadPage();}catch(err){toast(err.message||'Could not connect to GymPro. Check your API URL.',true);}});
document.addEventListener('change',async e=>{if(e.target.matches('[data-status]')){try{await api(`/admin/complaint/${encodeURIComponent(e.target.dataset.status)}`,{method:'PATCH',body:JSON.stringify({status:e.target.value})});toast('Request status updated.');await loadPage();}catch(err){toast(err.message,true);}}});
document.addEventListener('input',e=>{if(e.target.id==='member-search'){const q=e.target.value.toLowerCase();document.querySelectorAll('tbody tr').forEach(row=>row.hidden=!row.textContent.toLowerCase().includes(q));}});
document.addEventListener('click',e=>{const auth=e.target.closest('[data-auth]')?.dataset.auth;if(auth)location.hash=auth==='admin'?'admin':'';});
document.addEventListener('click',e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(action==='workout-start'){state.workoutStarted=true;render();}if(action==='workout-review'){state.workoutStarted=false;render();}if(action==='workout-clear'){state.workoutChoice='';state.workoutStarted=false;render();}});
document.addEventListener('change',e=>{if(e.target.id==='workout-select'){state.workoutChoice=e.target.value;state.workoutStarted=false;render();}});

// Add the demo and form coach to the existing workout guide without changing
// the logged-workout API or storing camera footage.
let coachStream = null, coachTimer = null, coachWorker = null, coachFrameBusy = false, coachStartReject = null, coachMemory = null;
const workoutMediaObserver = new MutationObserver(() => {
  if (state.page !== 'workouts' || !state.workoutChoice) return;
  const card = $('.tutorial-card');
  if (!card || card.dataset.mediaReady) return;
  card.dataset.mediaReady = 'true';
  const demo = workoutDemos[state.workoutChoice];
  const title = workoutGuide[state.workoutChoice]?.name || 'Exercise';
  const demoPanel = document.createElement('section');
  demoPanel.className = 'workout-demo';
  demoPanel.innerHTML = `<div class="demo-copy"><span class="tutorial-tag">WATCH BEFORE YOU BEGIN</span><h3>Exercise demo</h3><p>Follow a trainer’s demonstration, then try the movement at your own pace.</p></div>${demo ? `<div class="demo-frame"><iframe src="https://www.youtube-nocookie.com/embed/${demo}?rel=0" title="${esc(title)} exercise demonstration" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>` : `<a class="demo-search" href="https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} proper form exercise demonstration`)}" target="_blank" rel="noopener noreferrer">Find a ${esc(title)} demonstration on YouTube ↗</a>`}<div class="coach-intro"><div><span class="tutorial-tag">LIVE FORM CHECK</span><p>Place the camera far enough away to see your full body. Use a side view for strength and floor moves, and face forward for jumping jacks. Form alerts are spoken; frames are not saved.</p></div><button class="btn" data-action="coach-start">Start live exercise coach</button></div><div class="coach-panel" hidden><div class="coach-video-wrap"><video class="coach-video" autoplay muted playsinline></video><canvas class="coach-canvas"></canvas></div><div class="coach-workout-progress"><div class="coach-plan"><span>Workout plan</span><strong data-coach-plan>3 sets × 6 reps</strong></div><div class="coach-progress-stats"><div><b data-coach-total>0</b><span data-coach-total-unit>Total reps</span></div><div><b data-coach-set>1 / 3</b><span>Current set</span></div><div><b data-coach-sets>0 / 3</b><span>Sets completed</span></div></div><div class="coach-live-count"><strong data-coach-reps>0</strong><span data-coach-count-unit>reps this set</span></div><button class="btn btn-light" data-action="coach-next-set" disabled>Complete the set to continue</button></div><div class="coach-feedback" aria-live="polite">Allow camera access and stand where your full body is visible.</div><button class="btn btn-light" data-action="coach-stop">Stop camera</button><p class="coach-note">Pose guidance is an estimate, not medical advice. Stop if you feel pain.</p></div>`;
  const actions = card.querySelector('.form-actions');
  if (actions) actions.before(demoPanel); else card.append(demoPanel);
});
workoutMediaObserver.observe($('#app'), { childList: true, subtree: true });

function analyzeWorkoutPose(choice, pose, memory) {
  const point = index => pose[index];
  const [ls,rs,le,re,lw,rw,lh,rh,lk,rk,la,ra] = [11,12,13,14,15,16,23,24,25,26,27,28].map(point);
  const confidence = p => p ? (typeof p.visibility === 'number' ? p.visibility : typeof p.presence === 'number' ? p.presence : .5) : 0;
  const left = { shoulder:ls, elbow:le, wrist:lw, hip:lh, knee:lk, ankle:la };
  const right = { shoulder:rs, elbow:re, wrist:rw, hip:rh, knee:rk, ankle:ra };
  const score = side => Object.values(side).reduce((sum,p)=>sum+confidence(p),0)/6;
  const side = score(left) >= score(right) ? left : right;
  const sidePoints = [side.shoulder,side.elbow,side.wrist,side.hip,side.knee,side.ankle];
  const needsArms = choice === 'pushup';
  const enoughLandmarks = confidence(side.shoulder)>.18 && confidence(side.hip)>.18 && confidence(side.knee)>.18 && confidence(side.ankle)>.18 && (!needsArms || (confidence(side.elbow)>.15 && confidence(side.wrist)>.15));
  if (!enoughLandmarks || sidePoints.some(p=>!Number.isFinite(p?.x)||!Number.isFinite(p?.y))) {
    return { visible:false, mistake:'Pose found, but joints are hard to see. Show your full body clearly; use a side view for strength and floor exercises, and face the camera for jumping jacks.', reps:memory.reps, totalReps:memory.totalReps, setsCompleted:memory.setsCompleted, waitingForNextSet:memory.waitingForNextSet };
  }
  const mid=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
  const angle=(a,b,c)=>{const rad=Math.atan2(c.y-b.y,c.x-b.x)-Math.atan2(a.y-b.y,a.x-b.x);const degrees=Math.abs(rad*180/Math.PI)%360;return degrees>180?360-degrees:degrees;};
  const shoulder=side.shoulder, hip=side.hip, knee=side.knee, ankle=side.ankle;
  const kneeAngle=angle(hip,knee,ankle);
  const elbowAngle=angle(shoulder,side.elbow,side.wrist);
  const hipAngle=angle(shoulder,hip,knee), bodyLine=angle(shoulder,hip,ankle);
  let cue='Pose detected. Move through the exercise slowly for a more reliable count.', mistake='';
  const complete=()=>{
    if(memory.waitingForNextSet||memory.setsCompleted>=memory.targetSets)return;
    memory.reps++;
    memory.totalReps++;
    if(memory.reps>=memory.targetReps){memory.reps=memory.targetReps;memory.setsCompleted++;memory.waitingForNextSet=true;}
    memory.phase='up';
  };
  if(choice==='squat') {
    if(kneeAngle<105){memory.phase='down';cue='Good depth. Keep your knees aligned over your feet.';}
    else if(kneeAngle>155&&memory.phase==='down'){complete();cue='Rep complete. Stand tall with control.';}
    else if(kneeAngle>155)cue='Lower into a comfortable squat, then stand tall.';
    const kneeDrift=Math.abs(knee.x-hip.x)+.025<Math.abs(ankle.x-hip.x);
    if(kneeDrift)mistake='Keep your knee tracking in the same direction as your toes.';
  } else if(choice==='pushup') {
    if(bodyLine<155)mistake='Keep your shoulders, hips, and ankles in a straighter line.';
    if(elbowAngle<100){memory.phase='down';cue='Lower under control.';}else if(elbowAngle>155&&memory.phase==='down'){complete();cue='Rep complete. Press the floor away.';}
  } else if(choice==='lunge') {
    if(kneeAngle<115){memory.phase='down';cue='Stay balanced and press through your front foot.';}else if(kneeAngle>155&&memory.phase==='down'){complete();cue='Rep complete. Switch sides when ready.';}
    if(Math.abs(shoulder.x-hip.x)>.12)mistake='Keep your torso upright and steady during the lunge.';
  } else if(choice==='bridge') {
    if(hipAngle<120){memory.phase='down';cue='Lift your hips by squeezing your glutes.';}else if(hipAngle>155&&memory.phase==='down'){complete();cue='Rep complete. Lower your hips slowly.';}
    if(hip.y<(shoulder.y+knee.y)/2-.06&&hipAngle>160)mistake='Lift only to a comfortable straight line; avoid forcing your lower back into an arch.';
  } else if(choice==='plank') {
    if(bodyLine<155){mistake='Bring your hips into line with your shoulders and ankles.';memory.holdStarted=0;}
    else {
      cue='Plank position looks steady. Keep breathing.';
      if(!memory.waitingForNextSet){
        memory.holdStarted ||= Date.now();
        memory.seconds=Math.floor((Date.now()-memory.holdStarted)/1000);
        memory.reps=memory.seconds;
        if(memory.seconds>=memory.targetReps){memory.seconds=memory.targetReps;memory.reps=memory.targetReps;memory.totalReps+=memory.targetReps;memory.setsCompleted++;memory.waitingForNextSet=true;memory.holdStarted=0;}
      }
    }
  } else if(choice==='deadbug') {
    const legAngle=kneeAngle;
    if(legAngle<65||legAngle>125)mistake='Reset with knees comfortably bent; reach one arm and the opposite leg at a time.';
    else cue='Keep your trunk steady and alternate opposite arm and leg.';
    if(legAngle>145&&memory.phase==='down')complete();else if(legAngle<115)memory.phase='down';
  } else if(choice==='jumpingjacks') {
    const bilateral=[ls,rs,lw,rw,la,ra].every(p=>confidence(p)>.12);
    if(!bilateral)return { visible:false, mistake:'Face the camera and keep both arms and feet in frame for jumping-jack tracking.', reps:memory.reps, totalReps:memory.totalReps, setsCompleted:memory.setsCompleted, waitingForNextSet:memory.waitingForNextSet };
    const armsUp=lw.y<ls.y&&rw.y<rs.y, feetApart=Math.abs(la.x-ra.x)>.22;
    if(feetApart&&!armsUp)mistake='Raise both arms as your feet move apart.';
    if(feetApart&&armsUp){memory.phase='down';cue='Arms and feet are opening together.';}else if(Math.abs(la.x-ra.x)<.14&&memory.phase==='down'){complete();cue='Rep complete. Land softly.';}
  } else if(choice==='march') {
    const leftLift=lk.y<lh.y-.04,rightLift=rk.y<rh.y-.04;
    if(leftLift||rightLift){cue='Good knee lift. Alternate sides and stay tall.';if(memory.phase==='up')memory.phase='down';}
    else if(memory.phase==='down')complete();
    if(Math.abs(shoulder.x-hip.x)>.12)mistake='Stand tall and keep your torso steady while marching.';
  }
  return { visible:true, cue, mistake, reps:memory.reps, totalReps:memory.totalReps, setsCompleted:memory.setsCompleted, waitingForNextSet:memory.waitingForNextSet, seconds:memory.seconds };
}

const poseConnections = [[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[27,29],[29,31],[27,31],[24,26],[26,28],[28,30],[30,32],[28,32]];
function drawPoseOverlay(canvas, video, landmarks, warning=false) {
  const context=canvas.getContext('2d');
  if(!video?.videoWidth||!video?.videoHeight)return;
  if(canvas.width!==video.videoWidth||canvas.height!==video.videoHeight){canvas.width=video.videoWidth;canvas.height=video.videoHeight;}
  context.clearRect(0,0,canvas.width,canvas.height);
  if(!landmarks)return;
  const visible=point=>point&&(point.visibility??point.presence??.5)>.18;
  context.lineWidth=Math.max(3,canvas.width*.006);
  context.strokeStyle=warning?'#ff665b':'#a7f35e';
  context.fillStyle=warning?'#ff665b':'#71d6ff';
  context.lineCap='round';
  for(const [from,to] of poseConnections){
    const a=landmarks[from],b=landmarks[to];
    if(!visible(a)||!visible(b))continue;
    context.beginPath();context.moveTo(a.x*canvas.width,a.y*canvas.height);context.lineTo(b.x*canvas.width,b.y*canvas.height);context.stroke();
  }
  for(const point of landmarks){
    if(!visible(point))continue;
    context.beginPath();context.arc(point.x*canvas.width,point.y*canvas.height,Math.max(3,canvas.width*.007),0,Math.PI*2);context.fill();
  }
}
async function startCoach(button) {
  const panel = button.closest('.workout-demo')?.querySelector('.coach-panel');
  if (!panel || coachWorker || coachStream) return;
  const feedback = panel.querySelector('.coach-feedback');
  button.disabled = true;
  panel.hidden = false;
  feedback.textContent = 'Starting the camera and loading the pose model…';
  const memory = { reps: 0, totalReps: 0, phase: 'up', targetSets: 3, targetReps: state.workoutChoice === 'plank' ? 20 : 6, setsCompleted: 0, waitingForNextSet: false };
  coachMemory = memory;
  panel.querySelector('[data-coach-plan]').textContent = state.workoutChoice === 'plank' ? '3 sets × 20 second holds' : '3 sets × 6 reps';
  panel.querySelector('[data-coach-count-unit]').textContent = state.workoutChoice === 'plank' ? 'seconds this set' : 'reps this set';
  panel.querySelector('[data-coach-total-unit]').textContent = state.workoutChoice === 'plank' ? 'Total seconds' : 'Total reps';
  let video;
  let lastFeedback = '', lastAlertAt = 0;
  const alertCoach = message => {
    const now = Date.now();
    if (now - lastAlertAt < 3000) return;
    lastAlertAt = now;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(message));
    }
  };
  const showPose = landmarks => {
    if (!landmarks) {
      drawPoseOverlay(panel.querySelector('.coach-canvas'), video, null);
      const warning = 'No pose detected. Improve the lighting and move back so your full body is in frame.';
      feedback.classList.add('coach-alert');
      feedback.textContent = warning;
      if (lastFeedback !== 'no-pose') alertCoach(warning);
      lastFeedback = 'no-pose';
      return;
    }
    const result = analyzeWorkoutPose(state.workoutChoice, landmarks, memory);
    const warning = result.mistake;
    drawPoseOverlay(panel.querySelector('.coach-canvas'), video, landmarks, Boolean(warning));
    panel.querySelector('[data-coach-reps]').textContent = result.waitingForNextSet ? memory.targetReps : result.reps;
    panel.querySelector('[data-coach-total]').textContent = result.totalReps ?? 0;
    panel.querySelector('[data-coach-set]').textContent = result.waitingForNextSet ? `${result.setsCompleted} / ${memory.targetSets} complete` : `${Math.min(result.setsCompleted + 1, memory.targetSets)} / ${memory.targetSets}`;
    panel.querySelector('[data-coach-sets]').textContent = `${result.setsCompleted} / ${memory.targetSets}`;
    const nextSetButton = panel.querySelector('[data-action="coach-next-set"]');
    const workoutDone = result.setsCompleted >= memory.targetSets;
    nextSetButton.disabled = !result.waitingForNextSet || workoutDone;
    nextSetButton.textContent = workoutDone ? 'Workout complete' : result.waitingForNextSet ? `Start set ${result.setsCompleted + 1}` : `Complete ${memory.targetReps} ${state.workoutChoice === 'plank' ? 'seconds' : 'reps'} to continue`;
    if (!result.visible) {
      feedback.classList.add('coach-alert');
      feedback.textContent = result.mistake;
      alertCoach(result.mistake);
    } else {
      feedback.classList.toggle('coach-alert', Boolean(warning));
      const countText = state.workoutChoice === 'plank' ? `Hold: ${result.waitingForNextSet ? memory.targetReps : result.seconds || 0}s` : `Set reps: ${result.waitingForNextSet ? memory.targetReps : result.reps}`;
      const setMessage = result.waitingForNextSet ? (workoutDone ? 'All sets complete. Great work.' : 'Set complete. Rest, then start the next set.') : '';
      feedback.textContent = `${warning ? 'Form reminder: ' : ''}${warning || setMessage || result.cue}  ·  ${countText}`;
      if (warning) alertCoach(warning);
      else if (setMessage && !memory.setAnnounced) { alertCoach(setMessage); memory.setAnnounced=true; }
    }
    lastFeedback = 'pose';
  };
  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access requires HTTPS or localhost in a supported browser.');
    coachStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 12, max: 15 } },
      audio: false
    });
    video = panel.querySelector('video');
    video.srcObject = coachStream;
    await video.play();
    coachWorker = new Worker('./assets/js/workers/pose-worker.js');
    let modelReady = false;
    const ready = new Promise((resolve, reject) => {
      coachStartReject = reject;
      coachWorker.onmessage = event => {
        const message = event.data;
        if (message.type === 'ready') {
          modelReady = true;
          coachStartReject = null;
          feedback.textContent = 'Camera ready. Start your exercise; the coach is tracking your movement.';
          resolve();
        } else if (message.type === 'pose') {
          coachFrameBusy = false;
          showPose(message.landmarks);
        } else if (message.type === 'error') {
          coachFrameBusy = false;
          feedback.classList.add('coach-alert');
          feedback.textContent = message.message;
          if (!modelReady) reject(new Error(message.message));
        }
      };
      coachWorker.onerror = event => reject(new Error(event.message || 'The pose worker could not start.'));
      coachWorker.postMessage({ type: 'init' });
    });
    await ready;
    const sendFrame = async () => {
      if (!coachStream || !coachWorker) return;
      if (!coachFrameBusy && video.readyState >= 2) {
        coachFrameBusy = true;
        try {
          const bitmap = await createImageBitmap(video);
          if (coachWorker) coachWorker.postMessage({ type: 'frame', bitmap, timestamp: performance.now() }, [bitmap]);
          else { bitmap.close(); coachFrameBusy = false; }
        } catch (error) {
          coachFrameBusy = false;
          feedback.textContent = `Camera frame unavailable: ${error.message}`;
        }
      }
      coachTimer = setTimeout(sendFrame, 150);
    };
    sendFrame();
  } catch (error) {
    stopCoach();
    panel.hidden = false;
    feedback.textContent = error.message || 'Could not start the camera coach.';
  } finally {
    button.disabled = false;
  }
}function stopCoach() {
  if (coachTimer) clearTimeout(coachTimer);
  coachTimer = null;
  coachStartReject?.(new Error('Camera coach stopped.'));
  coachStartReject = null;
  window.speechSynthesis?.cancel();
  coachStream?.getTracks().forEach(track=>track.stop());
  coachStream = null;
  coachFrameBusy = false;
  coachWorker?.postMessage({ type: 'close' });
  coachWorker?.terminate();
  coachWorker = null;
  coachMemory = null;
  document.querySelectorAll('.coach-panel').forEach(panel => { panel.hidden=true; const video=panel.querySelector('video'); if(video) video.srcObject=null; });
}
document.addEventListener('click', e => {
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (action === 'coach-start') startCoach(e.target.closest('[data-action]'));
  if (action === 'coach-stop') stopCoach();
  if (action === 'coach-next-set' && coachMemory?.waitingForNextSet && coachMemory.setsCompleted < coachMemory.targetSets) {
    coachMemory.waitingForNextSet = false;
    coachMemory.reps = 0;
    coachMemory.phase = 'up';
    coachMemory.holdStarted = 0;
    coachMemory.seconds = 0;
    coachMemory.setAnnounced = false;
    const panel = e.target.closest('.coach-panel');
    panel.querySelector('[data-coach-reps]').textContent = '0';
    panel.querySelector('[data-coach-set]').textContent = `${coachMemory.setsCompleted + 1} / ${coachMemory.targetSets}`;
    panel.querySelector('[data-action="coach-next-set"]').disabled = true;
    panel.querySelector('[data-action="coach-next-set"]').textContent = `Complete ${coachMemory.targetReps} ${state.workoutChoice === 'plank' ? 'seconds' : 'reps'} to continue`;
    panel.querySelector('.coach-feedback').textContent = `Set ${coachMemory.setsCompleted + 1} started. Begin when you are ready.`;
  }
  if (['workout-start','workout-review','workout-clear','logout'].includes(action)) stopCoach();
});
document.addEventListener('change', e => { if (e.target.id === 'workout-select') stopCoach(); });
render();
if(state.user)loadPage();

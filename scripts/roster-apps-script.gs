/**
 * At the Clinic (Cypress College): sign-up roster + staff data (shared automatically after the athlete agrees at sign-up).
 *
 * SETUP (one time, about 5 minutes)
 *  1. Make a NEW Google Sheet named "At the Clinic Staff Data". Keep Share > General access = Restricted.
 *     Share it only with staff who should see athlete logs (dietitian, athletic trainers).
 *  2. Paste its link (or ID) into STAFF_SHEET_ID below.
 *  3. In the PUBLIC "At the Clinic" sheet: Extensions > Apps Script. Delete what's there, paste this file, Save.
 *  4. Deploy > New deployment > type: Web app. Execute as: Me. Who has access: Anyone. Deploy, allow access.
 *  5. Copy the Web app URL (ends in /exec) and send it to Nick / Claude to put in the app.
 * Later edits: Deploy > Manage deployments > pencil > Version: New version > Deploy (the URL stays the same).
 *
 * The public sheet's Roster tab gets name, role, team, position and jersey number only (it feeds the For dropdown).
 * Meals, water and daily check-ins (sleep, soreness, energy, stress, pain) go ONLY to the private staff sheet. Tabs there are created automatically.
 */
const ROSTER_TAB = 'Roster';
const STAFF_SHEET_ID = '1-Aiua0P9YyE5TI3mu-g9fdhxERPU7Ygfs_DuwwJHQWE';

const STAFF_TABS = {
  Meals: ['Date', 'Code', 'Name', 'Team', 'Position', 'Meal', 'Time', 'What they ate', 'Gut', 'From meal plan', 'Logged', 'Entry ID'],
  Hydration: ['Date', 'Code', 'Name', 'Team', 'Position', 'Bottles', 'Bottle (oz)', 'Total (oz)', 'Goal (oz)', 'Updated', 'Key'],
  Programs: ['Date', 'Code', 'Name', 'Team', 'Position', 'Program', 'Type', 'Day', 'Exercise', 'Dose', 'Done at', 'Key'],
  'Check-ins': ['Date', 'Code', 'Name', 'Team', 'Position', 'Sleep (h)', 'Sleep quality', 'Soreness', 'Energy', 'Stress', 'Pain', 'Where', 'Pain 0-10', 'New', 'Symptoms', 'Flag', 'Updated', 'Key']
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const id = clean(d.id, 40);
    if (!id) return reply({ ok: false });
    const t = clean(d.t, 10);
    if (t === 'roster') return roster(d, id);
    if (STAFF_SHEET_ID.indexOf('PASTE_') === 0) return reply({ ok: false, error: 'staff sheet not set' });
    const ss = SpreadsheetApp.openById(staffSheetId());
    const who = [clean(d.code, 8).toUpperCase(), clean(d.name, 80), clean(d.team, 40), clean(d.position, 40)];
    const date = clean(d.date, 10), now = new Date();
    if (t === 'meal') {
      upsert(tab(ss, 'Meals'), [date].concat(who, [clean(d.occ, 20), clean(d.time, 5), clean(d.what, 120), clean(d.gut, 20), clean(d.plan, 3), now, clean(d.entryId, 40)]), 11);
    } else if (t === 'mealdel') {
      remove(tab(ss, 'Meals'), clean(d.entryId, 40), 11);
    } else if (t === 'water') {
      upsert(tab(ss, 'Hydration'), [date].concat(who, [num(d.bottles), num(d.size), num(d.oz), num(d.goal), now, id + '|' + date]), 10);
    } else if (t === 'check') {
      const flag = clean(d.flag, 6) === 'head' ? 'CONCUSSION SIGNS' : clean(d.flag, 6) === 'see' ? 'See AT today' : '';
      upsert(tab(ss, 'Check-ins'), [date].concat(who, [clean(d.sleep, 10), clean(d.sq, 10), clean(d.sore, 12), clean(d.energy, 10), clean(d.stress, 10), clean(d.pain, 4), clean(d.area, 30), clean(d.lvl, 3), clean(d.isnew, 4), clean(d.sx, 120), flag, now, id + '|' + date]), 17);
    } else if (t === 'prog') {
      upsert(tab(ss, 'Programs'), [date].concat(who, [clean(d.program, 60), clean(d.ptype, 4), clean(d.day, 20), clean(d.ex, 80), clean(d.dose, 40), now, id + '|' + clean(d.key, 120)]), 11);
    } else if (t === 'progdel') {
      remove(tab(ss, 'Programs'), id + '|' + clean(d.key, 120), 11);
    }
    return reply({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function roster(d, id) {
  const first = clean(d.first, 40), last = clean(d.last, 40);
  if (!first || !last) return reply({ ok: false });
  const row = [clean(d.code, 8).toUpperCase(), first, last, clean(d.role, 10), clean(d.teamName, 40), clean(d.pos, 40), clean(d.num, 3)];
  const sh = SpreadsheetApp.getActive().getSheetByName(ROSTER_TAB);
  const now = new Date(), vals = sh.getDataRange().getValues();
  for (let i = 1; i < vals.length; i++) {
    if (String(vals[i][9]) === id) {
      sh.getRange(i + 1, 1, 1, 7).setValues([row]);
      sh.getRange(i + 1, 9).setValue(now);
      return reply({ ok: true, updated: true });
    }
  }
  sh.appendRow(row.concat([now, now, id]));
  return reply({ ok: true });
}

function staffSheetId() { const m = String(STAFF_SHEET_ID).match(/\/d\/([a-zA-Z0-9_-]+)/); return m ? m[1] : String(STAFF_SHEET_ID).trim(); }
// Plain text only, short, and never a formula.
function clean(v, n) { return String(v == null ? '' : v).replace(/[\r\n\t]/g, ' ').trim().slice(0, n).replace(/^[=+\-@]/, "'$&"); }
function num(v) { const x = Number(v); return isFinite(x) ? x : ''; }
function tab(ss, name) {
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(STAFF_TABS[name]); sh.setFrozenRows(1); sh.getRange(1, 1, 1, STAFF_TABS[name].length).setFontWeight('bold'); }
  return sh;
}
function upsert(sh, row, keyCol) {
  const vals = sh.getDataRange().getValues();
  for (let i = 1; i < vals.length; i++) if (String(vals[i][keyCol]) === String(row[keyCol])) { sh.getRange(i + 1, 1, 1, row.length).setValues([row]); return; }
  sh.appendRow(row);
}
function remove(sh, key, keyCol) {
  const vals = sh.getDataRange().getValues();
  for (let i = vals.length - 1; i >= 1; i--) if (String(vals[i][keyCol]) === String(key)) sh.deleteRow(i + 1);
}
function reply(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

// Run once from the editor (select testStaffSheet > Run) to check the private sheet is connected.
function testStaffSheet() { tab(SpreadsheetApp.openById(staffSheetId()), 'Meals').appendRow(['TEST', 'TEST', 'Delete me']); }

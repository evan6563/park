const SHEET_ID = 'YOUR_SHEET_ID';
const API_KEY = 'YOUR_API_KEY';
const RANGE = '工作表1!A1:Z1000'; // 根據實際情況調整

async function fetchSheet() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.values || [];
}

function unique(arr) {
  return Array.from(new Set(arr));
}

async function setup() {
  const data = await fetchSheet();
  if (!data.length) return;

  const headers = data[0];
  const rows = data.slice(1);

  const lotIndex = headers.indexOf("停車場");
  const monthIndex = headers.indexOf("月份");

  const lots = unique(rows.map(r => r[lotIndex]));
  const months = unique(rows.map(r => r[monthIndex]));

  const lotSelect = document.getElementById("lot");
  const monthSelect = document.getElementById("month");

  lotSelect.innerHTML = lots.map(l => `<option>${l}</option>`).join("");
  monthSelect.innerHTML = months.map(m => `<option>${m}</option>`).join("");

  window.sheetHeaders = headers;
  window.sheetRows = rows;
  window.lotIndex = lotIndex;
  window.monthIndex = monthIndex;
}

function query() {
  const lot = document.getElementById("lot").value;
  const month = document.getElementById("month").value;
  const resultTable = document.getElementById("result");

  const filtered = window.sheetRows.filter(r =>
    r[window.lotIndex] === lot && r[window.monthIndex] === month
  );

  let html = "<tr>" + window.sheetHeaders.map(h => `<th>${h}</th>`).join("") + "</tr>";
  html += filtered.map(r => "<tr>" + r.map(c => `<td>${c}</td>`).join("") + "</tr>").join("");
  resultTable.innerHTML = html;
}

setup();

window.OW = [
  ['001','Estela Living, LLC'],['002','Estela Specs 1 LLC'],['003','Estela Specs 2 LLC'],
  ['004','Estela Specs 3 LLC'],['005','Estela Specs 4 LLC'],['006','Estela Specs 6 LLC'],
  ['007','Estela Specs 7 LLC'],['008','Estela Specs 8 LLC'],['009','Estela Specs 9 LLC'],
  ['100','Sabana Owner, LLC']
];
window.PMS = ['Michael Bedaw','Jason Bedaw','Jim Humphreys','Jon Frantz'];

function _gp() { try { return JSON.parse(localStorage.getItem('estela_permits_v3')||'[]'); } catch(e) { return []; } }
function _gs(p) {
  var ps = p.permitStatus || p.overallStatus || '';
  if (ps==='co') return 'co';
  if (ps==='permitted'||ps==='issued') return 'permitted';
  if (ps==='review'||ps==='resubmit') return 'review';
  if (ps==='applied'||ps==='submitted') return 'applied';
  return 'collecting';
}

window._patchFields = function() {
  document.querySelectorAll('.info-field').forEach(function(f) {
    var lbl = f.querySelector('.info-label');
    var inp = f.querySelector('input.info-input');
    if (!inp || inp.dataset.pf) return;
    var label = lbl ? lbl.textContent.trim() : '';
    if (label !== 'Project Manager' && label !== 'OWNER') return;
    inp.dataset.pf = '1';
    var onch = inp.getAttribute('onchange') || '';
    var cur = inp.value;
    var sel = document.createElement('select');
    sel.className = 'info-input';
    sel.style.cssText = 'width:100%;padding:4px 8px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;background:#fff;color:#1e293b';
    if (label === 'Project Manager') {
      sel.innerHTML = '<option value="">Select PM...</option>' +
        window.PMS.map(function(pm) {
          return '<option value="' + pm + '"' + (pm.toUpperCase() === cur.toUpperCase() ? ' selected' : '') + '>' + pm + '</option>';
        }).join('');
    } else {
      sel.innerHTML = '<option value="">Select owner...</option>' +
        window.OW.map(function(o) {
          return '<option value="' + o[0] + '"' + (o[0] === cur ? ' selected' : '') + '>' + o[0] + ' - ' + o[1] + '</option>';
        }).join('');
    }
    sel.addEventListener('change', function() {
      var newOnch = onch.replace(/this\.value/g, JSON.stringify(this.value));
      try { eval(newOnch); } catch(e) {}
    });
    inp.replaceWith(sel);
  });
};

window._showDrill = function(title, permits) {
  var existing = document.getElementById('_drillModal');
  if (existing) existing.remove();
  var modal = document.createElement('div');
  modal.id = '_drillModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10001;display:flex;align-items:center;justify-content:center;padding:16px';
  var tbody = document.createElement('tbody');
  permits.forEach(function(p, i) {
    var s = _gs(p);
    var colors = {
      collecting: ['#fef9c3','#854d0e'], applied: ['#dbeafe','#1e40af'],
      review: ['#fee2e2','#991b1b'], permitted: ['#dcfce7','#14532d'], co: ['#cffafe','#0e7490']
    };
    var c = colors[s] || ['#f1f5f9','#374151'];
    var labels = {collecting:'Collecting',applied:'Applied',review:'Under Review',permitted:'Permitted',co:'CO'};
    var tr = document.createElement('tr');
    tr.style.background = i%2===0 ? '#fff' : '#f9fafb';
    tr.innerHTML = [
      '<td style="padding:8px;color:#9ca3af;font-size:11px">' + (i+1) + '</td>',
      '<td style="padding:8px"><div style="font-weight:600">' + (p.address||'') + '</div><div style="font-size:11px;color:#9ca3af">Lot ' + (p.lotNumber||'') + '</div></td>',
      '<td style="padding:8px;font-size:12px">' + (p.community||'') + '</td>',
      '<td style="padding:8px;font-family:monospace;font-size:12px;color:#4f46e5">' + (p.permitNumber||'—') + '</td>',
      '<td style="padding:8px;font-size:12px">' + (p.model||'') + '</td>',
      '<td style="padding:8px;font-size:12px">' + (p.projectManager||'—') + '</td>',
      '<td style="padding:8px;font-size:11px;font-weight:700;color:#7c3aed">' + (p.owner||'—') + '</td>',
      '<td style="padding:8px"><span style="padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;background:' + c[0] + ';color:' + c[1] + '">' + (labels[s]||s) + '</span></td>'
    ].join('');
    tbody.appendChild(tr);
  });
  var closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.style.cssText = 'padding:6px 14px;background:#6b7280;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px';
  closeBtn.onclick = function() { modal.remove(); };
  var printBtn = document.createElement('button');
  printBtn.textContent = 'Print';
  printBtn.style.cssText = 'padding:6px 14px;background:#7c3aed;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600';
  printBtn.onclick = function() { window.print(); };
  var btnDiv = document.createElement('div');
  btnDiv.style.cssText = 'display:flex;gap:8px';
  btnDiv.appendChild(printBtn);
  btnDiv.appendChild(closeBtn);
  var header = document.createElement('div');
  header.style.cssText = 'padding:14px 20px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;background:#f8fafc;border-radius:12px 12px 0 0;flex-shrink:0';
  var titleEl = document.createElement('div');
  titleEl.innerHTML = '<strong>' + title + '</strong> <span style="color:#6b7280;font-size:13px">(' + permits.length + ' permits)</span>';
  header.appendChild(titleEl);
  header.appendChild(btnDiv);
  var table = document.createElement('table');
  table.style.cssText = 'width:100%;border-collapse:collapse';
  var thead = document.createElement('thead');
  thead.style.cssText = 'position:sticky;top:0;background:#f1f5f9';
  thead.innerHTML = '<tr>' + ['#','Address','Development','Permit#','Model','PM','Owner','Status'].map(function(h) {
    return '<th style="padding:10px;text-align:left;border-bottom:2px solid #e2e8f0;font-size:11px">' + h + '</th>';
  }).join('') + '</tr>';
  table.appendChild(thead);
  table.appendChild(tbody);
  var scrollDiv = document.createElement('div');
  scrollDiv.style.cssText = 'overflow-y:auto;flex:1';
  scrollDiv.appendChild(table);
  var inner = document.createElement('div');
  inner.style.cssText = 'background:#fff;border-radius:12px;width:100%;max-width:960px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 8px 40px rgba(0,0,0,.3)';
  inner.appendChild(header);
  inner.appendChild(scrollDiv);
  modal.appendChild(inner);
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  document.body.appendChild(modal);
};

window._msChange = function() {
  var sel = Array.from(document.querySelectorAll('#_ms_boxes input:checked')).map(function(i) { return i.value; });
  ['collecting','applied','review','permitted','co'].forEach(function(k) {
    var el = document.getElementById('_lbl_' + k);
    if (el) { el.style.borderColor = sel.indexOf(k) > -1 ? '#7c3aed' : '#e2e8f0'; el.style.background = sel.indexOf(k) > -1 ? '#ede9fe' : '#fff'; }
  });
  var ct = document.getElementById('_ms_count');
  if (ct) ct.textContent = sel.length ? _gp().filter(function(p) { return sel.indexOf(_gs(p)) > -1; }).length + ' permits match' : '';
};

window._msView = function() {
  var sel = Array.from(document.querySelectorAll('#_ms_boxes input:checked')).map(function(i) { return i.value; });
  var permits = _gp();
  var filtered = sel.length ? permits.filter(function(p) { return sel.indexOf(_gs(p)) > -1; }) : permits;
  var labels = {collecting:'Collecting Docs',applied:'Applied',review:'Under Review',permitted:'Permitted',co:'CO'};
  var title = sel.length ? sel.map(function(s) { return labels[s]; }).join(' + ') : 'All Permits';
  window._showDrill(title, filtered);
};

window._msPrint = function() { window._msView(); setTimeout(function() { window.print(); }, 600); };

window._addMS = function() {
  if (document.getElementById('_ms_status')) return;
  var content = document.getElementById('content');
  if (!content) return;
  var filterDiv = null;
  Array.from(content.children).forEach(function(el) { if (!filterDiv && el.textContent.indexOf('Community') > -1) filterDiv = el; });
  if (!filterDiv) return;
  var ms = document.createElement('div');
  ms.id = '_ms_status';
  ms.style.cssText = 'padding:12px 16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;margin:8px 0';
  var statusList = [
    ['collecting','Collecting Docs'],['applied','Applied'],['review','Under Review'],
    ['permitted','Permitted'],['co','CO Received']
  ];
  var boxesHtml = statusList.map(function(s) {
    return '<label id="_lbl_' + s[0] + '" style="display:flex;align-items:center;gap:5px;padding:5px 12px;border:2px solid #e2e8f0;border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;background:#fff">' +
      '<input type="checkbox" value="' + s[0] + '" onchange="window._msChange()"> ' + s[1] + '</label>';
  }).join('');
  ms.innerHTML = '<div style="font-size:11px;font-weight:700;color:#6b7280;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">Select Multiple Statuses</div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px" id="_ms_boxes">' + boxesHtml + '</div>' +
    '<div style="display:flex;gap:8px;align-items:center">' +
    '<button onclick="window._msView()" style="padding:7px 16px;background:#7c3aed;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer">View List</button>' +
    '<button onclick="window._msPrint()" style="padding:7px 16px;background:#2da44e;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer">Print</button>' +
    '<span id="_ms_count" style="font-size:12px;color:#6b7280;margin-left:8px"></span></div>';
  filterDiv.after(ms);
};

window._addCards = function() {
  var sec = document.querySelector('.report-section');
  if (!sec) return;
  Array.from(sec.querySelectorAll('div')).forEach(function(card) {
    if (card.dataset.dc) return;
    var kids = Array.from(card.children);
    var numEl = kids.filter(function(k) { return /^\d+$/.test(k.textContent.trim()) && parseInt(k.textContent.trim()) > 0; })[0];
    var lblEl = kids.filter(function(k) { return k.textContent.trim().length > 3 && !/^\d+$/.test(k.textContent.trim()); })[0];
    if (!numEl || !lblEl) return;
    var lbl = lblEl.textContent.trim();
    var permits = _gp();
    var filtered, title;
    if (lbl.indexOf('Total') > -1) { filtered = permits; title = 'All Permits'; }
    else if (lbl.indexOf('Collecting') > -1) { filtered = permits.filter(function(p) { return _gs(p)==='collecting'; }); title = 'Collecting Docs'; }
    else if (lbl.indexOf('Under Review') > -1) { filtered = permits.filter(function(p) { return _gs(p)==='review'; }); title = 'Under Review'; }
    else if (lbl.indexOf('Permit Issued') > -1) { filtered = permits.filter(function(p) { return _gs(p)==='permitted'; }); title = 'Permit Issued'; }
    else if (lbl.indexOf('CO') > -1) { filtered = permits.filter(function(p) { return _gs(p)==='co'; }); title = 'CO Received'; }
    else if (lbl.indexOf('Not Yet') > -1) { filtered = permits.filter(function(p) { return ['permitted','co'].indexOf(_gs(p)) === -1; }); title = 'Not Yet Approved'; }
    else return;
    card.dataset.dc = '1';
    card.style.cursor = 'pointer';
    card.title = 'Click to see permits';
    (function(f, t) { card.addEventListener('click', function() { window._showDrill(t, f); }); })(filtered, title);
  });
};

// Run every second - guaranteed to work regardless of timing
setInterval(function() {
  window._patchFields();
  window._addMS();
  window._addCards();
}, 1000);
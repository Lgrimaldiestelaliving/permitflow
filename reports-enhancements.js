// Reports Enhancements v3 - correct selectors for this app
(function() {
  function _getS(p) {
    var ps = p.permitStatus || p.overallStatus || '';
    if(ps==='co') return 'co';
    if(ps==='permitted'||ps==='issued') return 'permitted';
    if(ps==='review'||ps==='resubmit') return 'review';
    if(ps==='applied'||ps==='submitted') return 'applied';
    return 'collecting';
  }
  function _getPermits() {
    try { return JSON.parse(localStorage.getItem('estela_permits_v3')||'[]'); } catch(e){ return []; }
  }
  window._getS = _getS;
  window._msView = function() {
    var sel = Array.from(document.querySelectorAll('#_ms_boxes input:checked')).map(function(i){return i.value;});
    var permits = _getPermits();
    var filtered = sel.length ? permits.filter(function(p){return sel.includes(_getS(p));}) : permits;
    var label = sel.length ? sel.map(function(s){return {collecting:'Collecting Docs',applied:'Applied',review:'Under Review',permitted:'Permitted',co:'CO Received'}[s];}).join(' + ') : 'All Permits';
    _showDrill(label, filtered);
  };
  window._msPrint = function() { window._msView(); setTimeout(function(){window.print();}, 700); };
  window._msChange = function() {
    var sel = Array.from(document.querySelectorAll('#_ms_boxes input:checked')).map(function(i){return i.value;});
    ['collecting','applied','review','permitted','co'].forEach(function(k) {
      var el = document.getElementById('_lbl_'+k);
      if(el){ el.style.borderColor=sel.includes(k)?'#7c3aed':'#e2e8f0'; el.style.background=sel.includes(k)?'#ede9fe':'#fff'; }
    });
    var permits = _getPermits();
    var count = sel.length ? permits.filter(function(p){return sel.includes(_getS(p));}).length : 0;
    var ct = document.getElementById('_ms_count');
    if(ct) ct.textContent = sel.length ? count+' permits match' : '';
  };
  window._showDrill = function(title, permits) {
    var m = document.getElementById('_drill_modal'); if(m) m.remove();
    m = document.createElement('div');
    m.id = '_drill_modal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px';
    var rows = permits.map(function(p,i){
      var s=_getS(p);
      var bg=i%2===0?'#fff':'#f9fafb';
      var sc={collecting:'#fef9c3',applied:'#dbeafe',review:'#fee2e2',permitted:'#dcfce7',co:'#f3e8ff'}[s]||'#f1f5f9';
      var tc={collecting:'#854d0e',applied:'#1e40af',review:'#991b1b',permitted:'#14532d',co:'#6b21a8'}[s]||'#374151';
      var sl={collecting:'Collecting Docs',applied:'Applied',review:'Under Review',permitted:'Permitted',co:'CO'}[s]||s;
      return '<tr style="background:'+bg+'"><td style="padding:8px 12px;color:#9ca3af;font-size:11px">'+(i+1)+'</td><td style="padding:8px 12px"><div style="font-weight:600">'+(p.address||'')+'</div><div style="font-size:11px;color:#9ca3af">Lot '+(p.lotNumber||'')+'</div></td><td style="padding:8px 12px;font-size:12px">'+(p.community||'')+'</td><td style="padding:8px 12px;font-family:monospace;font-size:12px;color:#4f46e5">'+(p.permitNumber||'—')+'</td><td style="padding:8px 12px;font-size:12px">'+(p.model||'')+'</td><td style="padding:8px 12px;font-size:12px">'+(p.projectManager||'—')+'</td><td style="padding:8px 12px"><span style="padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;background:'+sc+';color:'+tc+'">'+sl+'</span></td></tr>';
    }).join('');
    m.innerHTML = '<div style="background:#fff;border-radius:12px;width:100%;max-width:900px;max-height:88vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 8px 40px rgba(0,0,0,.35)"><div style="padding:14px 20px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;background:#f8fafc"><div><strong style="font-size:15px">'+title+'</strong> <span style="color:#6b7280;font-size:13px">('+permits.length+' permits)</span></div><div style="display:flex;gap:8px"><button onclick="window.print()" style="padding:6px 14px;background:#7c3aed;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">Print</button><button onclick="document.getElementById('_drill_modal').remove()" style="padding:6px 14px;background:#6b7280;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px">Close</button></div></div><div style="overflow-y:auto;flex:1"><table style="width:100%;border-collapse:collapse;font-size:13px"><thead style="position:sticky;top:0;background:#f1f5f9"><tr><th style="padding:10px 12px;text-align:left;border-bottom:2px solid #e2e8f0">#</th><th style="padding:10px 12px;text-align:left;border-bottom:2px solid #e2e8f0">Address</th><th style="padding:10px 12px;text-align:left;border-bottom:2px solid #e2e8f0">Development</th><th style="padding:10px 12px;text-align:left;border-bottom:2px solid #e2e8f0">Permit #</th><th style="padding:10px 12px;text-align:left;border-bottom:2px solid #e2e8f0">Model</th><th style="padding:10px 12px;text-align:left;border-bottom:2px solid #e2e8f0">PM</th><th style="padding:10px 12px;text-align:left;border-bottom:2px solid #e2e8f0">Status</th></tr></thead><tbody>'+rows+'</tbody></table></div></div>';
    m.onclick = function(e){ if(e.target===m) m.remove(); };
    document.body.appendChild(m);
  };

  function injectPanel() {
    if(document.getElementById('_ms_status')) return;
    var content = document.getElementById('content');
    if(!content) return;
    var filterDiv = Array.from(content.children).find(function(el){ return el.textContent.includes('Market') || el.textContent.includes('Community'); });
    if(!filterDiv) { filterDiv = content; }
    var ms = document.createElement('div');
    ms.id = '_ms_status';
    ms.style.cssText = 'padding:12px 16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;margin:8px 0';
    ms.innerHTML = '<div style="font-size:11px;font-weight:700;color:#6b7280;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">Select Multiple Statuses to Report</div><div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px" id="_ms_boxes"><label id="_lbl_collecting" style="display:flex;align-items:center;gap:5px;padding:5px 12px;border:2px solid #e2e8f0;border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;background:#fff"><input type="checkbox" value="collecting" onchange="window._msChange()"> Collecting Docs</label><label id="_lbl_applied" style="display:flex;align-items:center;gap:5px;padding:5px 12px;border:2px solid #e2e8f0;border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;background:#fff"><input type="checkbox" value="applied" onchange="window._msChange()"> Applied</label><label id="_lbl_review" style="display:flex;align-items:center;gap:5px;padding:5px 12px;border:2px solid #e2e8f0;border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;background:#fff"><input type="checkbox" value="review" onchange="window._msChange()"> Under Review</label><label id="_lbl_permitted" style="display:flex;align-items:center;gap:5px;padding:5px 12px;border:2px solid #e2e8f0;border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;background:#fff"><input type="checkbox" value="permitted" onchange="window._msChange()"> Permitted</label><label id="_lbl_co" style="display:flex;align-items:center;gap:5px;padding:5px 12px;border:2px solid #e2e8f0;border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;background:#fff"><input type="checkbox" value="co" onchange="window._msChange()"> CO Received</label></div><div style="display:flex;gap:8px;align-items:center"><button onclick="window._msView()" style="padding:7px 16px;background:#7c3aed;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer">View Selected</button><button onclick="window._msPrint()" style="padding:7px 16px;background:#2da44e;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer">Print Selected</button><span id="_ms_count" style="font-size:12px;color:#6b7280"></span></div>';
    filterDiv.parentNode.insertBefore(ms, filterDiv.nextSibling || filterDiv);
    // Make number cards clickable
    document.querySelectorAll('.kpi-value,.stat-value,[class*="count"],[class*="number"]').forEach(function(el){
      if(el.dataset.dc) return; el.dataset.dc='1'; el.style.cursor='pointer'; el.title='Click to see list';
      el.addEventListener('click',function(e){
        e.stopPropagation();
        var txt=(el.closest('div')||el).textContent.toLowerCase();
        var permits=_getPermits(); var f=permits,t='All Permits';
        if(txt.includes('collect')){f=permits.filter(function(p){return _getS(p)==='collecting';});t='Collecting Docs';}
        else if(txt.includes('review')){f=permits.filter(function(p){return _getS(p)==='review';});t='Under Review';}
        else if(txt.includes('permit')&&!txt.includes('total')){f=permits.filter(function(p){return _getS(p)==='permitted';});t='Permitted';}
        else if(txt.includes('co ')&&!txt.includes('total')){f=permits.filter(function(p){return _getS(p)==='co';});t='CO Received';}
        _showDrill(t,f);
      });
    });
  }

  // Run when Reports view is active - observe DOM changes
  var obs = new MutationObserver(function(){ if(document.getElementById('content')) injectPanel(); });
  obs.observe(document.body,{childList:true,subtree:true});
  setTimeout(injectPanel,500);
  setInterval(injectPanel,1500);
})();
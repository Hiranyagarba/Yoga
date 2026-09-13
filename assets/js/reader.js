(() => {
  const P = window.PADA;
  const root = document.getElementById("sutras");
  const status = document.getElementById("status");
  const toc = document.getElementById("toc");
  const search = document.getElementById("search");
  const progress = document.getElementById("progress");
  const progressText = document.getElementById("progress-text");

  function esc(s){
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
            .replace(/"/g,"&quot;");
  }
  function inline(s){
    s=esc(s);
    s=s.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");
    s=s.replace(/`(.+?)`/g,"<code>$1</code>");
    return s;
  }
  function parseMarkdown(md){
    md=md.replace(/\r\n?/g,"\n").trim();
    const lines=md.split("\n");
    let title="", sutra="", body=[], mode="body";
    for(const raw of lines){
      const line=raw.trim();
      if(!line) { if(mode==="body") body.push(""); continue; }
      if(line.startsWith("# ")){ title=line.slice(2).replace(/\*\*/g,"").trim(); continue; }
      if(/^\*\*.*\|\|\s*\d+\.\d+\s*\|\|\*\*$/.test(line)){
        sutra=line.replace(/^\*\*|\*\*$/g,"").trim(); mode="sutra"; continue;
      }
      body.push(line.replace(/^\*\*|\*\*$/g,"").trim());
    }
    // Some source files wrap the Telugu sūtra across two lines. Reconstruct it.
    if(!sutra){
      const idx=body.findIndex(x=>/\|\|\s*3?\d+\.\d+\s*\|\|/.test(x));
      if(idx>=0){ sutra=body[idx]; body.splice(idx,1); }
    }
    return {title,sutra,body};
  }
  function getNumber(text,i){
    const m=text.match(/॥\s*([०-९]+|\d+)\.(\d+)\s*॥/);
    return m ? m[2] : String(i);
  }
  function render(parsed,i){
    const title=parsed.title || `Sūtra ${i}`;
    const m=title.match(/॥\s*([०-९]+)\.(\d+)\s*॥/);
    const n=m?m[2]:String(i);
    let sans=title.replace(/॥.*$/,"").replace(/\*\*/g,"").trim();
    if(!sans) sans=title;
    let tel=parsed.sutra || "";
    tel=tel.replace(/\*\*/g,"").trim();
    const paras=[];
    let cur=[];
    for(const x of parsed.body){
      if(!x){ if(cur.length){paras.push(cur.join(" "));cur=[];} }
      else cur.push(x);
    }
    if(cur.length) paras.push(cur.join(" "));
    const main=paras.shift() || "";
    const extras=paras.map(p=>`<p>${inline(p)}</p>`).join("");
    return `<section class="sutra" id="sutra-${n}" data-number="${n}">
      <div class="sutra-number">॥ ${esc(n)} ॥</div>
      <h2 class="sutra-sanskrit">${inline(sans)}</h2>
      <p class="sutra-telugu">${inline(tel)}</p>
      ${main?`<p class="sutra-meaning"><strong>${inline(main)}</strong></p>`:""}
      ${extras?`<div class="extra">${extras}</div>`:""}
    </section>`;
  }
  async function load(){
    const files=[];
    for(let i=1;i<=P.count;i++) files.push(`https://raw.githubusercontent.com/Hiranyagarba/Yoga/main/patanjali-yoga-sutras/${P.folder}/${P.prefix}${String(i).padStart(2,"0")}.md`);
    status.textContent=`Loading ${P.count} sūtras…`;
    const results=await Promise.all(files.map(async (url,i)=>{
      try{
        const r=await fetch(url,{cache:"no-store"});
        if(!r.ok) throw new Error(r.status);
        return {i:i+1, data:parseMarkdown(await r.text())};
      }catch(e){ return {i:i+1,error:true}; }
    }));
    const good=results.filter(x=>!x.error);
    if(!good.length){
      status.innerHTML=`<div class="empty">The sūtras could not be loaded. Check that the Markdown files are present in the <code>patanjali-yoga-sutras</code> folders on the <code>main</code> branch and that the repository is public.</div>`;
      return;
    }
    root.innerHTML=good.map(x=>render(x.data,x.i)).join("");
    status.textContent=`${good.length} sūtras`;
    toc.innerHTML=good.map(x=>{
      const n=(x.data.title.match(/॥\s*[०-९]+\.(\d+)\s*॥/)||[])[1]||x.i;
      return `<a href="#sutra-${n}" data-target="sutra-${n}">${n}</a>`;
    }).join("");
    const sections=[...document.querySelectorAll(".sutra")];
    const links=[...toc.querySelectorAll("a")];
    const io=new IntersectionObserver(entries=>{
      entries.forEach(en=>{
        if(en.isIntersecting){
          links.forEach(a=>a.classList.toggle("active",a.dataset.target===en.target.id));
        }
      });
    },{rootMargin:"-15% 0px -70% 0px"});
    sections.forEach(s=>io.observe(s));
    if(search){
      search.addEventListener("input",()=>{
        const q=search.value.trim().toLowerCase();
        sections.forEach(s=>s.classList.toggle("hidden",q && !s.textContent.toLowerCase().includes(q)));
      });
    }
    window.addEventListener("scroll",()=>{
      const max=document.documentElement.scrollHeight-innerHeight;
      const pct=max>0?Math.round(scrollY/max*100):0;
      progress.style.width=pct+"%"; progressText.textContent=pct+"%";
    });
  }
  load();
})();
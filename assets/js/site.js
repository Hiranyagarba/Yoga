(() => {
  const progress = document.querySelector('.progress');
  const top = document.querySelector('.backtop');
  function update(){
    const h=document.documentElement.scrollHeight-window.innerHeight;
    if(progress) progress.style.width=(h>0 ? (window.scrollY/h*100) : 0)+'%';
    if(top) top.hidden=window.scrollY<500;
  }
  addEventListener('scroll',update,{passive:true}); update();
  if(top) top.onclick=()=>scrollTo({top:0,behavior:'smooth'});
  const search=document.querySelector('.search');
  const items=[...document.querySelectorAll('.sutra')];
  if(search){
    search.addEventListener('input',()=>{
      const q=search.value.trim().toLowerCase();
      let n=0;
      items.forEach(x=>{
        const hit=!q || x.textContent.toLowerCase().includes(q);
        x.hidden=!hit; if(hit)n++;
      });
      const c=document.querySelector('.count');
      if(c)c.textContent=q?`${n} matching sūtras`:`${items.length} sūtras`;
    });
  }
})();

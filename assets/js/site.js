document.querySelectorAll(".nav-toggle").forEach(btn=>{
  btn.addEventListener("click",()=>btn.nextElementSibling.classList.toggle("open"));
});
document.querySelectorAll(".topnav a").forEach(a=>a.addEventListener("click",()=>{
  document.querySelector(".topnav")?.classList.remove("open");
}));
const topBtn=document.getElementById("top");
if(topBtn){
  window.addEventListener("scroll",()=>topBtn.classList.toggle("show",scrollY>500));
  topBtn.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
}

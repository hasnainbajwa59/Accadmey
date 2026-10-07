document.addEventListener("DOMContentLoaded",()=>{
const grid=document.getElementById("courseGrid"), search=document.getElementById("courseSearch"), cat=document.getElementById("categoryFilter"), level=document.getElementById("levelFilter"), duration=document.getElementById("durationFilter"), noResults=document.getElementById("noResults"), enrollCourse=document.getElementById("enrollCourse");

function render(list=courses){
 grid.innerHTML="";
 noResults.classList.toggle("d-none",list.length!==0);
 list.forEach((c,i)=>{
   const col=document.createElement("div"); col.className="col-md-6 col-xl-4 reveal";
   col.style.animationDelay=(i*.05)+"s";
   col.innerHTML=`<article class="course-card">
    <div class="course-image"><img src="${c.image}" alt="${c.title}" loading="lazy"><span class="course-badge">${c.category}</span><span class="discount">SALE</span></div>
    <div class="course-body"><div class="rating">★★★★★ <span>${c.rating}</span><em>(${c.students})</em></div>
    <h3>${c.title}</h3><p>${c.desc}</p>
    <div class="course-meta"><span><i class="fa-regular fa-clock"></i>${c.duration}</span><span><i class="fa-solid fa-signal"></i>${c.level}</span></div>
    <div class="course-bottom"><div><del>${c.oldFee}</del><strong>${c.fee}</strong></div><div class="course-actions"><button class="btn btn-sm btn-outline-custom" onclick="openCourse('${c.id}')">View Details</button><button class="btn btn-sm btn-primary-custom" onclick="selectCourse('${c.id}')">Enroll</button></div></div></div></article>`;
   grid.appendChild(col);
 });
}
function filter(){
 const q=search.value.toLowerCase().trim();
 const result=courses.filter(c=>(!q || [c.title,c.category,c.desc,c.instructor].join(" ").toLowerCase().includes(q))&&(!cat.value||c.category===cat.value)&&(!level.value||c.level===level.value)&&(!duration.value||c.duration===duration.value));
 render(result);
}
[search,cat,level,duration].forEach(el=>el.addEventListener("input",filter));
window.setCategory=(v)=>{cat.value=v;filter();};
window.openCourse=(id)=>window.open(`course-details.html?course=${encodeURIComponent(id)}`,"_blank","noopener");
window.selectCourse=(id)=>{document.getElementById("enroll").scrollIntoView({behavior:"smooth"});enrollCourse.value=id;showToast("Course selected — complete the enrollment form.");};
courses.forEach(c=>{const o=document.createElement("option");o.value=c.id;o.textContent=c.title;enrollCourse.appendChild(o);});
render();

const counters=document.querySelectorAll(".counter");
const counterObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting&&!e.target.dataset.done){e.target.dataset.done="1";const target=+e.target.dataset.target;let n=0;const step=Math.max(1,Math.ceil(target/60));const timer=setInterval(()=>{n=Math.min(target,n+step);e.target.textContent=n.toLocaleString();if(n>=target)clearInterval(timer)},22)}})},{threshold:.5});
counters.forEach(c=>counterObserver.observe(c));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.08});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

document.getElementById("enrollForm").addEventListener("submit",e=>{e.preventDefault();showToast("Enrollment request submitted successfully!");e.target.reset();});
window.showToast=(msg)=>{const t=document.getElementById("toast");t.querySelector("span").textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),3500);};

window.addEventListener("scroll",()=>document.getElementById("mainNav").classList.toggle("scrolled",scrollY>40));
setTimeout(()=>document.body.classList.add("loaded"),500);
});
/* SwiftDictionary U2.9.0 — non-transactional Premium information dialog. */
(() => {
  "use strict";
  const trigger=document.getElementById("premiumPlanOpen");
  const dialog=document.getElementById("premiumPlanDialog");
  const closeButtons=[...document.querySelectorAll("[data-premium-plan-close]")];
  if(!trigger||!dialog||!closeButtons.length)return;
  let previousFocus=null;
  function openDialog(){
    previousFocus=document.activeElement;
    dialog.classList.add("open");
    trigger.setAttribute("aria-expanded","true");
    document.body.style.overflow="hidden";
    closeButtons[0].focus();
  }
  function closeDialog(){
    if(!dialog.classList.contains("open"))return;
    dialog.classList.remove("open");
    trigger.setAttribute("aria-expanded","false");
    document.body.style.overflow="";
    if(previousFocus&&typeof previousFocus.focus==="function")previousFocus.focus();
  }
  trigger.addEventListener("click",openDialog);
  closeButtons.forEach(button=>button.addEventListener("click",closeDialog));
  dialog.addEventListener("click",event=>{if(event.target===dialog)closeDialog();});
  document.addEventListener("keydown",event=>{
    if(!dialog.classList.contains("open"))return;
    if(event.key==="Escape"){event.preventDefault();closeDialog();return;}
    if(event.key!=="Tab")return;
    const focusable=[...dialog.querySelectorAll('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')];
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  window.SWIFT_PREMIUM_INFO_DIALOG_READY=true;
})();

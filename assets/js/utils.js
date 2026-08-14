export function showToast(message, type) {
   var toast = document.createElement('div');
  toast.className = 'toast-msg ' + (type || 'success');
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(function() { toast.classList.add('show'); }, 10);
  setTimeout(function() { 
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

export function getGroupYears(minYear, selectedYear) {
  const groupStart =
    minYear + Math.floor((selectedYear - minYear) / 3) * 3;

  return [
    groupStart,
    groupStart + 1,
    groupStart + 2
  ];
}

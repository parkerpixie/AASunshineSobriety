const copyText = {
  announcements1: "Sunrises Online 7:30 am Zoom- Announcements and Reminders\n\nTo be added to the 730 FCS group e-mail list, send a request to rbrtbohanan52@gmail.com\n\nUse this link to contribute to FSC as encouraged by the 7th tradition. Select the ‘Donate’ option.\nhttps://fitchburgserenityclub.com/\n\nSign up to volunteer and lead this meeting. You can find the script here.\nhttps://www.signupgenius.com/go/5080e4aaca72ea2fe3-fsc730\nhttps://docs.google.com/document/d/19-EZ2bPWuKZj3j7DMF5KsOiZlLHwIXjWU8_DUU0-L0o/edit?pli=1&tab=t.0\n\nFSC 7:30 am Sunrisers Contact Google Sheet\nhttps://docs.google.com/spreadsheets/d/1KEbguEC6e_blwJB_oEo1ubpRI0QoKJOL/edit#gid=1732233350",

  announcements2: "Other Meetings\n\n24/7 AA Intergroup Zoom meetings\nhttps://aa-intergroup.org/meetings/\n\nAA Daily Reflection\nhttps://www.aa.org/daily-reflections\n\nWorldwide Secular Meetings\nhttps://www.worldwidesecularmeetings.com/\n\nFSC Resource Packet\nhttps://docs.google.com/document/d/1KSrapFkOkxkTzOV8fXPM66kBfkjXZWc-/edit?amp;ouid=107367626261618989098&amp;rtpof=true&amp;sd=true\n\nFSC Speaker Meeting - Last Sunday of each month - Please share your story.\nhttps://docs.google.com/spreadsheets/d/15B9vhuPxPeryDIu_pvGkiyNhheJsnlZ3ZRSi9T9MUG0/edit"
};

function copyBlock(key, successMessage) {
  const text = copyText[key];

  if (!text) {
    showToast("Nothing to copy yet");
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(successMessage))
      .catch(() => fallbackCopy(text, successMessage));
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  showToast(successMessage);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = "✅ " + message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

const navLinks = document.querySelectorAll(".nav a");
const sections = [...navLinks]
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

window.addEventListener("scroll", () => {
  let current = sections[0];

  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < 180) current = section;
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current.id);
  });
});
function copyAndOpen(blockId, detailsId, message) {
  copyBlock(blockId, message);

  const details = document.getElementById(detailsId);
  if (details) {
    details.open = true;
  }
}

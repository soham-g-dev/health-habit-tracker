document.addEventListener("DOMContentLoaded", () => {

  const stepsInput = document.getElementById("stepsInput");
  const sleepInput = document.getElementById("sleepInput");
  const addBtn = document.getElementById("addBtn");

  const stepsEl = document.getElementById("steps");
  const sleepEl = document.getElementById("sleep");
  const caloriesEl = document.getElementById("calories");

  const stepsProgress = document.getElementById("stepsProgress");
  const sleepProgress = document.getElementById("sleepProgress");

  const aiText = document.getElementById("aiText");
  const canvas = document.getElementById("activityChart");
  const ctx = canvas.getContext("2d");

  let data = JSON.parse(localStorage.getItem("health")) || {
    steps: 0,
    sleep: 0,
    weekly: [0,0,0,0,0,0,0]
  };

  function save() {
    localStorage.setItem("health", JSON.stringify(data));
  }

  function render() {
    const calories = Math.round(data.steps * 0.04);

    stepsEl.textContent = data.steps;
    sleepEl.textContent = data.sleep + "h";
    caloriesEl.textContent = calories;

    stepsProgress.value = Math.min((data.steps / 10000) * 100, 100);
    sleepProgress.value = Math.min((data.sleep / 8) * 100, 100);

    aiText.textContent =
      data.sleep < 7 ? "Sleep more 😴" :
      data.steps < 5000 ? "Walk more 🚶" :
      "Great health balance 🔥";

    drawGraph();
  }

  function drawGraph() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const max = Math.max(...data.weekly, 1000);

    data.weekly.forEach((val,i)=>{
      const h = (val/max)*180;
      const x = 60 + i*90;
      const y = 220 - h;

      ctx.fillStyle = "#7ac70c";
      ctx.fillRect(x, y, 50, h);

      ctx.fillStyle = "#000";
      ctx.fillText(days[i], x, 245);
    });
  }

  addBtn.onclick = () => {
    const steps = Number(stepsInput.value);
    const sleep = Number(sleepInput.value);

    if (!steps || !sleep) {
      alert("Enter valid values");
      return;
    }

    // ✅ FIX: ADD BOTH VALUES
    data.steps += steps;
    data.sleep += sleep;

    const day = new Date().getDay();
    const idx = day === 0 ? 6 : day - 1;
    data.weekly[idx] += steps;

    save();
    render();

    stepsInput.value = "";
    sleepInput.value = "";
  };

  render();
});

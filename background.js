chrome.action.onClicked.addListener((tab) => {
  if (tab.url && tab.url.includes("hevy.com/routines")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractStructuredRoutines
    });
  }
});

async function extractStructuredRoutines() {
  const CONFIG = {
    HOME_ROUTINES_CONTAINER: '[data-rbd-droppable-id="unsorted_routines"]',
    ROUTINE_LINK: 'a[href^="/routine/"]',
    TARGET_EXERCISE_CONTAINER: '.sc-42fff1f3-0.sc-44e0c7d2-0.sc-7600c742-5.bwRVVm.jMrQeE.jKZqEC',
    EXERCISE_TITLE_TAG: 'h5',
    EXERCISE_TEXT_TAG: 'p',
    WAIT_TIME_MS: 2500
  };

  const container = document.querySelector(CONFIG.HOME_ROUTINES_CONTAINER);
  if (!container) return alert("Error: Routines container not found on this page.");

  const links = container.querySelectorAll(CONFIG.ROUTINE_LINK);
  if (links.length === 0) return alert("Error: No routines found.");

  let extractedData = "";

  const loader = document.createElement("div");
  loader.style.cssText = "position:fixed; bottom:20px; right:20px; background:#222; color:#fff; padding:15px; border-radius:8px; z-index:99999;";
  document.body.appendChild(loader);

  const iframe = document.createElement('iframe');
  iframe.style.cssText = "position:absolute; width:0; height:0; border:0;";
  document.body.appendChild(iframe);

  for (let i = 0; i < links.length; i++) {
    const routineUrl = links[i].href;
    const titleEl = links[i].querySelector('h5');
    const routineName = titleEl ? titleEl.innerText : `Routine ${i + 1}`;
    
    loader.innerText = `Extracting: ${routineName} (${i + 1}/${links.length})... Please wait.`;
    
    let routineOutput = `=== ${routineName} ===\n\n`;

    iframe.src = routineUrl;
    
    await new Promise(resolve => {
      iframe.onload = () => setTimeout(resolve, CONFIG.WAIT_TIME_MS); 
    });

    try {
      const targetContainer = iframe.contentDocument.querySelector(CONFIG.TARGET_EXERCISE_CONTAINER);
      
      if (targetContainer) {
        const exerciseTitles = targetContainer.querySelectorAll(CONFIG.EXERCISE_TITLE_TAG);
        let exercisesOutput = [];

        if (exerciseTitles.length > 0) {
          exerciseTitles.forEach((titleNode) => {
            const exerciseNode = titleNode.parentElement;
            if (!exerciseNode) return;

            const name = titleNode.innerText.trim();
            let setsCount = "N/A";
            let restTime = "None";
            let description = "None";

            const paragraphs = exerciseNode.querySelectorAll(CONFIG.EXERCISE_TEXT_TAG);
            paragraphs.forEach(p => {
              const text = p.innerText.trim();
              const style = p.getAttribute('style') || "";
              
              if (style.includes('pre-wrap') || style.includes('pre-line')) {
                description = text;
              } 
              else if (text.toLowerCase().includes('rest')) {
                restTime = text.replace(/Rest\s*/i, '').trim() || text; 
              } 
              else if (text.toLowerCase().includes('sets') || text.toLowerCase().includes('reps')) {
                setsCount = text.split('·')[0].trim();
              }
            });

            let singleExercise = `\t--- ${name} ---\n`;
            
            singleExercise += `\t\tSets: ${setsCount}\n`;
            singleExercise += `\t\tRest Time: ${restTime}\n`;
            singleExercise += `\t\tDescription:\n`;
            
            let formattedDesc = "\t\t{\n";
            if (description !== "None") {
              formattedDesc += description.split('\n').map(line => `\t\t\t${line}`).join('\n') + "\n";
            } else {
              formattedDesc += "\t\t\tNone\n";
            }
            formattedDesc += "\t\t}";
            
            singleExercise += formattedDesc;
            exercisesOutput.push(singleExercise);
          });
          
          routineOutput += exercisesOutput.join("\n\n\n");

        } else {
          routineOutput += "\t[No exercises found inside the target container]\n";
        }
      } else {
        routineOutput += "\t[Target CSS container not found - check CONFIG classes]\n";
      }
    } catch(e) {
      routineOutput += `\t[Access Error: ${e.message}]\n`;
    }
    
    extractedData += routineOutput;
    
    if (i < links.length - 1) {
        extractedData += "\n\n\n\n\n";
    }
  }

  document.body.removeChild(iframe);
  loader.innerText = "Done! Downloading...";
  setTimeout(() => loader.remove(), 2000);

  const blob = new Blob([extractedData], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hevy_routines_backup_${new Date().toISOString().slice(0,10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
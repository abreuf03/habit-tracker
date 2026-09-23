// Function to calculate streaks
function calculateStreaks(dates){
    if (dates.length === 0) return { current: 0, longest: 0 };
    dates.sort();

    let longestRun = 1;
    let currentRun = 1;

    for(let i=1; i<dates.length;i++){
        const dayA = new Date(dates[i]);
        const dayB = new Date(dates[i-1]);
        let dif = (dayA - dayB) / (1000 * 60 * 60 * 24);
        
        if(dif == 1){
            currentRun++;
        }
        else{
            currentRun=1;
        }

        if(currentRun>longestRun){
            longestRun=currentRun;
        }
    }

    const today = new Date().toISOString().split('T')[0];  
    const lastDate = dates[dates.length - 1];
    let dif = (new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24);
    if(dif == 0 || dif == 1){
        return{current: currentRun, longest: longestRun}
    }
    else{
        return{current: 0, longest: longestRun};
    }

}

module.exports = { calculateStreaks };
const data = fetch('./final_data.json').then(response => response.json())

data.then(data => {
    
    // instructor name
    document.getElementById('data_instructor').innerHTML = data["שם המרצה"]

    // date
    document.getElementById('data_date').innerHTML = data["תאריך הסקר"] || "להוסיף תאריך!"

    // total participants
    document.getElementById('data_num_participants').innerHTML = data["מספר משתתפים"]
})



const data = fetch('./final_data.json').then((response) => response.json())

function createChart(canvasId, data, type = 'doughnut') {
    const ctx = document.getElementById(canvasId).getContext('2d')
    new Chart(ctx, {
        type: type,
        data: {
            labels: data.labels,
            datasets: [
                {
                    data: data.data,
                    backgroundColor: data.colors,
                    borderWidth: 2,
                    borderColor: '#fff',
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 13,
                        },
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return (
                                context.label +
                                ': ' +
                                context.parsed +
                                ' משתתפים'
                            )
                        },
                    },
                },
            },
        },
    })
}

function writeDataToElement(selector, data, defaultValue = 'No Data Found') {
    document.querySelectorAll(selector).forEach((element) => {
        element.innerHTML = data ? data : defaultValue
    })
}

data.then((data) => {
    // ##### Write Data to Elements #####

    // instructor name
    writeDataToElement('.data_instructor', data['שם המרצה'])

    // date
    writeDataToElement('.data_date', data['תאריך הסקר'])

    // number of participants
    writeDataToElement('.data_num_participants', data['מספר משתתפים'])

    // statistics
    writeDataToElement(
        '.data_recomendation_score',
        data['המלצה על הקורס לחברים']
    )
    writeDataToElement('.data_retake_score', data['בחירה חוזרת בקורס'])

    // threshold
    const highlightElement = document.querySelector('.data_above_threshold')
    if (!data['above_threshold']) {
        highlightElement.style.display = 'none'
    } else {
        highlightElement.innerHTML = `🎯 הקורס זוכה להערכה יוצאת דופן - כל הציונים מעל ${data['threshold']} מתוך 5! 🎯`
    }

    // ##### Create Charts #####

    function extractLabelsAndData(obj) {
        const labels = []
        const data = []

        for (const [key, value] of Object.entries(obj)) {
            labels.push(key)
            data.push(value)
        }

        return { labels, data }
    }

    const devidedData_expirience = extractLabelsAndData(data['וותק בהוראה'])
    const devidedData_misgarot = extractLabelsAndData(data['מסגרת חינוך'])
    const devidedData_stage = extractLabelsAndData(data['שלב חינוך'])
    const devidedData_supervision = extractLabelsAndData(data['פיקוח'])

    const surveyData = {
        experience: {
            labels: devidedData_expirience.labels,
            data: devidedData_expirience.data,
            colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
        },
        framework: {
            labels: devidedData_misgarot.labels,
            data: devidedData_misgarot.data,
            colors: ['#667eea', '#764ba2'],
        },
        stage: {
            labels: devidedData_stage.labels,
            data: devidedData_stage.data,
            colors: ['#4facfe', '#00f2fe', '#a8edea', '#fed6e3'],
        },
        supervision: {
            labels: devidedData_supervision.labels,
            data: devidedData_supervision.data,
            colors: ['#d299c2', '#fef9d7'],
        },
    }

    createChart('experienceChart', surveyData.experience)
    createChart('frameworkChart', surveyData.framework)
    createChart('stageChart', surveyData.stage)
    createChart('supervisionChart', surveyData.supervision)

    // ##### Create Bar Chart for Ratings #####

    const ratingsData = {
        'יכולת ליישם את הנלמד בתפקיד': data['יכולת ליישם את הנלמד בתפקיד'],
        'קידום נושאים בעקבות הלמידה': data['קידום נושאים בעקבות הלמידה'],
        'חקר הצלחות כחלק מהחיבור לשטח': data['חקר הצלחות כחלק מהחיבור לשטח'],
        'אפשרות העמקה בנושא מעניין': data['אפשרות העמקה בנושא מעניין'],
        'התעוררות שאלות חדשות וסקרנות': data['התעוררות שאלות חדשות וסקרנות'],
        'למידה פעילה ושיתופית': data['למידה פעילה ושיתופית'],
        'שיפור איכות ההוראה': data['שיפור איכות ההוראה'],
        'התנסות במגוון דרכי למידה': data['התנסות במגוון דרכי למידה'],
        'הזדמנויות לבחירה ועבודה עצמית במהלך הלמידה':
            data['הזדמנויות לבחירה ועבודה עצמית במהלך הלמידה'],
        'בחירה חוזרת בקורס': data['בחירה חוזרת בקורס'],
        'המלצה על הקורס לחברים': data['המלצה על הקורס לחברים'],
    }

    const getColor = (score) => {
        if (score >= 4.7) return '#4caf50'
        if (score >= 4) return '#2196f3'
        if (score >= 3) return '#ff9800'
        return '#f03a30'
    }

    const ratings = Object.entries(ratingsData)
        .map(([text, score]) => ({
            text,
            score,
            color: getColor(score),
        }))
        .sort((a, b) => b.score - a.score)

    const container = document.getElementById('ratingsContainer')

    // חלוקה לשתי עמודות
    const leftColumn = document.createElement('div')
    const rightColumn = document.createElement('div')

    ratings.forEach((rating, index) => {
        const ratingItem = document.createElement('div')
        ratingItem.className = 'rating-item'

        const percentage = (rating.score / 5) * 100

        ratingItem.innerHTML = `
                    <div class="rating-text">${rating.text}</div>
                    <div class="rating-bar">
                        <div class="rating-fill" style="width: 0%; background: ${rating.color};"></div>
                    </div>
                    <div class="rating-score" style="color: ${rating.color};">${rating.score}</div>
                `

        // חלוקה בין העמודות
        if (index < Math.ceil(ratings.length / 2)) {
            leftColumn.appendChild(ratingItem)
        } else {
            rightColumn.appendChild(ratingItem)
        }

        // אנימציה מתעכבת
        setTimeout(() => {
            ratingItem.querySelector(
                '.rating-fill'
            ).style.width = `${percentage}%`
        }, (index % Math.ceil(ratings.length / 2)) * 150 + 500)
    })

    container.appendChild(leftColumn)
    container.appendChild(rightColumn)


    // ##### Create Feedbacks #####
})

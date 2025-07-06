
import pandas as pd
import numpy as np
import json
from pprint import pprint
import random
import string
import os
import shutil


instructor_name_hebrew = "שי אשכנזי"
instructor_name_english = "Shay Ashkenazi"
threshold = 4.5

# Generate a random directory name based on the instructor's name and a random string
dirName = instructor_name_english.replace(" ", "_") + "_" +  ''.join(random.choices(string.ascii_letters + string.digits, k=20))
parent_dir = os.path.dirname(os.getcwd())

# Function to analyze the data
def analyze_data(df: pd.DataFrame):

    numerical_col2 = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = [ 'וותק בהוראה', 'מסגרת חינוך', 'שלב חינוך', 'מגזר', 'פיקוח', 'מחוז']


    means = df[numerical_col2].mean()
    final_data = {key: round(val,2) for key, val in means.to_dict().items()}
    final_data["threshold"] = threshold
    final_data["above_threshold"] = sum(1 for val in final_data.values() if val >= threshold) == len(numerical_col2)
    # Count value occurrences for each categorical column
    for col in categorical_cols:
        final_data[col]=df[col].value_counts(dropna=False).to_dict()
    
    final_data['מספר משתתפים']=len(df)
    final_data["שם המרצה"] = instructor_name_hebrew
    final_data['שם הקורס'] = df['שם הקורס בו השתתפת'][0]
    feedbacks = df['בנימה אישית, רציתי לאמר ש.......'].tolist()
    feedbacks = [feedback.replace('\n', ' ') for feedback in feedbacks if pd.notna(feedback)]
    final_data['משובים מילוליים מהמשתתפים'] = feedbacks
    dir_path = os.path.join(parent_dir, 'courses/' + dirName)
    print(dir_path)
    if not os.path.exists(dir_path):
        os.mkdir(dir_path)
    with open(os.path.join(dir_path, 'final_data.json'), 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False)
    
    src=os.getcwd()
    shutil.copy(os.path.join(src,"index.html"),dir_path)
    shutil.copy(os.path.join(src,"script.js"),dir_path)
    os.remove(os.path.join(src,"data.xlsx"))



if __name__ == "__main__":

    df = pd.read_excel("./data.xlsx")
    new_cols = {'1. אני יכול.ה ליישם ולהשתמש במה שלמדתי במסגרת תפקידי':"יכולת ליישם את הנלמד בתפקיד",
    '2. אני מקדם נושאים בביה"ס/ בכתה/ בגני הילדים בעקבות הלמידה': 'קידום נושאים בעקבות הלמידה',
    '3. במפגשים חקרנו הצלחות/ פעולות כחלק מהחיבור לעבודה בשטח':'חקר הצלחות כחלק מהחיבור לשטח',
    '4. הלמידה זימנה לי אפשרות העמקה בנושא שעניין אותי':'אפשרות העמקה בנושא מעניין',
    '5. התעוררו בי שאלות חדשות וסקרנות על החומר הנלמד':'התעוררות שאלות חדשות וסקרנות',
    '6. הלמידה הייתה פעילה ושיתופית':'למידה פעילה ושיתופית',
    '7. בעקבות התהליכים שעברתי, שיפרתי את איכות ההוראה שלי':'שיפור איכות ההוראה',
    '8. התנסתי במגוון דרכי למידה (עבודה בקבוצות, תרגול, התנסות ושימוש באמצעים טכנולוגים")':'התנסות במגוון דרכי למידה',
    '9. בתהליך הלמידה, היו לי מגוון הזדמנויות לבחירה ולעבודה עצמית':'הזדמנויות לבחירה ועבודה עצמית במהלך הלמידה',
    '10. במידה והיית צריך.ה לבחור מחדש, היית בוחר.ת לחזור על הקורס/ תהליך הלמידה':'בחירה חוזרת בקורס',
    '11. באיזו מידה תמליץ לחברך על קורס זה':'המלצה על הקורס לחברים',
    'מסגרת חינוך בהן את/ה מלמד/ת':'מסגרת חינוך',
    'באיזה שלב חינוך את/ה מלמד/ת  ברוב שעות ההוראה שלך':'שלב חינוך',
    'לאיזה מחוז את/ה שייך.כת?':'מחוז'
    }
    df.rename(columns=new_cols, inplace=True)
    analyze_data(df)

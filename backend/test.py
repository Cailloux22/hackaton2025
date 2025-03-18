from datetime import datetime

def isToday(date: str) -> bool:
    datetime_object = datetime.strptime(date, '%Y-%m-%d %H:%M:%S').date()
    today = datetime.now().date()
    return datetime_object == today 

print(isToday("2025-03-18 19:15:00"))
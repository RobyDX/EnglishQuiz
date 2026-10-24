"""A1 reading passages (true-false) built from fact sheets: every statement is true or false by construction.

False statements only change single-valued facts (age, time, colour, number, name, place of residence, ...),
so that the passage always contradicts them explicitly.
"""
from core import new_question

LEVEL = 'A1'
MIN_WORDS = 40
FEM = ['Anna', 'Maria', 'Sara', 'Emma', 'Lucy', 'Mia', 'Nina', 'Sofia', 'Laura', 'Julia', 'Ella', 'Rosa', 'Kate', 'Alice',
       'Chloe', 'Hana', 'Yuki', 'Lina', 'Zoe', 'Eva', 'Amy', 'Ruby', 'Clara', 'Lea', 'Nora', 'Iris', 'Tina', 'Vera']
MAS = ['Tom', 'Ben', 'Jack', 'Leo', 'Max', 'Sam', 'Adam', 'Dan', 'Paul', 'Mark', 'Ravi', 'Omar', 'Luca', 'Pablo', 'Kenji',
       'Ali', 'Noah', 'Ian', 'Joe', 'Ryan', 'Hugo', 'Felix', 'Oscar', 'Victor', 'Carlos', 'Peter', 'Sean', 'Karl']
CITIES = ['London', 'Paris', 'Rome', 'Madrid', 'Berlin', 'Tokyo', 'Sydney', 'Dublin', 'Lisbon', 'Athens', 'Toronto', 'Vienna']
TIMES = ["six o'clock", "half past six", "seven o'clock", "half past seven", "eight o'clock", "half past eight", "nine o'clock"]
EVENING_TIMES = ["eight o'clock", "half past eight", "nine o'clock", "half past nine", "ten o'clock"]
LUNCH_TIMES = ["twelve o'clock", "half past twelve", "one o'clock", "half past one", "two o'clock"]
COLOURS = ['blue', 'green', 'yellow', 'white', 'red', 'pink', 'purple', 'orange']
NUMS = {2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve',
        13: 'thirteen', 14: 'fourteen', 15: 'fifteen', 16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty'}

FILLERS = {
    'profile': ["I go to school every day and I love my friends.", "My room is small, but I like it a lot.", "We are a happy family and we often play games together."],
    'routine': ["{He} loves school and {his} teachers are very kind.", "It is a busy day, but {he} is always happy.", "{He} has many friends and likes {his} class."],
    'lunch': ["Everybody talks and laughs at the table.", "It is the best meal of the week for the whole family.", "The kitchen is full of nice smells on that day."],
    'bedroom': ["It is a quiet and comfortable place.", "{He} often reads there before going to sleep.", "{He} loves the room because it is warm and bright."],
    'party': ["Everybody sings and dances, and the afternoon is full of fun.", "The garden is full of balloons and music.", "All the children say it is a wonderful day."],
    'shopping': ["The streets are busy and the sun is bright.", "It is a long day, but {he} enjoys every minute.", "There are many people and many beautiful things."],
    'town': ["It is a quiet and friendly place.", "Everybody in the town knows {name}.", "The streets are clean and the people are kind."],
    'holiday': ["The sea is warm and the people are friendly.", "It is a beautiful trip and {he} is very happy.", "The weather is good and {he} sleeps well."],
    'sport': ["The players are friendly and the coach is kind.", "{He} is tired after the game, but very happy.", "It is a great way to stay strong."],
    'hobby': ["It makes {him} feel calm and happy.", "{His} family likes to see the results.", "{He} wants to be better every week."],
    'job': ["It is a hard job, but {he} likes it a lot.", "{His} colleagues are friendly and helpful.", "{He} is tired in the evening, but happy."],
    'school': ["{He} likes school and has many good friends there.", "The teachers are kind and the classes are interesting.", "{He} always does {his} homework in the evening."],
    'office': ["The office is big and quiet, and {his} colleagues are nice.", "{He} likes the job because it is never boring.", "It is a busy place, but everybody helps each other."],
    'animal': ["It is an interesting animal.", "Children often ask many questions about it.", "Scientists study this animal to learn more."],
    'weather': ["The streets are full of people all day.", "It is a good time to go out and see the city.", "The weather changes a lot during the year."],
    'health': ["{His} mother looks after {him} and makes some soup.", "{He} wants to feel better soon.", "{His} friends call {him} every day."],
    'nature': ["It is a quiet and beautiful place.", "The air is clean and the water is clear.", "{He} says that nature is a gift for everybody."],
}


def person(rng):
    fem = rng.random() < 0.5
    name = rng.choice(FEM if fem else MAS)
    return {'name': name, 'He': 'She' if fem else 'He', 'he': 'she' if fem else 'he', 'his': 'her' if fem else 'his',
            'His': 'Her' if fem else 'His', 'him': 'her' if fem else 'him'}


def other(rng, value, options):
    return rng.choice([o for o in options if o != value])


def finish(rng, cat, passage, facts, topic_note, p=None):
    """facts: list of (true statement, [false statements], supporting words). Picks 3 and mixes true / false."""
    if len(facts) < 3:
        return None
    passage = passage + ' ' + ' '.join(f.format(**(p or {})) for f in rng.sample(FILLERS[topic_note], 2))
    chosen = rng.sample(facts, 3)
    answers = rng.choice([(True, False, False), (False, True, False), (False, False, True),
                          (True, True, False), (True, False, True), (False, True, True)])
    statements, support = [], []
    for (true_s, false_list, sup), ans in zip(chosen, answers):
        statements.append({'text': true_s if ans else rng.choice(false_list), 'answer': ans})
        support.append(sup)
    words = len(passage.split())
    if not MIN_WORDS <= words <= 75:
        return None
    explanation = 'The text says: ' + ', '.join(f'"{s}"' for s in support) + '.'
    return new_question(LEVEL, 'true-false', 'reading', [cat], 'Read the text and decide if each sentence is true or false.',
                        explanation, passage=passage, statements=statements)


# ---- everyday life ----------------------------------------------------------------------------------------

def t_profile(rng):
    p = person(rng)
    age = rng.randint(7, 15)
    city = rng.choice(CITIES)
    members = rng.sample(['mother', 'father', 'sister', 'brother', 'grandmother', 'grandfather', 'aunt', 'uncle'], rng.choice([2, 3, 4]))
    k = len(members) + 1
    pet = rng.choice(['dog', 'cat', 'rabbit', 'hamster', 'parrot', 'goldfish'])
    food = rng.choice(['pizza', 'pasta', 'rice', 'soup', 'chicken', 'fish', 'cheese sandwiches'])
    listing = ', '.join(f'my {m}' for m in members[:-1]) + f' and my {members[-1]}'
    passage = (f"My name is {p['name']}. I am {NUMS.get(age, str(age))} years old and I live in {city}. "
               f"There are {NUMS[k]} people in my family: {listing} and me. I have a {pet}. My favourite food is {food}.")
    foods = ['pizza', 'pasta', 'rice', 'soup', 'chicken', 'fish', 'cheese sandwiches']
    pets = ['dog', 'cat', 'rabbit', 'hamster', 'parrot', 'goldfish']
    facts = [
        (f"I am {NUMS.get(age, str(age))} years old.", [f"I am {NUMS.get(age + 1, str(age + 1))} years old.", f"I am {NUMS.get(age - 1, str(age - 1))} years old."], f"I am {NUMS.get(age, str(age))} years old"),
        (f"I live in {city}.", [f"I live in {other(rng, city, CITIES)}."], f"I live in {city}"),
        (f"There are {NUMS[k]} people in my family.", [f"There are {NUMS[k + 1]} people in my family.", f"There are {NUMS[k - 1]} people in my family."], f"There are {NUMS[k]} people in my family"),
        (f"I have a {pet}.", [f"I have a {other(rng, pet, pets)}."], f"I have a {pet}"),
        (f"My favourite food is {food}.", [f"My favourite food is {other(rng, food, foods)}."], f"My favourite food is {food}"),
    ]
    return finish(rng, 'everyday-life', passage, facts, 'profile', locals().get('p'))


def t_routine(rng):
    p = person(rng)
    age = rng.randint(8, 15)
    up = rng.choice(TIMES)
    bed = rng.choice(EVENING_TIMES)
    tr = rng.choice(['bus', 'bike', 'train', 'car'])
    breakfast = rng.choice(['cereal', 'toast', 'an egg', 'bread and jam', 'a banana'])
    evening = rng.choice(['watches TV', 'plays games', 'reads a book', 'plays the guitar'])
    passage = (f"{p['name']} is {NUMS.get(age, str(age))}. {p['He']} gets up at {up} and has {breakfast} for breakfast. "
               f"{p['He']} goes to school by {tr}. In the evening {p['he']} {evening}. {p['He']} goes to bed at {bed}.")
    trs = ['bus', 'bike', 'train', 'car']
    facts = [
        (f"{p['name']} gets up at {up}.", [f"{p['name']} gets up at {other(rng, up, TIMES)}."], f"{p['He']} gets up at {up}"),
        (f"{p['name']} goes to school by {tr}.", [f"{p['name']} goes to school by {other(rng, tr, trs)}."], f"goes to school by {tr}"),
        (f"{p['name']} goes to bed at {bed}.", [f"{p['name']} goes to bed at {other(rng, bed, EVENING_TIMES)}."], f"goes to bed at {bed}"),
        (f"{p['name']} is {NUMS.get(age, str(age))}.", [f"{p['name']} is {NUMS.get(age + 1, str(age + 1))}."], f"{p['name']} is {NUMS.get(age, str(age))}"),
    ]
    return finish(rng, 'everyday-life', passage, facts, 'routine', locals().get('p'))


def t_lunch(rng):
    p = person(rng)
    time = rng.choice(LUNCH_TIMES)
    dish = rng.choice(['chicken and potatoes', 'pasta with tomato sauce', 'fish and rice', 'soup and bread', 'pizza', 'beef and carrots'])
    drink = rng.choice(['water', 'juice', 'lemonade', 'milk'])
    dessert = rng.choice(['ice cream', 'cake', 'apple pie', 'fruit'])
    who = rng.choice(['mother', 'father', 'grandmother', 'grandfather'])
    passage = (f"On Sunday, {p['name']}'s family has lunch at {time}. {p['His']} {who} cooks {dish}. "
               f"They always drink {drink} with lunch. After lunch they always eat {dessert}.")
    dishes = ['chicken and potatoes', 'pasta with tomato sauce', 'fish and rice', 'soup and bread', 'pizza', 'beef and carrots']
    facts = [
        (f"The family has lunch at {time}.", [f"The family has lunch at {other(rng, time, LUNCH_TIMES)}."], f"has lunch at {time}"),
        (f"{p['His']} {who} cooks {dish}.", [f"{p['His']} {who} cooks {other(rng, dish, dishes)}."], f"{who} cooks {dish}"),
        (f"They always drink {drink}.", [f"They always drink {other(rng, drink, ['water', 'juice', 'lemonade', 'milk'])}."], f"always drink {drink}"),
        (f"They always eat {dessert} after lunch.", [f"They always eat {other(rng, dessert, ['ice cream', 'cake', 'apple pie', 'fruit'])} after lunch."], f"always eat {dessert}"),
    ]
    return finish(rng, 'everyday-life', passage, facts, 'lunch', locals().get('p'))


def t_bedroom(rng):
    p = person(rng)
    size = rng.choice(['small', 'big'])
    colour = rng.choice(COLOURS)
    n = rng.randint(3, 9)
    items = rng.choice(['books', 'pictures', 'toys', 'plants'])
    furn = rng.choice(['desk', 'bed', 'sofa'])
    passage = (f"{p['name']}'s bedroom is {size}. The walls are {colour}. There is a {furn} next to the window. "
               f"There are {NUMS[n]} {items} on the shelf. {p['He']} sleeps in this room every night.")
    facts = [
        (f"The walls in the bedroom are {colour}.", [f"The walls in the bedroom are {other(rng, colour, COLOURS)}."], f"The walls are {colour}"),
        (f"The bedroom is {size}.", [f"The bedroom is {'big' if size == 'small' else 'small'}."], f"bedroom is {size}"),
        (f"There are {NUMS[n]} {items} on the shelf.", [f"There are {NUMS[n + 2]} {items} on the shelf.", f"There are {NUMS[n - 1] if n > 3 else NUMS[n + 3]} {items} on the shelf."], f"There are {NUMS[n]} {items} on the shelf"),
    ]
    facts.append((f"{p['name']} sleeps in this room.", [f"{p['name']} sleeps in the kitchen."], f"{p['He']} sleeps in this room"))
    return finish(rng, 'everyday-life', passage, facts, 'bedroom', locals().get('p'))


def t_party(rng):
    p = person(rng)
    month = rng.choice(['January', 'March', 'May', 'June', 'August', 'October', 'December'])
    age = rng.randint(7, 14)
    n = rng.randint(3, 10)
    cake = rng.choice(['chocolate', 'strawberry', 'lemon', 'banana'])
    months = ['January', 'March', 'May', 'June', 'August', 'October', 'December']
    passage = (f"{p['name']}'s birthday is in {month}. {p['He']} is {NUMS[age]} today. {p['He']} invites {NUMS[n]} friends to the party. "
               f"They eat a big {cake} cake and play games in the garden.")
    cakes = ['chocolate', 'strawberry', 'lemon', 'banana']
    facts = [
        (f"{p['name']}'s birthday is in {month}.", [f"{p['name']}'s birthday is in {other(rng, month, months)}."], f"birthday is in {month}"),
        (f"{p['name']} is {NUMS[age]} today.", [f"{p['name']} is {NUMS[age + 1]} today."], f"is {NUMS[age]} today"),
        (f"{p['name']} invites {NUMS[n]} friends.", [f"{p['name']} invites {NUMS[n + 2]} friends."], f"invites {NUMS[n]} friends"),
        (f"The cake is a {cake} cake.", [f"The cake is a {other(rng, cake, cakes)} cake."], f"a big {cake} cake"),
    ]
    return finish(rng, 'everyday-life', passage, facts, 'party', locals().get('p'))


def t_shopping(rng):
    p = person(rng)
    item = rng.choice(['jacket', 'dress', 'shirt', 'hat', 'bag', 'pair of shoes'])
    colour = rng.choice(COLOURS)
    price = rng.choice([8, 10, 12, 15, 18, 20, 25, 30])
    day = rng.choice(['Saturday', 'Friday', 'Sunday'])
    days = ['Saturday', 'Friday', 'Sunday']
    passage = (f"On {day}, {p['name']} goes to the shopping centre with {p['his']} mother. {p['He']} wants a new {item}. "
               f"{p['He']} finds a {colour} one in a small shop. It costs {NUMS.get(price, str(price))} euros. {p['He']} buys it and is very happy.")
    facts = [
        (f"{p['name']} goes shopping on {day}.", [f"{p['name']} goes shopping on {other(rng, day, days)}."], f"On {day}"),
        (f"{p['name']} buys a {colour} {item}.", [f"{p['name']} buys a {other(rng, colour, COLOURS)} {item}."], f"a {colour} one"),
        (f"It costs {price} euros.", [f"It costs {price + 5} euros.", f"It costs {price + 10} euros."], f"costs {NUMS.get(price, str(price))} euros"),
    ]
    facts.append((f"{p['name']} goes with {p['his']} mother.", [f"{p['name']} goes with {p['his']} father."], f"with {p['his']} mother"))
    return finish(rng, 'everyday-life', passage, facts, 'shopping', locals().get('p'))


# ---- travel, places, leisure -------------------------------------------------------------------------

def t_town(rng):
    p = person(rng)
    places = rng.sample(['hospital', 'café', 'park', 'museum', 'market', 'station', 'cinema', 'school', 'bank', 'library'], 5)
    a, b, c, d, e = places
    n = rng.randint(2, 8)
    passage = (f"{p['name']} lives in a small town. In the town there is a {a}, a {b} and a {c}. "
               f"The {a} is next to the {b}. The {d} is in front of the {e}. There are {NUMS[n]} shops in the main street.")
    facts = [
        (f"The {a} is next to the {b}.", [f"The {a} is far from the {b}."], f"The {a} is next to the {b}"),
        (f"The {d} is in front of the {e}.", [f"The {d} is behind the {e}."], f"The {d} is in front of the {e}"),
        (f"There are {NUMS[n]} shops in the main street.", [f"There are {NUMS[n + 2]} shops in the main street.", f"There are {NUMS[n + 1]} shops in the main street."], f"There are {NUMS[n]} shops in the main street"),
        (f"{p['name']} lives in a small town.", [f"{p['name']} lives in a big city."], f"lives in a small town"),
    ]
    return finish(rng, 'travel-places-leisure', passage, facts, 'town', locals().get('p'))


def t_holiday(rng):
    p = person(rng)
    country = rng.choice(['Spain', 'Italy', 'Greece', 'France', 'Portugal', 'Turkey', 'Mexico', 'Egypt'])
    month = rng.choice(['June', 'July', 'August', 'September'])
    tr = rng.choice(['plane', 'train', 'bus', 'car'])
    days = rng.randint(4, 12)
    stay = rng.choice(['hotel', 'tent', 'small flat'])
    countries = ['Spain', 'Italy', 'Greece', 'France', 'Portugal', 'Turkey', 'Mexico', 'Egypt']
    passage = (f"{p['name']} goes to {country} in {month}. {p['He']} travels by {tr}. "
               f"{p['He']} stays in a {stay} for {NUMS[days]} days. Every day {p['he']} goes to the beach and takes photos.")
    facts = [
        (f"{p['name']} goes to {country}.", [f"{p['name']} goes to {other(rng, country, countries)}."], f"goes to {country}"),
        (f"{p['name']} travels by {tr}.", [f"{p['name']} travels by {other(rng, tr, ['plane', 'train', 'bus', 'car'])}."], f"travels by {tr}"),
        (f"{p['name']} stays for {NUMS[days]} days.", [f"{p['name']} stays for {NUMS[days + 3]} days."], f"for {NUMS[days]} days"),
        (f"The holiday is in {month}.", [f"The holiday is in {other(rng, month, ['June', 'July', 'August', 'September'])}."], f"in {month}"),
    ]
    return finish(rng, 'travel-places-leisure', passage, facts, 'holiday', locals().get('p'))


def t_sport(rng):
    p = person(rng)
    sport = rng.choice(['tennis', 'football', 'basketball', 'volleyball', 'hockey', 'swimming'])
    day1, day2 = rng.sample(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 2)
    place = rng.choice(['park', 'school', 'sports centre'])
    friends = rng.randint(2, 6)
    sports = ['tennis', 'football', 'basketball', 'volleyball', 'hockey', 'swimming']
    verb = 'goes' if sport == 'swimming' else 'plays'
    passage = (f"{p['name']} loves {sport}. {p['He']} {verb} {sport if sport != 'swimming' else 'swimming'} on {day1} and {day2} at the {place}. "
               f"{p['He']} {'swims' if sport == 'swimming' else 'plays'} with {NUMS[friends]} friends. They always have fun and then eat ice cream.")
    facts = [
        (f"{p['name']} loves {sport}.", [f"{p['name']} loves {other(rng, sport, sports)}."], f"loves {sport}"),
        (f"{p['name']} does this on {day1}.", [f"{p['name']} does this on Sunday."], f"on {day1} and {day2}"),
        (f"{p['name']} does this at the {place}.", [f"{p['name']} does this at the {other(rng, place, ['park', 'school', 'sports centre'])}."], f"at the {place}"),
        (f"{p['name']} does it with {NUMS[friends]} friends.", [f"{p['name']} does it with {NUMS[friends + 2]} friends."], f"with {NUMS[friends]} friends"),
    ]
    return finish(rng, 'travel-places-leisure', passage, facts, 'sport', locals().get('p'))


def t_hobby(rng):
    p = person(rng)
    hobby = rng.choice(['drawing', 'reading', 'cooking', 'dancing', 'singing', 'fishing', 'painting', 'gardening'])
    hobbies = ['drawing', 'reading', 'cooking', 'dancing', 'singing', 'fishing', 'painting', 'gardening']
    hours = rng.randint(2, 5)
    day = rng.choice(['Saturday', 'Sunday'])
    place = rng.choice(['room', 'garden', 'kitchen'])
    passage = (f"{p['name']}'s favourite hobby is {hobby}. Every {day}, {p['he']} spends {NUMS[hours]} hours on it in {p['his']} {place}. "
               f"{p['He']} is never bored on that day. On Monday, {p['he']} goes back to school.")
    facts = [
        (f"{p['name']}'s hobby is {hobby}.", [f"{p['name']}'s hobby is {other(rng, hobby, hobbies)}."], f"favourite hobby is {hobby}"),
        (f"{p['name']} does {hobby} on {day}.", [f"{p['name']} does {hobby} on {other(rng, day, ['Saturday', 'Sunday'])}."], f"Every {day}"),
        (f"{p['name']} spends {NUMS[hours]} hours on it.", [f"{p['name']} spends {NUMS[hours + 2]} hours on it."], f"{NUMS[hours]} hours"),
        (f"{p['name']} does it in {p['his']} {place}.", [f"{p['name']} does it in {p['his']} {other(rng, place, ['room', 'garden', 'kitchen'])}."], f"in {p['his']} {place}"),
    ]
    return finish(rng, 'travel-places-leisure', passage, facts, 'hobby', locals().get('p'))


# ---- work, education, technology ---------------------------------------------------------------------------

JOBS = [('a teacher', 'school', 'students'), ('a nurse', 'hospital', 'patients'), ('a baker', 'bakery', 'bread'),
        ('a cook', 'restaurant', 'meals'), ('a vet', 'clinic', 'animals'), ('a driver', 'bus', 'passengers'),
        ('a shop assistant', 'shop', 'customers'), ('a farmer', 'farm', 'cows'), ('a waiter', 'restaurant', 'tables'),
        ('a doctor', 'hospital', 'patients'), ('a mechanic', 'garage', 'cars'), ('a librarian', 'library', 'books')]


def t_job(rng):
    p = person(rng)
    job, place, thing = rng.choice(JOBS)
    start = rng.choice(["seven o'clock", "eight o'clock", "nine o'clock"])
    end = rng.choice(["four o'clock", "five o'clock", "six o'clock"])
    days = rng.choice([4, 5, 6])
    passage = (f"{p['name']} is {job}. {p['He']} works at the {place} and helps {thing}. "
               f"{p['He']} starts work at {start} and finishes at {end}. {p['He']} works {NUMS[days]} days a week.")
    starts = ["seven o'clock", "eight o'clock", "nine o'clock"]
    ends = ["four o'clock", "five o'clock", "six o'clock"]
    other_job = other(rng, job, [j[0] for j in JOBS])
    facts = [
        (f"{p['name']} is {job}.", [f"{p['name']} is {other_job}."], f"is {job}"),
        (f"{p['name']} starts work at {start}.", [f"{p['name']} starts work at {other(rng, start, starts)}."], f"starts work at {start}"),
        (f"{p['name']} finishes work at {end}.", [f"{p['name']} finishes work at {other(rng, end, ends)}."], f"finishes at {end}"),
        (f"{p['name']} works {NUMS[days]} days a week.", [f"{p['name']} works {NUMS[days + 1] if days < 6 else NUMS[3]} days a week."], f"works {NUMS[days]} days a week"),
    ]
    return finish(rng, 'work-education-technology', passage, facts, 'job', locals().get('p'))


def t_school(rng):
    p = person(rng)
    subjects = rng.sample(['maths', 'English', 'history', 'geography', 'science', 'art', 'music', 'PE'], 4)
    day = rng.choice(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
    n = rng.randint(4, 7)
    time = rng.choice(['twelve', 'half past twelve', 'one'])
    time_txt = {'twelve': "twelve o'clock", 'half past twelve': 'half past twelve', 'one': "one o'clock"}[time]
    all_s = ['maths', 'English', 'history', 'geography', 'science', 'art', 'music', 'PE']
    fav = subjects[0]
    passage = (f"{p['name']} is a student. On {day}, {p['he']} has {NUMS[n]} lessons. {p['His']} favourite subject is {fav}. "
               f"{p['He']} has lunch at {time_txt}. After lunch, {p['he']} has {subjects[1]} and {subjects[2]}.")
    facts = [
        (f"{p['name']} has {NUMS[n]} lessons on {day}.", [f"{p['name']} has {NUMS[n + 1]} lessons on {day}."], f"has {NUMS[n]} lessons"),
        (f"{p['name']}'s favourite subject is {fav}.", [f"{p['name']}'s favourite subject is {other(rng, fav, all_s)}."], f"favourite subject is {fav}"),
        (f"{p['name']} has lunch at {time_txt}.", [f"{p['name']} has lunch at {other(rng, time_txt, LUNCH_TIMES)}."], f"lunch at {time_txt}"),
        (f"{p['name']} has {subjects[1]} after lunch.", [f"{p['name']} has {other(rng, subjects[1], [s for s in all_s if s not in subjects[:3]])} after lunch."], f"has {subjects[1]} and {subjects[2]}"),
    ]
    return finish(rng, 'work-education-technology', passage, facts, 'school', locals().get('p'))


def t_office(rng):
    p = person(rng)
    device = rng.choice(['laptop', 'computer', 'tablet'])
    n = rng.randint(3, 12)
    time = rng.choice(["ten o'clock", "eleven o'clock", "two o'clock", "three o'clock"])
    boss = rng.choice(FEM if rng.random() < 0.5 else MAS)
    times = ["ten o'clock", "eleven o'clock", "two o'clock", "three o'clock"]
    passage = (f"{p['name']} works in an office. Every day, {p['he']} uses a {device} and a phone. "
               f"{p['He']} writes {NUMS[n]} emails in the morning. At {time}, {p['he']} has a meeting with {p['his']} boss, {boss}.")
    devices = ['laptop', 'computer', 'tablet']
    facts = [
        (f"{p['name']} uses a {device} at work.", [f"{p['name']} uses a {other(rng, device, devices)} at work."], f"uses a {device}"),
        (f"{p['name']} writes {NUMS[n]} emails in the morning.", [f"{p['name']} writes {NUMS[n + 2]} emails in the morning."], f"writes {NUMS[n]} emails"),
        (f"The meeting is at {time}.", [f"The meeting is at {other(rng, time, times)}."], f"At {time}"),
        (f"The boss is {boss}.", [f"The boss is {other(rng, boss, FEM + MAS)}."], f"boss, {boss}"),
    ]
    return finish(rng, 'work-education-technology', passage, facts, 'office', locals().get('p'))


# ---- society, health, environment ------------------------------------------------------------------------

ANIMALS = [  # name, kind, home, food, legs, colour
    ('lion', 'wild cat', 'Africa', 'meat', 'four', 'yellow'), ('elephant', 'big animal', 'Africa', 'grass and leaves', 'four', 'grey'),
    ('penguin', 'bird', 'cold places', 'fish', 'two', 'black and white'), ('rabbit', 'small animal', 'fields', 'carrots and grass', 'four', 'white'),
    ('spider', 'small animal', 'houses and gardens', 'insects', 'eight', 'black'), ('cow', 'farm animal', 'farms', 'grass', 'four', 'brown'),
    ('giraffe', 'tall animal', 'Africa', 'leaves', 'four', 'yellow and brown'), ('duck', 'bird', 'lakes', 'bread and grass', 'two', 'white'),
    ('tiger', 'wild cat', 'Asia', 'meat', 'four', 'orange'), ('panda', 'bear', 'China', 'bamboo', 'four', 'black and white'),
    ('monkey', 'animal', 'forests', 'fruit', 'four', 'brown'), ('horse', 'farm animal', 'farms', 'grass', 'four', 'brown'),
    ('octopus', 'sea animal', 'the sea', 'crabs', 'eight', 'red'), ('kangaroo', 'animal', 'Australia', 'grass', 'four', 'brown'),
    ('owl', 'bird', 'forests', 'mice', 'two', 'brown'), ('frog', 'small animal', 'lakes', 'flies', 'four', 'green'),
]


def t_animal(rng):
    name, kind, home, food, legs, colour = rng.choice(ANIMALS)
    article = 'an' if name[0] in 'aeiou' else 'a'
    kind_art = 'an' if kind[0] in 'aeiou' else 'a'
    passage = (f"{article.capitalize()} {name} is {kind_art} {kind}. It lives in {home}. "
               f"It eats {food}. It has {legs} legs and it is {colour}. Many people love to see this animal in a book, in a film or at the zoo.")
    leg_nums = ['two', 'four', 'eight']
    foods = ['meat', 'grass', 'fish', 'leaves', 'fruit', 'insects']
    colours = ['black', 'white', 'brown', 'yellow', 'green', 'red', 'grey', 'orange']
    homes = ['Africa', 'Asia', 'Australia', 'forests', 'lakes', 'farms', 'the sea']
    facts = [
        (f"The {name} lives in {home}.", [f"The {name} lives in {other(rng, home, homes)}."], f"lives in {home}"),
        (f"The {name} has {legs} legs.", [f"The {name} has {other(rng, legs, leg_nums)} legs."], f"has {legs} legs"),
        (f"The {name} is {colour}.", [f"The {name} is {other(rng, colour, colours)}."], f"it is {colour}"),
        (f"The {name} eats {food}.", [f"The {name} eats {other(rng, food, foods)}."], f"It eats {food}"),
    ]
    return finish(rng, 'society-health-environment', passage, facts, 'animal', locals().get('p'))


def t_weather(rng):
    p = person(rng)
    city = rng.choice(CITIES)
    season = rng.choice(['summer', 'winter', 'spring', 'autumn'])
    weather = {'summer': ('hot', 'sunny', 'shorts'), 'winter': ('cold', 'snowy', 'a thick coat'),
               'spring': ('warm', 'rainy', 'a light jacket'), 'autumn': ('cool', 'windy', 'boots')}[season]
    seasons = ['summer', 'winter', 'spring', 'autumn']
    passage = (f"In {city}, {season} is {weather[0]} and {weather[1]}. People wear {weather[2]}. "
               f"{p['name']} lives in {city} and likes {season} very much. {p['He']} goes out every day, even when the weather is bad.")
    allw = {'summer': 'hot', 'winter': 'cold', 'spring': 'warm', 'autumn': 'cool'}
    facts = [
        (f"In {city}, {season} is {weather[0]}.", [f"In {city}, {season} is {allw[other(rng, season, seasons)]}."], f"{season} is {weather[0]}"),
        (f"{p['name']} likes {season}.", [f"{p['name']} likes {other(rng, season, seasons)}."], f"likes {season} very much"),
        (f"{p['name']} lives in {city}.", [f"{p['name']} lives in {other(rng, city, CITIES)}."], f"lives in {city}"),
        (f"In {season}, people wear {weather[2]}.", [f"In {season}, people wear {other(rng, weather[2], ['shorts', 'a thick coat', 'a light jacket', 'boots'])}."], f"People wear {weather[2]}"),
    ]
    return finish(rng, 'society-health-environment', passage, facts, 'weather', locals().get('p'))


def t_health(rng):
    p = person(rng)
    ache = rng.choice(['headache', 'stomachache', 'toothache', 'cough', 'fever'])
    day = rng.choice(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
    days = rng.randint(2, 5)
    drink = rng.choice(['water', 'tea', 'juice'])
    aches = ['headache', 'stomachache', 'toothache', 'cough', 'fever']
    art = 'a' if ache != 'cough' else 'a'
    passage = (f"{p['name']} has {art} {ache}. On {day}, {p['he']} goes to the doctor. The doctor says: stay in bed for {NUMS[days]} days "
               f"and drink a lot of {drink}. {p['name']} stays at home and takes some medicine.")
    facts = [
        (f"{p['name']} has {art} {ache}.", [f"{p['name']} has a {other(rng, ache, aches)}."], f"has {art} {ache}"),
        (f"{p['name']} goes to the doctor on {day}.", [f"{p['name']} goes to the doctor on {other(rng, day, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])}."], f"On {day}"),
        (f"{p['name']} must stay in bed for {NUMS[days]} days.", [f"{p['name']} must stay in bed for {NUMS[days + 2]} days."], f"stay in bed for {NUMS[days]} days"),
        (f"The doctor says to drink {drink}.", [f"The doctor says to drink {other(rng, drink, ['water', 'tea', 'juice'])}."], f"drink a lot of {drink}"),
    ]
    return finish(rng, 'society-health-environment', passage, facts, 'health', locals().get('p'))


def t_nature(rng):
    p = person(rng)
    spot = rng.choice(['river', 'forest', 'lake', 'mountain', 'beach'])
    spots = ['river', 'forest', 'lake', 'mountain', 'beach']
    season = rng.choice(['spring', 'summer', 'autumn'])
    pet = rng.choice(['dog', 'sister', 'brother', 'friend'])
    material = rng.choice(['paper', 'plastic', 'glass'])
    passage = (f"{p['name']} lives near a {spot}. Every {season}, {p['he']} walks there with {p['his']} {pet}. "
               f"{p['He']} loves nature and puts all the rubbish in the bin. At home, {p['he']} recycles {material} every week.")
    facts = [
        (f"{p['name']} lives near a {spot}.", [f"{p['name']} lives near a {other(rng, spot, spots)}."], f"lives near a {spot}"),
        (f"{p['name']} walks there in {season}.", [f"{p['name']} walks there in {other(rng, season, ['spring', 'summer', 'autumn'])}."], f"Every {season}"),
        (f"{p['name']} walks with {p['his']} {pet}.", [f"{p['name']} walks with {p['his']} {other(rng, pet, ['dog', 'sister', 'brother', 'friend'])}."], f"with {p['his']} {pet}"),
        (f"{p['name']} recycles {material}.", [f"{p['name']} recycles {other(rng, material, ['paper', 'plastic', 'glass'])}."], f"recycles {material}"),
    ]
    return finish(rng, 'society-health-environment', passage, facts, 'nature', locals().get('p'))


TEMPLATES = {
    'everyday-life': [t_profile, t_routine, t_lunch, t_bedroom, t_party, t_shopping],
    'travel-places-leisure': [t_town, t_holiday, t_sport, t_hobby],
    'work-education-technology': [t_job, t_school, t_office],
    'society-health-environment': [t_animal, t_weather, t_health, t_nature],
}

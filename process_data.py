import json
sus_stages = [
    11,
    15,
    19
]

sus_questions = [
    "I think that I would like to use this system frequently",
    "I found the system unnecessarily complex",
    "I thought the system was easy to use",
    "I think that I would need the support of a technical person to be able to use this system",
    "I found the various functions in this system were well integrated",
    "I thought there was too much inconsistency in this system",
    "I would imagine that most people would learn to use this system very quickly",
    "I found the system very cumbersome to use",
    "I felt very confident using the system",
    "I needed to learn a lot of things before I could get going with this system",
]

mrt_answers =\
    [[1, 3],
    [1, 4],
    [2, 4],
    [2, 3],
    [1, 3],
    [1, 4],
    [2, 4],
    [2, 3],
    [2, 4],
    [1, 4],
    [3, 4],
    [2, 3],
    [1, 2],
    [2, 4],
    [2, 3],
    [1, 4],
    [2, 4],
    [2, 3],
    [1, 3],
    [1, 4],
    [2, 4],
    [2, 3],
    [1, 4],
    [1, 3]]

def mark(path):
    data = []
    with open(path) as f:
        data = json.loads("\n".join(f.readlines()))
    print(compile_sus(data))

def get_stage(stage, data):
    return list(filter(lambda x: "pipeline_index" in x[2] and x[2]["pipeline_index"] == stage, data))

def get_mrt_answers(data):
    return list(filter(lambda x: x[3] == 'mrt test results', get_stage(5, data)))[0][4]

def get_sus_answers(data):
    answers = []
    for i in sus_stages:
        answers.append(get_stage(i, data)[0][4:6])
    return answers

def mark_mrt(data):
    score = 0
    form_q = lambda q_num,model_num: "test_{0}_{1}".format(q_num, model_num)
    answers = get_mrt_answers(data)
    for i, memo in enumerate(mrt_answers):
        q_num = i
        if form_q(q_num, memo[0]) in answers and form_q(q_num, memo[1]) in answers:
            score += 1
    return score

def compile_sus(data):
    answers = get_sus_answers(data)
    sorted_answers = {}
    for answer in answers:
        controller = answer[0]
        usability = sorted([tuple([int(x) for x in a.split("_")]) for a in answer[1] if answer[1][a]])
        sorted_answers[controller] = usability
    return sorted_answers

mark("data/0.json")

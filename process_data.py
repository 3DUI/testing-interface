import json
from datetime import datetime
from scipy import stats
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

total_stages = 20

controllers = ["twoaxis","arcball","discrete"]

def parse(path):
    data = []
    with open(path) as f:
        data = json.loads("\n".join(f.readlines()))
    return data

def get_stage(stage, data):
    return list(filter(lambda x: "pipeline_index" in x[2] and x[2]["pipeline_index"] == stage, data))

def get_stage_with(name, stage, data):
    return list(filter(lambda x: x[3] == name, get_stage(stage, data)))

def get_sus_answers(data):
    answers = []
    for i in sus_stages:
        answers.append(get_stage(i, data)[0][4:6])
    return answers

def get_mrt_answers(data):
    return get_stage_with('mrt test results', 5, data)[0][4]

def get_starting_times(data):
    stages = [get_stage_with('running pipeline index', i, data)[0] for i in range(20)]
    return sorted(list(map(lambda x: (x[2]["pipeline_index"], parse_date(x[1])), stages)))

def parse_date(js_date):
    """
    Example input date: "2015-09-03T20:03:09.429Z"

    This is then transformed to
        2015-09-03 20:03:09

    Which is then made into a python datetime object
    """
    template = "%Y-%m-%d %H:%M:%S"
    formatted_date = js_date.replace("T"," ").replace("Z","").split(".")[0]
    return datetime.strptime(formatted_date, template)

def get_length_of_experiment(data):
    times = get_starting_times(data)
    return (times[-1][1] - times[0][1]).total_seconds()

def get_lengths_stages(data):
    times = get_starting_times(data)
    return [(times[x+1][1] - times[x][1]).total_seconds() for x in range(total_stages-1)]

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
    compiled_answers = {}
    for answer in answers:
        controller = answer[0]
        usability = [tuple([int(x) for x in a.split("_")]) for a in answer[1] if answer[1][a]]
        compiled_answers[controller] = dict(usability)
    return compiled_answers

def mark_sus(data):
    answers = compile_sus(data)
    marks = {}
    for controller in controllers:
        sus = answers[controller]
        score = 0
        total = 0
        for i in range(0,10,2):
            if i in sus:
                score += sus[i]
                total += 4

        for i in range(1,10,2):
            if i in sus:
                score += 5 - (sus[i] + 1)
                total += 4

        score *= 2.5
        total *= 2.5
        if total == 100:
            marks[controller] = score
    return marks

def report_sus(paths):
    controller_data = {controller:[] for controller in controllers}
    for path in paths:
        scores = mark_sus(parse(path))
        for key in scores:
            controller_data[key].append(scores[key])
            controller_data[key].sort()

    stats = {controller:desc_stats(controller_data[controller]) for controller in controllers}
    sig = significance([controller_data[key] for key in controller_data])
    return {"raw_data": controller_data, "stats": stats, "sig":sig}

def desc_stats(arr):
    """
    Give a description of descriptive stats for an array
    """
    median = 0
    middle_index = len(arr)//2
    if len(arr) % 2:
        median = (arr[middle_index] + arr[middle_index + 1])/2
    else:
        median = arr[middle_index + 1]

    return (len(arr), min(arr), median, max(arr), sum(arr)/len(arr))

def significance(arrs):
    """
    Run Anova and post-hoc significance test to determine significance
    """
    return stats.f_oneway(*arrs)

paths = ["data/{0}.json".format(i) for i in range(1,5)]
print(report_sus(paths))

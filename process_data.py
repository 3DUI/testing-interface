import json
import os
import math
from datetime import datetime
from scipy import stats
from collections import defaultdict, namedtuple
SUS_STAGES = [
    13,
    18,
    23
]

TASK_STAGES = [
    12,
    17,
    22
]

TRAINING_STAGES = [
    10,
    15,
    20
]

MRT_STAGE = 5

ORIENTATION_TASK_QUAT = {
    "0_0": [0.25881904510252074,0,0,0.9659258262890683],
    "0_1": [0,0,0.7071067811865475,0.7071067811865476],
    "0_2": [0.3314135740355918,0.4619397662556433,0.19134171618254486,0.8001031451912656],
    "0_3": [0.2185080122244105,0.21850801222441052,0.6724985119639573,0.6724985119639574],
    "1_0": [0.04799966634373737,0.7856544802373238,0.11573312388031406,-0.6058456187435991],
    "1_1": [-0.9124677834418226,0.3563393717894529,0.16246581417319952,-0.11844684680693215],
    "1_2": [0.060676044258967846,0.7425536630010398,-0.09767856431944423,-0.6598419305328469]
}

INSPECTION_TASK_QUAT = {
    "2_0":[0.6228684391534324,-0.47348903397844655,0.3567527821077567,-0.5104610608725213],
    "2_1":[-0.533966817396014,-0.5651774758681182,-0.4601635612922124,-0.428606294342702],
    "2_2":[-0.05030822616001109,0.9948785161788547,-0.08766878450590904,0.00006818834234121639],
    "2_3":[-0.000049693290986342606,0.7673132076626328,0.00004187190621293386,0.6412725139313251],
    "2_4":[0.04175826956285454,0.7751479845620929,0.018942573730028438,-0.6301135039442686]
}

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
CONTROLLERS = ["twoaxis","arcball","discrete"]
directory = "data/study"

Event = namedtuple('Event', ["meta", "data"])
EventMeta = namedtuple('EventMeta', ["uuid","pipeline_index","participant_number", "date"])
EventData = namedtuple('EventData', ["raw"])
MRTData = namedtuple('MRTData', ["marks", "score"])
SUSData = namedtuple('SUSData', ["marks", "score", "total", "controller", "text"])
TaskData = namedtuple('TaskData', ["meta", "info", "score"]);
TaskMeta = namedtuple('TaskMeta', ["type", "num", "repetition", "date"])
TaskInfo = namedtuple('TaskInfo', ["controller", "group", "index", "model", "rotation", "quaternion"])
TaskScore = namedtuple('TaskScore', ["time", "accuracy"])
Experiment = namedtuple('Experiment', ["num", "controllers", "models"])

def inner_prod(q_1, q_2):
    s = 0
    for a,b in zip(q_1, q_2):
        s += a*b
    return s

def dist(q_1, q_2):
    return math.acos(2 * (inner_prod(q_1, q_2)**2) - 1)

def mult(q_1, q_2):
    x1, y1, z1, w1 = q_1
    x2, y2, z2, w2 = q_2
    w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2
    x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2
    y = w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2
    z = w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2
    return (x, y, z, w)

def conj(q):
     x, y, z, w = q
     return (-x, -y, -z, w)

def rotate(vec, q):
    q_2 = vec + (0.0,)
    return mult(mult(q, q_2), conj(q))[:-1]

def gen_experiment(num):
    """
    Determine the order in which controllers and models were presented to a participant with a given number
    """
    controllerOptions = [["discrete", "twoaxis", "arcball"], ["discrete", "arcball", "twoaxis"], ["twoaxis", "discrete", "arcball"], ["twoaxis", "arcball", "discrete"], ["arcball", "discrete", "twoaxis"], ["arcball", "twoaxis", "discrete"]]
    modelOptions = [["models/mrt_model.json", "models/mrt_model_16a.json", "models/mrt_model_23a.json"], ["models/mrt_model.json", "models/mrt_model_23a.json", "models/mrt_model_16a.json"], ["models/mrt_model_16a.json", "models/mrt_model.json", "models/mrt_model_23a.json"], ["models/mrt_model_16a.json", "models/mrt_model_23a.json", "models/mrt_model.json"], ["models/mrt_model_23a.json", "models/mrt_model.json", "models/mrt_model_16a.json"], ["models/mrt_model_23a.json", "models/mrt_model_16a.json", "models/mrt_model.json"]]
    controllerChoiceNum = num % len(controllerOptions)
    modelChoiceNum = int(num / len(modelOptions)) % len(modelOptions)
    controllerChoice = controllerOptions[controllerChoiceNum]
    modelChoice = modelOptions[modelChoiceNum]
    return Experiment(num, controllerChoice, modelChoice)

def paths(directory):
    """
    Gives all the paths in the directory that don't begin with "."
    """
    return list(map(lambda x: "{0}/{1}".format(directory, x), filter(lambda x: x[0] != ".", os.listdir("data/study"))))

def parse_path(path):
    """
    Takes a path, reads it in, gives back the JSON
    """
    data = None
    with open(path) as f:
        file_data = "\n".join(f.readlines()).strip() # remove final newline
        file_data = file_data[1:-1] # remove quotation signs
        data = json.loads(file_data)
    return data

def data(directory):
    """
    Gets the parsed json data for each file in the directory
    """
    return list(map(lambda x: parse_path(x), paths(directory)))

def get_meta_from(event):
    return event[2]

def get_num_from(event):
    """
    Get the participant number from a specific event log
    """
    meta = get_meta_from(event)
    if "participant_number" in meta:
        return meta["participant_number"]
    else:
        return 0

def get_stage_from(event):
    """
    Get the stage number from a specific event log
    """
    return get_meta_from(event)["pipeline_index"]

def get_date_from(event):
    """
    Get the event from a specific event log
    """
    return parse_date(event[1])

def parse_date(js_date):
    """
    Example input date: "2015-09-03T20:03:09.429Z"
    This is then transformed to
    2015-09-03 20:03:09

    Which is then made into a python datetime object
    Gives all the paths in the directory that don't begin with "."
    """
    template = "%Y-%m-%d %H:%M:%S"
    formatted_date = js_date.replace("T"," ").replace("Z","").split(".")[0]
    return datetime.strptime(formatted_date, template)

def build_people(data):
    """
    From parsed json data, get a list of people
    """
    people = dict()
    for datum in data:
        for event in datum:
            num = get_num_from(event)
            if num:
                if num not in people:
                    people[num] = Person(num)
                people[num].add_event(event)
    return people


class Person:
    def __init__(self, num):
        self.num = num
        self.experiment = gen_experiment(num)
        self.raw_events = []
        self.events = []
        self.mrt_results = []
        self.sus_results = []
        self.tasks = defaultdict(lambda : defaultdict(dict))
        self.training_tasks = defaultdict(lambda : defaultdict(dict))

        self.event_processors = [
            (
                lambda event_meta, event_data:
                    event_data[0] == "mrt test results",
                self.process_mrt
            ),
            (
                lambda event_meta, event_data:
                    event_data[0] == "sus evaluation results",
                self.process_sus
            ),
            (
                lambda event_meta, event_data:
                    event_data[0] == "saving user task",
                self.process_task
            )
        ]

    def process_mrt(self, event_meta, event_data):
        template = "test_{0}_{1}"
        data = event_data[1]
        marks = []
        for i, answers in enumerate(mrt_answers):
            answer_1 = template.format(i, answers[0])
            answer_2 = template.format(i, answers[1])
            if all([((answer in data) and data[answer]) for answer in (answer_1, answer_2)]):
                marks.append(True)
            else:
                marks.append(False)
        mrt_data = MRTData(marks, marks.count(True))
        self.mrt_results.append(mrt_data)
        return mrt_data

    def process_sus(self, event_meta, event_data):
        controller = event_data[1]
        # Load events
        data = event_data[2]
        marks = [None]*10
        for key in data:
            if data[key] and key != "text":
               num, answer = [int(x) for x in key.split("_")]
               marks[num] = answer
        # Calculate score
        score = 0
        total = 0
        for i in range(len(marks)):
            if marks[i] != None:
                if i % 2 == 0:
                    score += marks[i]
                    total += 4
                else:
                    score += 5 - (marks[i] + 1)
                    total += 4

        score *= 2.5
        total *= 2.5

        sus_data = SUSData(marks, score, total, controller, data["text"] if "text" in data else "")
        self.sus_results.append(sus_data)
        return sus_data

    def process_task(self, event_meta, event_data):
        group = event_data[1]
        index = event_data[2]
        rotation = event_data[3]
        quaternion = event_data[4]

        stage = event_meta.pipeline_index
        task_type = None
        repetition = None
        container = None
        if stage in TASK_STAGES:
            task_type = "task"
            repetition = TASK_STAGES.index(stage)
            container = self.tasks
        elif stage in TRAINING_STAGES:
            task_type = "training"
            repetition  = TRAINING_STAGES.index(stage)
            container = self.training_tasks
        controller = self.experiment.controllers[repetition]
        model = self.experiment.models[repetition]
        num = len(container[controller])
        time = (event_meta.date - self.events[-1].meta.date).total_seconds()
        accuracy = None
        key = "{0}_{1}".format(group, index)
        if group < 2:
            model_quat = ORIENTATION_TASK_QUAT[key]
            accuracy = dist(model_quat, quaternion)
        else:
            if group > 2:
                accuracy = 0 # TODO
            else:
                ref_quat = INSPECTION_TASK_QUAT[key]
                ref_vec = (0,0,1)
                start_vec = rotate(ref_vec, ref_quat)
                end_vec = rotate(ref_vec, quaternion)
                accuracy = math.acos(inner_prod(start_vec, end_vec))
                if accuracy > math.pi / 2.0:
                    accuracy -= math.pi / 2.0
        score = TaskScore(time, accuracy) # TODO
        info = TaskInfo(controller, group, index, model, rotation, quaternion)
        meta = TaskMeta(task_type, num, repetition, event_meta.date)
        task_data = TaskData(meta, info, score)
        container[controller][group][index] = task_data
        return task_data

    def add_event(self, event):
        self.raw_events.append(event)
        event_meta = EventMeta(
                event[2]["uuid"],
                event[2]["pipeline_index"],
                event[2]["participant_number"],
                parse_date(event[1]))

        event_data = EventData(event[3:])
        for processor in self.event_processors:
            if processor[0](event_meta, event[3:]):
                event_data = processor[1](event_meta, event[3:])
                break

        processed_event = Event(event_meta, event_data)
        self.events.append(processed_event)

    def events_at_stage(self, stage):
        return filter(lambda event: event.meta.pipeline_index == stage, self.events)

    def mrt(self):
        return self.mrt_results[0]

    def sus(self, controller):
        return list(filter(lambda data: data.controller == controller, self.sus_results))[0]

    def validate(self):
        num_mrt = len(self.mrt_results)
        sus_keys = {result.controller for result in self.sus_results}
        num_sus = len(self.sus_results)
        totals_sus = [result.total for result in self.sus_results]
        valid_elms = (
          num_mrt == 1,
          sus_keys == set(CONTROLLERS),
          num_sus == 3,
          all(total == 100 for total in totals_sus),
        )
        valid = all(valid_elms)
        if not valid:
            print("Person invalid", valid_elms)
        return valid

def process():
    full_data = data(directory)
    people = build_people(full_data)
    return people

def check_valid(people):
    entries = []
    for num in people:
        person = people[num]
        entries.append(person.validate())
    return entries

def desc_stats(arr):
    """
    Give a description of descriptive stats for an array
    """
    median = 0
    middle_index = len(arr)//2
    if len(arr) % 2:
        median = (arr[middle_index] + arr[middle_index + 1])/2.0
    else:
        median = arr[middle_index + 1]
    return (len(arr), min(arr), median, max(arr), sum(arr)/float(len(arr)))

def report_per_controller(header, controller_points):
    output = header + "\n"
    output += "name, n, min, median, max, avg\n"
    output += "\n".join([controller + ", " + ", ".join([str(x) for x in desc_stats(controller_points[controller])]) for controller in CONTROLLERS])
    output += "\n\n"
    return output

def iterate_controller_people(people, fn):
    for controller in CONTROLLERS:
        for num in people:
            person = people[num]
            fn(controller, person)

def report():
    """
    Construct a report of the data gathered
    """
    # Process data into people
    people = process()

    # What will be returned
    output = ""

    # Overall usability scores
    con_sus_score = defaultdict(list)
    iterate_controller_people(people, lambda controller, person:
        con_sus_score[controller].append(person.sus(controller).score))
    output += report_per_controller("Overall SUS Usability score results", con_sus_score)

    # Overall time results
    con_task_time = defaultdict(list)
    iterate_controller_people(people, lambda controller, person:
        con_task_time[controller].extend(
            [person.tasks[controller][group][index].score.time
                for group in person.tasks[controller]
                for index in person.tasks[controller][group]
            ]
        )
    )
    output += report_per_controller("Overall time score results", con_task_time)

    # Overall accuracy results
    con_task_accuracy = defaultdict(list)
    iterate_controller_people(people, lambda controller, person:
        con_task_accuracy[controller].extend(
            [person.tasks[controller][group][index].score.accuracy
                for group in person.tasks[controller]
                for index in person.tasks[controller][group]
            ]
        )
    )
    output += report_per_controller("Overall accuracy score results", con_task_accuracy)

    # Looking at the individual answers for each sus question
    indi_sus_score = defaultdict(lambda: defaultdict(list))
    def get_indi_score(controller, person):
        for i, mark in enumerate(person.sus(controller).marks):
            indi_sus_score[controller][i].append(mark)

    iterate_controller_people(people, get_indi_score)

    output += "SUS Usability answer per question\n"
    output += "question, controller, name, n, min, median, max, avg\n"
    for i in range(10):
        for controller in CONTROLLERS:
            stats = desc_stats([x for x in indi_sus_score[controller][i] if x != None])
            output += ", ".join([str(i), controller] + [str(x) for x in stats]) + "\n"

    # Looking at the time taken for each task
    indi_task_time = defaultdict(lambda: defaultdict( lambda: defaultdict(list)))
    def get_indi_time(controller, person):
        for group in person.tasks[controller]:
            for index in person.tasks[controller][group]:
                indi_task_time[controller][group][index].append(person.tasks[controller][group][index].score.time)

    iterate_controller_people(people, get_indi_time)

    output += "Task Time per task\n"
    output += "group, index, controller, name, n, min, median, max, avg\n"
    for controller in indi_task_time:
        for group in indi_task_time[controller]:
            for index in indi_task_time[controller][group]:
                stats = desc_stats(indi_task_time[controller][group][index])
                output += ", ".join([str(group), str(index), controller] + [str(x) for x in stats]) + "\n"

    # Looking at the accuracy for each task
    indi_task_acc = defaultdict(lambda: defaultdict( lambda: defaultdict(list)))
    def get_indi_time(controller, person):
        for group in person.tasks[controller]:
            for index in person.tasks[controller][group]:
                indi_task_acc[controller][group][index].append(person.tasks[controller][group][index].score.accuracy)

    iterate_controller_people(people, get_indi_time)

    output += "Task Accuracy per task\n"
    output += "group, index, controller, name, n, min, median, max, avg\n"
    for controller in indi_task_acc:
        for group in indi_task_acc[controller]:
            for index in indi_task_acc[controller][group]:
                stats = desc_stats(indi_task_acc[controller][group][index])
                output += ", ".join([str(group), str(index), controller] + [str(x) for x in stats]) + "\n"
    # Done! :)
    return output

print(report())

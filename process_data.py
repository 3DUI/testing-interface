import json
import os
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

Event = namedtuple('Event', ["date", "meta", "data"])
EventMeta = namedtuple('EventMeta', ["uuid","pipeline_index","participant_number"])
EventData = namedtuple('EventData', ["raw"])
MRTData = namedtuple('MRTData', ["marks", "score"])
SUSData = namedtuple('SUSData', ["marks", "score", "total", "controller", "text"])
TaskData = namedtuple('TaskData', ["meta", "info", "score"]);
TaskMeta = namedtuple('TaskMeta', ["type", "num", "repetition"])
TaskInfo = namedtuple('TaskInfo', ["controller", "group", "index", "model", "rotation", "quaternion"])
TaskScore = namedtuple('TaskScore', ["time", "accuracy"])
Experiment = namedtuple('Experiment', ["num", "controllers", "models"])

def gen_experiment(num):
    """
    Determine the order in which controllers and models were presented to a participant with a given number
    """
    controllerOptions = [["discrete", "twoaxis", "arcball"], ["discrete", "arcball", "twoaxis"], ["twoaxis", "discrete", "arcball"], ["twoaxis", "arcball", "discrete"], ["arcball", "discrete", "twoaxis"], ["arcball", "twoaxis", "discrete"]]
    modelOptions = [["models/mrt_model.json", "models/mrt_model_16a.json", "models/mrt_model_23a.json"], ["models/mrt_model.json", "models/mrt_model_23a.json", "models/mrt_model_16a.json"], ["models/mrt_model_16a.json", "models/mrt_model.json", "models/mrt_model_23a.json"], ["models/mrt_model_16a.json", "models/mrt_model_23a.json", "models/mrt_model.json"], ["models/mrt_model_23a.json", "models/mrt_model.json", "models/mrt_model_16a.json"], ["models/mrt_model_23a.json", "models/mrt_model_16a.json", "models/mrt_model.json"]]
    controllerChoiceNum = num % len(controllerOptions)
    modelChoiceNum = int(num / len(modelOptions)) % len(modelOptions)
    controllerChoice = controllerOptions[controllerChoiceNum],
    modelChoice = modelOptions[modelChoiceNum],
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
        self.tasks = defaultdict(list)
        self.training_tasks = defaultdict(list)

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
        print(self.experiment.controllers)
        model = self.experiment.models[repetition]
        num = len(container[controller])

        score = TaskScore(0,0) # TODO
        info = TaskInfo(controller, group, index, model, rotation, quaternion)
        meta = TaskMeta(task_type, num, repetition)
        task_data = TaskData(meta, info, score)
        container[controller].append(task_data)
        return task_data

    def add_event(self, event):
        self.raw_events.append(event)
        event_meta = EventMeta(
                event[2]["uuid"],
                event[2]["pipeline_index"],
                event[2]["participant_number"])

        event_data = EventData(event[3:])
        for processor in self.event_processors:
            if processor[0](event_meta, event[3:]):
                event_data = processor[1](event_meta, event[3:])
                break

        processed_event = Event(parse_date(event[1]), event_meta, event_data)
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

people = process()
print(check_valid(process()))
print(process()[1].experiment)

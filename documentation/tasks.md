# Tasks

Here we describe the interface as a whole, along with how to complete each task.

## Interface

![Experiment Interface](images/interface.png)

The experimental interface has five sections. In the above, we have divided in into several vertical sections which we have explained below.

1. __Title__: The title gives you the current controller you are testing, along with how many tasks you have left. Here, we are testing the Discrete Controller (shown in the _Model to Rotate_ screen in section 4) and we are on task 1 of 8.
2. __Instructions__: This section gives you instructions for how to complete the current task. Here we can see we are completing an _Orientation Task_ where we have to rotate an object to match the orientation of another object. More full instructions for the types of tasks are given below.
3. __Time taken__: This is a timer showing the time taken for the current task. 
4. __3D Views__: This section contains the 3D rendered scenes. This view depends on the type of task being completed, and the rotation controller being used.
5. __Task Controls__: These buttons allow you to 
    -  _Submit Task_: submit the current task when you have completed it.
    - _Reset Orientation_: Reset the orientation of your model to its starting orientation.

## Orientation Matching

![Orientation Tasks](images/orientation_task.png)

Orientation matching tasks involve you rotating a model to match the orientation of another model. You will be presented with two views:

- __Reference Orientation__: This is the orientation that you want to manipulate your model to match.
- __Model to Rotate__: This is the model you will be rotating to match the _Reference Orientation's_ model.

Please look at the controller documentation for how to manipulate the models.

## Inspection

![Inspection Tasks](images/inspection_task.png)

Inspection matching tasks involve you trying to find a red patch on the model you're rotating. Here, there is only one screen: __Model to Rotate__. You must rotate this model until you find the red patch as shown in the image above.

Please look at the controller documentation for how to manipulate the models.

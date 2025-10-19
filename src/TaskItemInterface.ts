/*
    File: TaskItemInterface.ts
    Written by: Raymond Zhou
    Date: July 12, 2024

    Description: Interface component that is used to store the task string and completion status of each task when
                 the user generates a new task. The task string contains the user input and the complete boolean
                 is set to false by default during the useState stage in the ToDoBody component.

    References:
    1. https://www.youtube.com/watch?v=bjnW2NLAofI&t=775s - Video shows the use of this kind of interface.
*/

export interface TaskItem {
    task : string
    complete : boolean
}
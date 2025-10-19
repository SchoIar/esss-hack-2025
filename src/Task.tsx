/*
    File: Task.tsx
    Written by: Raymond Zhou
    Date: July 12, 2024

    Description: Task.tsx is the component that contains the structure of a singular task entry on the To Do List.
                 Functions that manipulate the states are passed in using props as well as the TaskItem object.

    References:
    1. https://www.w3schools.com/typescript/ - Quick Glimpse of the syntax of TypeScript
    2. https://www.youtube.com/watch?v=SqcY0GlETPk&t=557s - Understanding React's useState / passing functions by props
    3. https://www.youtube.com/watch?v=bjnW2NLAofI&t=775s - Example To Do Project - Understanding the ability to utilise interfaces to
                                                            hold data as well as assigning props a type when passing them to another
                                                            component.
*/

import { TaskItem } from './TaskItemInterface';

//interface used to give the taskItem parameter a type
interface Prop{
    item : TaskItem
    decrementTaskCounter() : void
    deleteEntry( task : TaskItem ) : void
}

export const Task = ({item, decrementTaskCounter, deleteEntry} : Prop) => {

    const markAsComplete = () : void => {
        if (!item.complete) {
            decrementTaskCounter();
        }
        
        item.complete = true;
    }
    
    const deleteSelf = () : void => {
        deleteEntry(item);
    }

    return (
        <div className='TaskEntry'>
            <i className= {!item.complete ? 'taskDescription' : 'taskDescriptionDone'}  >{item.task}</i>
            <div className='buttonGroup'>
                <button className='TaskComplete' onClick={markAsComplete}><i className='text'> Complete </i></button>
                <button className='TaskRemove' onClick={deleteSelf}><i className='text'> X </i></button>
            </div>
        </div>
    );
}



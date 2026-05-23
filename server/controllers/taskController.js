const taskModel = require('../Models/taskModel');

exports.createTask = async(req, res, next) => {

    const {title} = req.body;

    try{
        await taskModel.createTask(req.user.id, title);
        res.status(201).json({message: 'Task created'})
    }catch(err){
        console.log(err);
        res.status(401).json({message: 'Internal Server Error'});
    }
}

exports.getTasks = async(req, res, next) => {
    try{
        const tasks = await taskModel.getTasks(req.user.id);
        res.json(tasks);
    }catch(err){
        res.status(500).json({ message: 'Error fetching tasks' });
    }
}

exports.updateTask = async(req, res) => {

    const { id } = req.params;
    const { completed } = req.body;

    try {

        await taskModel.updateTask(
            id,
            req.user.id,
            completed
        );

        res.json({
            message: 'Task Updated'
        });

    } catch(err){

        console.log(err);

        res.status(500).json({
            message: 'Error updating task'
        });
    }
}

exports.deleteTask = async (req, res) => {
    const {id} = req.params;

    try{
        await taskModel.deleteTask(id, req.user.id);
        res.json({message: 'Task deleted'})
    }
    catch(err){
        res.status(500).json({ message: 'Error deleting task' });
    }
}